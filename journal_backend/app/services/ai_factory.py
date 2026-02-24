"""
AI Factory
==========
.env дотор AI_PROVIDER=huggingface гэж тохируулахад л бүх зүйл солигдоно.
Шинэ provider нэмэхдээ:
  1. provider_xxx.py файл үүсгэ (BaseAIProvider удамшуул)
  2. _build_registry()-д try/except блок нэм
"""
from functools import lru_cache
from app.core.config import get_settings
from app.core.logger import get_logger
from app.services.base_provider import BaseAIProvider

settings = get_settings()
logger = get_logger(__name__)


def _build_registry() -> dict[str, type[BaseAIProvider]]:
    registry: dict[str, type[BaseAIProvider]] = {}

    try:
        from app.services.provider_anthropic import AnthropicProvider
        registry["anthropic"] = AnthropicProvider
    except ImportError:
        pass

    try:
        from app.services.provider_gemini import GeminiProvider
        registry["gemini"] = GeminiProvider
    except ImportError:
        pass

    try:
        from app.services.provider_openai import OpenAIProvider
        registry["openai"] = OpenAIProvider
    except ImportError:
        pass

    try:
        from app.services.provider_huggingface import HuggingFaceProvider
        registry["huggingface"] = HuggingFaceProvider
    except ImportError:
        pass

    try:
        from app.services.provider_glm import GLMProvider
        registry["glm"] = GLMProvider
    except ImportError:
        pass

    return registry


PROVIDERS = _build_registry()


@lru_cache(maxsize=1)
def get_ai_provider() -> BaseAIProvider:
    name = settings.ai_provider.lower().strip()

    if name not in PROVIDERS:
        raise ValueError(
            f"Unknown AI provider: '{name}'. "
            f"Available: {list(PROVIDERS.keys())}. "
            f"Check AI_PROVIDER in .env"
        )

    instance = PROVIDERS[name]()
    logger.info(
        "AI provider initialized",
        provider=instance.provider_name,
        model=instance.model_name,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
        top_p=settings.top_p,
        top_k=settings.top_k,
    )
    return instance
