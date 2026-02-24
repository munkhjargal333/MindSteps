from datetime import datetime
from pydantic import BaseModel


# ── Analysis schemas ──────────────────────────────────────────
class MaslowItem(BaseModel):
    key: str        # physiological | safety | belonging | esteem | self_actualization
    values: list[str]


class PlutchikAnalysis(BaseModel):
    primary_dyad: str
    secondary: str | None = None


class HawkinsAnalysis(BaseModel):
    emotion: str
    level: int      # 20–700


class JournalAnalysis(BaseModel):
    maslow: list[MaslowItem]
    plutchik: PlutchikAnalysis
    hawkins: HawkinsAnalysis
    summary: str


# ── Entry schemas ─────────────────────────────────────────────
class EntryCreate(BaseModel):
    text: str


class EntryResponse(BaseModel):
    id: int
    user_id: int
    text: str
    status: str
    analysis: JournalAnalysis | None
    ai_provider: str | None
    ai_model: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EntryListResponse(BaseModel):
    items: list[EntryResponse]
    total: int
    page: int
    page_size: int
