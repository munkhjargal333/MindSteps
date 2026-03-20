"""
PromptBuilder — LLM промпт угсралт.

3 төрлийн промпт:
  build_seed_messages     — богино, seed only (хурдан)
  build_analysis_messages — бүрэн шинжилгээ (few-shot-тай)
  build_deep_insight_messages — ValueGraph дүн шинжилгээ
"""

import json
from app.services.few_shot_data import ANALYSIS_FEW_SHOT

_ALPHA = 0.3

_SEED_SYSTEM = """\
Чи бол сэтгэл зүйн туслагч.

Хэрэглэгчийн тэмдэглэлийг уншаад доорх JSON-г Монгол хэлээр буцаана.
Зөвхөн JSON. Нэмэлт текст ХОРИГЛОНО.

JSON schema:
{
  "mirror": "хэрэглэгчийн үйлдэл болон мэдрэмжийг тусган, цаадах хэрэгцээг зөөлөн ил гаргана (\"... санагдаж байна\")",
  "reframe": "ичгүүр болон өөрийгөө буруутгалыг сулгах зөөлөн өөр өнцөг (\"магадгүй...\")",
  "relief": "бие махбодыг тайвшруулах 5 минутад багтах жижиг алхам",
  "summary": "дэмжсэн өнгө аястай товч нэг өгүүлбэр"
}

Дүрэм:
- Шүүмжлэхгүй, буруутгахгүй
- Хэрэглэгчийг засах гэж оролдохгүй
- Advice хүчлэхгүй
- Хяналт хэрэглэгчид үлдэнэ
- Энгийн, дулаан, хүний мэт бичнэ
"""

_ANALYSIS_SYSTEM = """\
Чи бол Маслоу, Плутчик, Хокинсын онолоор мэргэшсэн сэтгэл зүйн аналитикч.

## Маслоу — category утгууд
physiological | safety | social | esteem | self_actualization

## Плутчикийн 8 сэтгэл хөдлөл
joy | trust | fear | surprise | sadness | disgust | anger | anticipation

## Primary Dyad
joy+trust=love, trust+fear=submission, fear+surprise=awe,
surprise+sadness=disapproval, sadness+disgust=remorse,
disgust+anger=contempt, anger+anticipation=aggressiveness,
anticipation+joy=optimism

## Secondary Dyad
joy+fear=guilt, trust+surprise=curiosity, fear+sadness=despair,
surprise+disgust=disbelief, sadness+anger=envy,
disgust+anticipation=cynicism, anger+joy=pride, anticipation+trust=hope

## Хокинсын бүс
20-50: crisis_flag=true | 75-175: zone=below_200 | 200+: zone=above_200

## Дүрэм
- Зөвхөн цэвэр JSON, тайлбар хэрэггүй
- score: 0.0–1.0 | intensity: low | medium | high
"""

_DEEP_INSIGHT_SYSTEM = (
    "Урт хугацааны сэтгэл зүйн хэв маягийг шинжилдэг мэргэжилтэн."
    " Монгол хэлээр, зөвхөн JSON буцаана.\n"
    '{"insight_text": "...", "recommendations": ["..."]}'
)


def build_seed_messages(
    surface: str, inner: str, meaning: str
) -> list[dict]:
    """Зөвхөн Seed Insight. Few-shot байхгүй → хурдан."""
    return [
        {"role": "system", "content": _SEED_SYSTEM},
        {"role": "user", "content": _entry_text(surface, inner, meaning)},
    ]


def build_analysis_messages(
    surface: str,
    inner: str,
    meaning: str,
    ewma: float | None,
) -> list[dict]:
    """Maslow + Plutchik + Hawkins. Few-shot жишээтэй."""
    system = _ANALYSIS_SYSTEM
    if ewma:
        system += f"\n[Хэрэглэгчийн EWMA өмнөх дундаж: {ewma:.1f}]"
    return [
        {"role": "system", "content": system},
        *ANALYSIS_FEW_SHOT,
        {"role": "user", "content": _entry_text(surface, inner, meaning)},
    ]


def build_deep_insight_messages(summary: dict, count: int) -> list[dict]:
    top = json.dumps(summary.get("top_nodes", []), ensure_ascii=False)
    prompt = (
        f"Хэрэглэгч {count} тэмдэглэл бичсэн.\n"
        f"Давтагдсан үнэт зүйлс: {top}\n"
        f"EWMA дундаж: {summary.get('ewma_avg', '?')}\n"
        f"Давамгайлсан сэтгэл: {summary.get('dominant_emotion', '?')}"
    )
    return [
        {"role": "system", "content": _DEEP_INSIGHT_SYSTEM},
        {"role": "user", "content": prompt},
    ]


def apply_ewma(data: dict, previous: float | None) -> None:
    """Хокинсын EWMA-г шинэчилнэ. data dict-ийг in-place өөрчилнэ."""
    level = data.get("hawkins", {}).get("level")
    if not level:
        return
    if previous is not None:
        data["hawkins"]["ewma_previous"] = previous
        updated = round(_ALPHA * level + (1 - _ALPHA) * previous, 1)
    else:
        updated = float(level)
    data["hawkins"]["ewma_updated"] = updated


def _entry_text(surface: str, inner: str, meaning: str) -> str:
    return (
        f"Surface: {surface}\n"
        f"Inner Reaction: {inner}\n"
        f"Meaning: {meaning}"
    )
