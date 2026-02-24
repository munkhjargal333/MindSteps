import json
from openai import AsyncOpenAI
from app.core.config import get_settings
from app.core.logger import get_logger
from app.models.schemas import JournalAnalysis
from app.services.base_provider import BaseAIProvider, AnalysisError

settings = get_settings()
logger = get_logger(__name__)


class OpenAIProvider(BaseAIProvider):

    def __init__(self):
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)

    @property
    def provider_name(self) -> str:
        return "openai"

    @property
    def model_name(self) -> str:
        return settings.openai_model

    async def analyze(self, text: str) -> JournalAnalysis:
        logger.info("OpenAI request", model=self.model_name, text_len=len(text))
        try:
            response = await self._client.chat.completions.create(
                model=self.model_name,
                response_format={"type": "json_object"},
                temperature=settings.temperature,
                max_tokens=settings.max_tokens,
                top_p=settings.top_p,
                messages=[
                    {"role": "system", "content": "Зөвхөн JSON форматаар хариулна."},
                    {"role": "user", "content": self.build_prompt(text)},
                ],
            )
            logger.debug(
                "OpenAI response",
                prompt_tokens=response.usage.prompt_tokens,
                completion_tokens=response.usage.completion_tokens,
            )
            return self._parse(response.choices[0].message.content)
        except Exception as e:
            logger.error("OpenAI error", error=str(e))
            raise AnalysisError(self.provider_name, str(e))

    def _parse(self, raw: str) -> JournalAnalysis:
        try:
            return JournalAnalysis(**json.loads(raw))
        except (json.JSONDecodeError, ValueError) as e:
            raise AnalysisError(self.provider_name, f"JSON parse error: {e}")
