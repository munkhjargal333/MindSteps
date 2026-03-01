import logging
import time
from typing import Any, Dict, List, Optional

# Шинэ SDK: pip install zai
import zai
from zai import ZhipuAiClient

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Singleton client ──────────────────────────────────────────────────────
_client: Optional[ZhipuAiClient] = None

def _get_client() -> ZhipuAiClient:
    global _client
    if _client is None:
        # Шинэ SDK-ийн үндсэн класс
        _client = ZhipuAiClient(api_key=settings.zhipuai_api_key)
    return _client

# ── Public function ───────────────────────────────────────────────────────
def chat(
    messages: List[Dict[str, str]],
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Zai SDK ашиглан GLM-4 эсвэл GLM-5 загвартай харилцах.
    """
    
    # Шинэ SDK дээрх параметрүүд
    params = {
        "model":       settings.model_name, # Жишээ нь: "glm-4"
        "messages":    messages,
        "max_tokens":  max_tokens if max_tokens is not None else settings.max_tokens,
        "temperature": temperature if temperature is not None else settings.temperature,
        "top_p":       settings.top_p,
    }

    client = _get_client()

    for attempt in range(1, settings.max_retries + 1):
        try:
            # Шинэ бүтцээр дуудах
            response = client.chat.completions.create(**params)
            
            # Хариулт болон токен ашиглалтыг авах
            reply = response.choices[0].message.content.strip()
            tokens = getattr(response.usage, "total_tokens", 0)

            logger.info(f"✅ Model: {settings.model_name} | Used Tokens: {tokens}")
            
            return {
                "success": True, 
                "reply": reply, 
                "tokens_used": tokens
            }

        except Exception as e:
            # Алдаа гарвал бүртгэх
            logger.error(f"❌ Оролдлого {attempt}/{settings.max_retries} - Алдаа: {str(e)}")
            
            if attempt < settings.max_retries:
                time.sleep(settings.retry_delay)
            else:
                return {"success": False, "error": f"API холболт амжилтгүй: {str(e)}"}

    return {"success": False, "error": "Unknown Error"}