"""
RQ Worker Jobs.
Эхлүүлэх: python worker.py

Jobs:
  process_entry_analysis  — LLM шинжилгээ, Seed Insight, ValueNode
  process_deep_insight    — 10+ тэмдэглэлийн дараах гүн шинжилгээ
"""

import asyncio
import json
import logging

_log = logging.getLogger(__name__)


# ── Public jobs ───────────────────────────────────────────────────────────────

def process_entry_analysis(
    entry_id: str,
    user_id: str,
    entry_text: dict,
) -> None:
    """
    Тэмдэглэлийн LLM шинжилгээ.
    analysis_queue-д орно.

    entry_text = {
      "surface": str,
      "inner": str,
      "meaning": str,
    }
    """
    from app.services.llm_service import get_llm_service
    from app.services.journal_service import JournalService
    from app.db.supabase import get_admin_client
    from app.db.redis_client import get_redis_connection

    _log.info(f"Шинжилгээ эхэлж байна: entry={entry_id}")

    db = get_admin_client()
    journal = JournalService(db)
    llm = get_llm_service()
    redis = get_redis_connection()

    _publish(redis, entry_id, "processing", "Шинжилж байна...")

    try:
        ewma = journal.calculate_user_ewma(user_id)
        result = _run(
            llm.analyze_entry(
                surface=entry_text["surface"],
                inner=entry_text["inner"],
                meaning=entry_text["meaning"],
                ewma_previous=ewma,
            )
        )

        if result.hawkins.crisis_flag:
            _log.warning(f"CRISIS: user={user_id}, entry={entry_id}")
            _publish(
                redis, entry_id, "crisis",
                "Мэргэжлийн тусламж авахыг зөвлөж байна",
            )

        journal.save_seed_insight(entry_id, result.seed_insight.model_dump())
        journal.save_analysis(entry_id, result)
        journal.update_value_nodes(user_id, result, entry_id)
        journal.mark_analysis_processed(entry_id)

        _publish(
            redis, entry_id, "done",
            payload={
                "seed_insight": result.seed_insight.model_dump(),
                "hawkins_level": result.hawkins.level,
                "plutchik_primary": result.plutchik.primary,
            },
        )
        _log.info(f"Шинжилгээ дууслаа: entry={entry_id}")

    except Exception as exc:
        _log.error(f"Worker алдаа: {exc}", exc_info=True)
        _publish(redis, entry_id, "error", str(exc)[:120])
        raise


def process_deep_insight(user_id: str) -> None:
    """
    Гүн шинжилгээ үүсгэх worker job.
    deep_insight_queue-д орно.
    """
    from app.services.llm_service import get_llm_service
    from app.services.journal_service import JournalService
    from app.db.supabase import get_admin_client
    from app.db.redis_client import get_redis_connection

    _log.info(f"Deep Insight эхэлж байна: user={user_id}")

    db = get_admin_client()
    journal = JournalService(db)
    llm = get_llm_service()
    redis = get_redis_connection()

    count = journal.count_user_entries(user_id)
    summary = journal.build_graph_summary(user_id)
    insight = _run(llm.generate_deep_insight(summary, count))

    db.table("deep_insights").insert(
        {
            "user_id": user_id,
            "insight_text": insight["insight_text"],
            "recommendations": insight["recommendations"],
        }
    ).execute()

    _publish(
        redis,
        f"user:{user_id}:notifications",
        "deep_insight_ready",
        "Шинэ гүн шинжилгээ бэлэн боллоо",
    )
    _log.info(f"Deep Insight дууслаа: user={user_id}")


# ── Private helpers ───────────────────────────────────────────────────────────

def _run(coro):
    """Sync контекстод async coroutine ажиллуулна."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


def _publish(
    redis,
    channel: str,
    msg_type: str,
    message: str | None = None,
    payload: dict | None = None,
) -> None:
    data: dict = {"type": msg_type}
    if message:
        data["message"] = message
    if payload:
        data["data"] = payload
    redis.publish(channel, json.dumps(data, ensure_ascii=False))
