from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.journal import JournalEntry
from app.models.schemas import EntryCreate, JournalAnalysis


class JournalService:

    async def create(
        self,
        db: AsyncSession,
        user_id: int,
        data: EntryCreate,
    ) -> JournalEntry:
        entry = JournalEntry(
            user_id=user_id,
            text=data.text,
            status="pending",
        )
        db.add(entry)
        await db.flush()
        await db.refresh(entry)
        return entry

    async def get(self, db: AsyncSession, entry_id: int) -> JournalEntry | None:
        result = await db.execute(
            select(JournalEntry).where(JournalEntry.id == entry_id)
        )
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        db: AsyncSession,
        user_id: int,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[JournalEntry], int]:
        offset = (page - 1) * page_size

        total_result = await db.execute(
            select(func.count()).where(JournalEntry.user_id == user_id)
        )
        total = total_result.scalar_one()

        entries_result = await db.execute(
            select(JournalEntry)
            .where(JournalEntry.user_id == user_id)
            .order_by(JournalEntry.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        entries = list(entries_result.scalars().all())

        return entries, total

    async def update_analysis(
        self,
        db: AsyncSession,
        entry_id: int,
        analysis: JournalAnalysis,
        provider: str,
        model: str,
    ) -> JournalEntry | None:
        entry = await self.get(db, entry_id)
        if not entry:
            return None

        entry.status = "done"
        entry.analysis = analysis.model_dump()
        entry.ai_provider = provider
        entry.ai_model = model
        await db.flush()
        await db.refresh(entry)
        return entry

    async def mark_failed(self, db: AsyncSession, entry_id: int, reason: str):
        entry = await self.get(db, entry_id)
        if entry:
            entry.status = "failed"
            entry.analysis = {"error": reason}
            await db.flush()
