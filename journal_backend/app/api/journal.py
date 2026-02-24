import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.redis import get_redis, analysis_channel, entry_channel
from app.core.auth import AuthUser, get_current_user, get_current_user_or_dev
from app.models.schemas import EntryCreate, EntryResponse, EntryListResponse
from app.services.journal_service import JournalService
from app.workers.analysis_worker import get_arq_pool

router = APIRouter(prefix="/journal", tags=["journal"])
journal_svc = JournalService()


# ── HTTP Endpoints ────────────────────────────────────────────

@router.post("/", response_model=EntryResponse, status_code=201)
async def create_entry(
    data: EntryCreate,
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user_or_dev),  # ← Supabase JWT
):
    entry = await journal_svc.create(db, user.user_id, data)
    await db.commit()
    await db.refresh(entry)

    pool = await get_arq_pool()
    await pool.enqueue_job("analyze_entry", entry.id, user.user_id)
    await pool.close()

    return entry


@router.get("/", response_model=EntryListResponse)
async def list_entries(
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user_or_dev),
):
    entries, total = await journal_svc.list_by_user(db, user.user_id, page, page_size)
    return EntryListResponse(items=entries, total=total, page=page, page_size=page_size)


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user_or_dev),
):
    entry = await journal_svc.get(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    # Зөвхөн өөрийнхөө entry-г харна
    if entry.user_id != user.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return entry


# ── WebSocket ─────────────────────────────────────────────────

@router.websocket("/ws/user")
async def websocket_user(
    websocket: WebSocket,
    token: str,  # ?token=<jwt> query param
):
    """
    Frontend:
      const ws = new WebSocket(`ws://localhost:8000/journal/ws/user?token=${session.access_token}`)
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.event === "analysis_ready") refetchEntry(data.entry_id)
      }
    """
    from app.core.auth import _get_supabase_public_key
    import jwt as pyjwt
    try:
        secret = _get_supabase_public_key()
        payload = pyjwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
        user_id = payload["sub"]
    except Exception:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    await websocket.accept()
    redis = await get_redis()
    pubsub = redis.pubsub()
    channel = analysis_channel(user_id)
    await pubsub.subscribe(channel)

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                await websocket.send_text(message["data"])
    except WebSocketDisconnect:
        pass
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.close()


@router.websocket("/ws/entry/{entry_id}")
async def websocket_entry(websocket: WebSocket, entry_id: int):
    await websocket.accept()
    redis = await get_redis()
    pubsub = redis.pubsub()
    channel = entry_channel(entry_id)
    await pubsub.subscribe(channel)

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                await websocket.send_text(message["data"])
                break  # Нэг удаа авсан бол disconnect
    except WebSocketDisconnect:
        pass
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.close()
