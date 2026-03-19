"""
PromptBuilder — LLM промпт угсралт.
LlmService-с тусгаарласан (SRP).
"""

import json

_ALPHA = 0.3

# ── System Prompt ─────────────────────────────────────────────────────────────

_SYSTEM = """\
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

## Seed Insight (Монгол хэлээр)
mirror  — бичсэнийг дүгнэлтгүй 1-2 өгүүлбэрт
reframe — өөр өнцгөөс харах боломж
relief  — нэг жижиг, хийж болохуйц алхам
summary — бүгдийг 1 өгүүлбэрт

## Дүрэм
- Зөвхөн цэвэр JSON, тайлбар хэрэггүй
- score: 0.0–1.0 | intensity: low | medium | high
"""

_FEW_SHOT: list[dict] = [
    {
        "role": "user",
        "content": (
            "Surface: Уулзалтад буруу зүйл хэлчихлээ, мартаж чадахгүй.\n"
            "Inner Reaction: Дахин бодохоор улам л муу санагдаад"
            " зайлсхийж байна.\n"
            "Meaning: Хүмүүс чадваргүй гэж бодоосой гэхгүй,"
            " хүндлэгдэхийг хүсч байна."
        ),
    },
    {
        "role": "assistant",
        "content": json.dumps(
            {
                "maslow": [
                    {
                        "category": "esteem",
                        "values": [
                            {"хүлээн зөвшөөрөгдөх": 0.85},
                            {"нэр хүнд": 0.65},
                        ],
                    },
                    {"category": "safety", "values": [{"тогтвортой байдал": 0.40}]},
                ],
                "plutchik": {
                    "primary": "fear", "primary_score": 0.72,
                    "secondary": "sadness", "secondary_score": 0.58,
                    "dyad": "despair", "dyad_score": 0.62,
                    "conflict_flag": False, "intensity": "medium",
                },
                "hawkins": {
                    "emotion": "grief", "level": 162, "score": 0.70,
                    "zone": "below_200", "crisis_flag": False,
                    "ewma_previous": None, "ewma_updated": 162,
                },
                "seed_insight": {
                    "mirror": (
                        "Чухал мөчид шилдэг чанараараа харагдахыг"
                        " хүсэж байсан нь ойлгомжтой."
                    ),
                    "reframe": (
                        "Мартаж чадахгүй байгаа нь буруу хийсний тэмдэг биш"
                        " — чи сайн хийхийг хүсдэг гэдгийн баталгаа."
                    ),
                    "relief": "Тэр уулзалтаас нэг зөв хийсэн зүйлийг бич.",
                    "summary": (
                        "Хүндлэгдэх хэрэгцээнээс үүдсэн айдас"
                        " чиний өндөр стандартыг харуулж байна."
                    ),
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
    },
]


def build_analysis_messages(
    surface: str,
    inner: str,
    meaning: str,
    ewma: float | None,
) -> list[dict]:
    system = _SYSTEM
    if ewma:
        system += f"\n[Хэрэглэгчийн EWMA өмнөх дундаж: {ewma:.1f}]"
    return [
        {"role": "system", "content": system},
        *_FEW_SHOT,
        {
            "role": "user",
            "content": (
                f"Surface: {surface}\n"
                f"Inner Reaction: {inner}\n"
                f"Meaning: {meaning}"
            ),
        },
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
        {
            "role": "system",
            "content": (
                "Урт хугацааны сэтгэл зүйн хэв маягийг шинжилдэг"
                " мэргэжилтэн. Монгол хэлээр, зөвхөн JSON буцаана.\n"
                '{"insight_text": "...", "recommendations": ["..."]}'
            ),
        },
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
