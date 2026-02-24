"""
AI Provider Abstract Base
=========================
Шинэ AI provider нэмэхдээ:
  1. BaseAIProvider-г удамшуул
  2. analyze() методыг хэрэгжүүл
  3. app/services/ai_factory.py -д бүртгэ

Тийм энгийн.
"""
from abc import ABC, abstractmethod
from app.models.schemas import JournalAnalysis


ANALYSIS_PROMPT_TEMPLATE = """
Дараах тэмдэглэлийг сэтгэл зүйн дүн шинжилгээ хий.

Тэмдэглэл: "{text}"

Зөвхөн дараах JSON-г буцаа. Ямар ч тайлбар, markdown, эсвэл нэмэлт текст хэрэггүй.

{{
  "maslow": [
    {{"key": "<level>", "values": ["<keyword>", "..."]}}
  ],
  "plutchik": {{
    "primary_dyad": "<emotion_pair>",
    "secondary": "<optional_secondary>"
  }},
  "hawkins": {{
    "emotion": "<mongolian_emotion_name>",
    "level": <integer_20_to_700>
  }},
  "summary": "<2-3 өгүүлбэрээр монголоор>"
}}

Утга тайлбар:
- maslow.key зөвшөөрөгдсөн утга: physiological, safety, belonging, esteem, self_actualization
- plutchik.primary_dyad зөвшөөрөгдсөн утга: joy, trust, fear, surprise, sadness, disgust, anger, anticipation, joy_trust, joy_anticipation, trust_fear, fear_surprise, surprise_sadness, sadness_disgust, disgust_anger, anger_anticipation
- hawkins.level: 20-700 хооронд бүхэл тоо (20=ичгүүр, 200=зориг, 350=хүлээн зөвшөөрөх, 500=хайр, 540=баяр, 600=амар тайван)
""".strip()


class BaseAIProvider(ABC):
    """Бүх AI provider-үүд энэ классыг удамшина."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Provider-ийн нэр: "anthropic", "gemini", "openai"."""
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Ашиглаж байгаа model-ийн нэр."""
        ...

    @abstractmethod
    async def analyze(self, text: str) -> JournalAnalysis:
        """
        Тэмдэглэлийг шинжилж JournalAnalysis буцаана.
        Алдаа гарвал AnalysisError raise хийнэ.
        """
        ...

    def build_prompt(self, text: str) -> str:
        return ANALYSIS_PROMPT_TEMPLATE.format(text=text)


class AnalysisError(Exception):
    """AI шинжилгээний алдаа."""
    def __init__(self, provider: str, message: str):
        self.provider = provider
        super().__init__(f"[{provider}] {message}")
