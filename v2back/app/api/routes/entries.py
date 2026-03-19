"""
/api/entries — тэмдэглэлийн CRUD endpoint-ууд.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.entry import (
    EntryCreateRequest,
    EntryCreateResponse,
    EntryResponse,
    PaginatedEntryResponse,
)
from app.services.auth_service import get_current_user
from app.services.journal_service import JournalService
from app.db.supabase import get_anon_client
from app.db.redis_client import get_analysis_queue, get_deep_insight_queue

router = APIRouter(prefix="/entries", tags=["Тэмдэглэл"])


def _get_journal_service() -> JournalService:
    return JournalService(get_anon_client())


@router.get("/", response_model=PaginatedEntryResponse)
async def list_entries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    user: dict = Depends(get_current_user),
    journal: JournalService = Depends(_get_journal_service),
):
    """Тэмдэглэлүүдийн жагсаалт. Хайлт хийх боломжтой."""
    return journal.fetch_entries(user["id"], page, page_size, search)


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_entry(
    entry_id: str,
    user: dict = Depends(get_current_user),
    journal: JournalService = Depends(_get_journal_service),
):
    """Тэмдэглэлийн дэлгэрэнгүй (Seed Insight + Analysis хамт)."""
    entry = journal.fetch_entry(entry_id, user["id"])
    if not entry:
        raise HTTPException(status_code=404, detail="Тэмдэглэл олдсонгүй")
    return entry


@router.post(
    "/",
    response_model=EntryCreateResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_entry(
    data: EntryCreateRequest,
    user: dict = Depends(get_current_user),
    journal: JournalService = Depends(_get_journal_service),
):
    """
    Тэмдэглэл үүсгэж шинжилгээг Redis Queue-д илгээнэ.
    202 Accepted — шинжилгээ async явна.
    Явцыг WS /ws/entry:{entry_id}-аар хянана.
    """
    user_id = user["id"]
    entry = journal.create_entry(user_id, data)
    entry_id = entry["id"]

    _enqueue_analysis(entry_id, user_id, data)

    # count = journal.count_user_entries(user_id)
    # if journal.should_trigger_deep_insight(count):
    #     get_deep_insight_queue().enqueue(
    #         "app.workers.jobs.process_deep_insight",
    #         user_id=user_id,
    #         job_timeout=300,
    #     )

    return EntryCreateResponse(
        entry_id=entry_id,
        status="queued",
        message="Тэмдэглэл хадгалагдлаа. Шинжилгээ явж байна...",
        ws_channel=f"entry:{entry_id}",
    )


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: str,
    user: dict = Depends(get_current_user),
    journal: JournalService = Depends(_get_journal_service),
):
    """Тэмдэглэл устгана (CASCADE: analysis, insight хамт устна)."""
    if not journal.delete_entry(entry_id, user["id"]):
        raise HTTPException(status_code=404, detail="Тэмдэглэл олдсонгүй")


def _enqueue_analysis(
    entry_id: str, user_id: str, data: EntryCreateRequest
) -> None:
    get_analysis_queue().enqueue(
        "app.workers.jobs.process_entry_analysis",
        entry_id=entry_id,
        user_id=user_id,
        entry_text={
            "surface": data.surface_text,
            "inner": data.inner_reaction_text,
            "meaning": data.meaning_text,
        },
        job_timeout=120,
    )
