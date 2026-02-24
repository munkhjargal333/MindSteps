import json
import anthropic
from app.core.config import get_settings
from app.core.logger import get_logger
from app.models.schemas import JournalAnalysis
from app.services.base_provider import BaseAIProvider, AnalysisError

settings = get_settings()
logger = get_logger(__name__)


class AnthropicProvider(BaseAIProvider):

    def __init__(self):
        self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    @property
    def provider_name(self) -> str:
        return "anthropic"

    @property
    def model_name(self) -> str:
        return settings.anthropic_model

    async def analyze(self, text: str) -> JournalAnalysis:
        logger.info("Anthropic request", model=self.model_name, text_len=len(text))
        try:
            response = await self._client.messages.create(
                model=self.model_name,
                max_tokens=settings.max_tokens,
                temperature=settings.temperature,
                top_p=settings.top_p,
                top_k=settings.top_k,
                messages=[{"role": "user", "content": self.build_prompt(text)}],
            )
            logger.debug(
                "Anthropic response",
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            )
            return self._parse(response.content[0].text)
        except anthropic.APIError as e:
            logger.error("Anthropic API error", error=str(e))
            raise AnalysisError(self.provider_name, str(e))

    def _parse(self, raw: str) -> JournalAnalysis:
        try:
            clean = raw.replace("```json", "").replace("```", "").strip()
            return JournalAnalysis(**json.loads(clean))
        except (json.JSONDecodeError, ValueError) as e:
            raise AnalysisError(self.provider_name, f"JSON parse error: {e}\nRaw: {raw[:200]}")
