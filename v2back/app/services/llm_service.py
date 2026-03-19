"""
LlmService — OpenAI compatible LLM шинжилгээ.
"""

import json
import logging
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from app.core.settings import get_settings
from app.schemas.analysis import LlmAnalysisResult
from app.services import prompt_builder

_log = logging.getLogger(__name__)
_settings = get_settings()


class LlmService:
    """LLM дуудалт болон хариулт боловсруулалт."""

    def __init__(self) -> None:
        base = _settings.llm_base_url
        self._client = AsyncOpenAI(
            api_key=_settings.llm_api_key,
            base_url=base if "openai.com" not in base else None,
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=8))
    async def analyze_entry(
        self,
        surface: str,
        inner: str,
        meaning: str,
        ewma_previous: float | None = None,
    ) -> LlmAnalysisResult:
        """
        Тэмдэглэлийн гурван хэсгийг шинжилж LlmAnalysisResult буцаана.
        Амжилтгүй бол 3 удаа retry хийнэ.
        """
        messages = prompt_builder.build_analysis_messages(
            surface, inner, meaning, ewma_previous
        )
        raw = await self._complete(messages)
        data = _parse_json(raw)
        prompt_builder.apply_ewma(data, ewma_previous)
        return LlmAnalysisResult(**data)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=8))
    async def generate_deep_insight(
        self, graph_summary: dict, entry_count: int
    ) -> dict:
        """ValueGraph дүн шинжилгээнд тулгуурлан Deep Insight үүсгэнэ."""
        messages = prompt_builder.build_deep_insight_messages(
            graph_summary, entry_count
        )
        raw = await self._complete(messages)
        return _parse_json(raw)

    async def _complete(self, messages: list[dict]) -> str:
        response = await self._client.chat.completions.create(
            model=_settings.llm_model,
            messages=messages,
            temperature=_settings.llm_temperature,
            max_tokens=_settings.llm_max_tokens,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content


def _parse_json(raw: str) -> dict:
    """Markdown code block цэвэрлэж JSON parse хийнэ."""
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        end = -1 if lines[-1].strip() == "```" else len(lines)
        text = "\n".join(lines[1:end])
    return json.loads(text.strip())


# ── Singleton ─────────────────────────────────────────────────────────────────

_instance: LlmService | None = None


def get_llm_service() -> LlmService:
    global _instance
    if _instance is None:
        _instance = LlmService()
    return _instance
