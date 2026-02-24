"""
HuggingFace Inference API Provider
====================================
Inference API (serverless) ашиглана — өөрийн GPU хэрэггүй.
Model: https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3

.env тохиргоо:
    AI_PROVIDER=huggingface
    HF_TOKEN=hf_...
    HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3   # optional
"""
import json
import httpx
from app.core.config import get_settings
from app.core.logger import get_logger
from app.models.schemas import JournalAnalysis
from app.services.base_provider import BaseAIProvider, AnalysisError

settings = get_settings()
logger = get_logger(__name__)

HF_API_BASE = "https://api-inference.huggingface.co/models"


class HuggingFaceProvider(BaseAIProvider):
    """HuggingFace Inference API provider."""

    def __init__(self):
        if not settings.hf_token:
            raise ValueError("HF_TOKEN тохируулаагүй байна (.env)")
        self._headers = {
            "Authorization": f"Bearer {settings.hf_token}",
            "Content-Type": "application/json",
        }
        self._url = f"{HF_API_BASE}/{self.model_name}"

    @property
    def provider_name(self) -> str:
        return "huggingface"

    @property
    def model_name(self) -> str:
        return settings.hf_model

    async def analyze(self, text: str) -> JournalAnalysis:
        prompt = self._build_instruct_prompt(text)

        payload = {
            "inputs": prompt,
            "parameters": {
                "temperature": settings.temperature,
                "max_new_tokens": settings.max_tokens,
                "top_p": settings.top_p,
                "top_k": settings.top_k,
                "return_full_text": False,   # зөвхөн generated хэсэг
                "do_sample": settings.temperature > 0,
            },
            "options": {
                "wait_for_model": True,   # cold start-д хүлээнэ
                "use_cache": False,
            },
        }

        logger.info(
            "HF request",
            model=self.model_name,
            text_len=len(text),
        )

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                resp = await client.post(
                    self._url,
                    headers=self._headers,
                    json=payload,
                )
                resp.raise_for_status()
            except httpx.HTTPStatusError as e:
                body = e.response.text[:300]
                logger.error("HF HTTP error", status=e.response.status_code, body=body)
                raise AnalysisError(self.provider_name, f"HTTP {e.response.status_code}: {body}")
            except httpx.TimeoutException:
                raise AnalysisError(self.provider_name, "Request timeout (120s)")

        data = resp.json()

        # HF Inference API хариу: [{"generated_text": "..."}]
        if isinstance(data, list) and data:
            raw = data[0].get("generated_text", "")
        elif isinstance(data, dict):
            # Зарим model dict буцаадаг
            raw = data.get("generated_text", str(data))
        else:
            raise AnalysisError(self.provider_name, f"Unexpected response: {str(data)[:200]}")

        logger.debug("HF raw response", raw_len=len(raw))
        return self._parse(raw)

    def _build_instruct_prompt(self, text: str) -> str:
        """
        Mistral Instruct format: [INST] ... [/INST]
        Өөр model ашиглавал энэ методыг override хийнэ.
        """
        return f"[INST] {self.build_prompt(text)} [/INST]"

    def _parse(self, raw: str) -> JournalAnalysis:
        # JSON block олох
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start == -1 or end == 0:
            raise AnalysisError(
                self.provider_name,
                f"JSON олдсонгүй. Raw: {raw[:300]}"
            )
        json_str = raw[start:end]
        try:
            data = json.loads(json_str)
            return JournalAnalysis(**data)
        except (json.JSONDecodeError, ValueError) as e:
            raise AnalysisError(
                self.provider_name,
                f"JSON parse error: {e}\nExtracted: {json_str[:300]}"
            )
