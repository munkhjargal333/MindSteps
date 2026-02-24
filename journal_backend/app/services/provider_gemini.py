import json
import asyncio
import google.generativeai as genai
from app.core.config import get_settings
from app.core.logger import get_logger
from app.models.schemas import JournalAnalysis
from app.services.base_provider import BaseAIProvider, AnalysisError

settings = get_settings()
logger = get_logger(__name__)


class GeminiProvider(BaseAIProvider):

    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self._model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=settings.temperature,
                max_output_tokens=settings.max_tokens,
                top_p=settings.top_p,
                top_k=settings.top_k,
            ),
        )

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return settings.gemini_model

    async def analyze(self, text: str) -> JournalAnalysis:
        logger.info("Gemini request", model=self.model_name, text_len=len(text))
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self._model.generate_content(self.build_prompt(text))
            )
            logger.debug("Gemini response received", tokens=getattr(response, "usage_metadata", None))
            return self._parse(response.text)
        except Exception as e:
            logger.error("Gemini error", error=str(e))
            raise AnalysisError(self.provider_name, str(e))

    def _parse(self, raw: str) -> JournalAnalysis:
        try:
            clean = raw.replace("```json", "").replace("```", "").strip()
            return JournalAnalysis(**json.loads(clean))
        except (json.JSONDecodeError, ValueError) as e:
            raise AnalysisError(self.provider_name, f"JSON parse error: {e}\nRaw: {raw[:200]}")
