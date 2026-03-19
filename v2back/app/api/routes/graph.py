"""
/api/graph — үнэт зүйлсийн граф болон insight endpoint-ууд.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.auth_service import get_current_user
from app.services.journal_service import JournalService
from app.db.supabase import get_anon_client

router = APIRouter(tags=["Граф ба Insight"])


def _get_journal_service() -> JournalService:
    return JournalService(get_anon_client())


@router.get("/graph")
async def get_value_graph(
    user: dict = Depends(get_current_user),
    journal: JournalService = Depends(_get_journal_service),
):
    """React Flow-д зориулсан үнэт зүйлсийн граф."""
    graph = journal.fetch_value_graph(user["id"])
    if not graph["nodes"]:
        return {
            "nodes": [],
            "edges": [],
            "message": "Мэдээлэл одоогоор хангалтгүй байна",
        }
    return graph


@router.get("/insights/deep")
async def list_deep_insights(
    user: dict = Depends(get_current_user),
):
    """Хэрэглэгчийн Deep Insight жагсаалт."""
    db = get_anon_client()
    result = (
        db.table("deep_insights")
        .select("*")
        .eq("user_id", user["id"])
        .order("generated_at", desc=True)
        .limit(10)
        .execute()
    )
    return result.data


@router.get("/insights/seed/{entry_id}")
async def get_seed_insight(
    entry_id: str,
    user: dict = Depends(get_current_user),
):
    """Тэмдэглэлийн Seed Insight (mirror, reframe, relief, summary)."""
    db = get_anon_client()

    entry = (
        db.table("journal_entries")
        .select("id")
        .eq("id", entry_id)
        .eq("user_id", user["id"])
        .execute()
    )
    if not entry.data:
        raise HTTPException(status_code=404, detail="Тэмдэглэл олдсонгүй")

    insight = (
        db.table("seed_insights")
        .select("*")
        .eq("entry_id", entry_id)
        .single()
        .execute()
    )
    if not insight.data:
        raise HTTPException(
            status_code=404, detail="Seed Insight бэлэн болоогүй байна"
        )
    return insight.data


@router.get("/stats/emotions")
async def get_emotion_stats(
    days: int = Query(30, ge=1, le=365),
    user: dict = Depends(get_current_user),
):
    """Плутчикийн сэтгэл хөдлөлийн хэв маяг (сүүлийн N хоног)."""
    db = get_anon_client()
    result = (
        db.table("journal_analyses")
        .select(
            "plutchik_primary, plutchik_dyad,"
            "hawkins_level, processed_at,"
            "journal_entries!inner(user_id, created_at)"
        )
        .eq("journal_entries.user_id", user["id"])
        .gte(
            "journal_entries.created_at",
            f"now() - interval '{days} days'",
        )
        .order("journal_entries.created_at", desc=True)
        .execute()
    )
    return result.data
