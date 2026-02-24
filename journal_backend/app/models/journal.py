from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, JSON, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class JournalEntry(Base):
    __tablename__ = "journal_entries"
    __table_args__ = {"schema": None}  # schema = search_path-аас авна

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Supabase auth.users.id — UUID, foreign key шаардахгүй
    # (auth schema нь өөр schema дотор байдаг тул FK хийхгүй)
    user_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)

    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # pending | analyzing | done | failed
    status: Mapped[str] = mapped_column(String(20), default="pending")

    analysis: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    ai_provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ai_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
