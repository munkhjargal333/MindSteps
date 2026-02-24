"""
ZhipuAI GLM-4 Provider
=======================
GLM-4 нь ZhipuAI-н API ашигладаг.
SDK: zhipuai (OpenAI-compatible interface)

.env тохиргоо:
    AI_PROVIDER=glm
    ZHIPU_API_KEY=your-key    # https://open.bigmodel.cn/usercenter/apikeys
    GLM_MODEL=glm-4-plus      # glm-4 | glm-4-plus | glm-4-air | glm-4-flash

Model сонголт (хурд vs чанар):
  glm-4-plus  → хамгийн хүчирхэг, GLM-4.7 base
  glm-4-air   → хурдан, хямд
  glm-4-flash → маш хурдан, үнэгүй tier байдаг
"""
import json
from zhipuai import ZhipuAI
from app.core.config import get_settings
from app.core.logger import get_logger
from app.models.schemas import JournalAnalysis
from app.services.base_provider import BaseAIProvider, AnalysisError

settings = get_settings()
logger = get_logger(__name__)


class GLMProvider(BaseAIProvider):
    """ZhipuAI GLM-4 provider."""

    def __init__(self):
        if not settings.zhipu_api_key:
            raise ValueError("ZHIPU_API_KEY тохируулаагүй байна (.env)")
        # zhipuai SDK нь sync — asyncio executor-д ажиллуулна
        self._client = ZhipuAI(api_key=settings.zhipu_api_key)

    @property
    def provider_name(self) -> str:
        return "glm"

    @property
    def model_name(self) -> str:
        return settings.glm_model

    async def analyze(self, text: str) -> JournalAnalysis:
        import asyncio

        logger.info("GLM request", model=self.model_name, text_len=len(text))

        loop = asyncio.get_event_loop()
        try:
            response = await loop.run_in_executor(
                None,
                lambda: self._client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Та сэтгэл зүйн шинжээч. "
                                "Зөвхөн цэвэр JSON форматаар хариулна. "
                                "Ямар ч тайлбар, markdown хэрэггүй."
                            ),
                        },
                        {"role": "user", "content": self.build_prompt(text)},
                    ],
                    temperature=settings.temperature,
                    max_tokens=settings.max_tokens,
                    top_p=settings.top_p,
                ),
            )
        except Exception as e:
            logger.error("GLM API error", error=str(e))
            raise AnalysisError(self.provider_name, str(e))

        raw = response.choices[0].message.content

        logger.debug(
            "GLM response",
            prompt_tokens=response.usage.prompt_tokens,
            completion_tokens=response.usage.completion_tokens,
        )

        return self._parse(raw)

    def _parse(self, raw: str) -> JournalAnalysis:
        # JSON block-г олж цэвэрлэ
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start == -1 or end == 0:
            raise AnalysisError(
                self.provider_name,
                f"JSON олдсонгүй. Raw: {raw[:300]}"
            )
        json_str = raw[start:end]
        try:
            return JournalAnalysis(**json.loads(json_str))
        except (json.JSONDecodeError, ValueError) as e:
            raise AnalysisError(
                self.provider_name,
                f"JSON parse error: {e}\nExtracted: {json_str[:300]}"
            )
