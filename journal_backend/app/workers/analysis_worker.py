"""
arq Worker
==========
Эхлүүлэх: arq app.workers.analysis_worker.WorkerSettings
"""
import json
from arq import create_pool
from arq.connections import RedisSettings

from app.core.config import get_settings
from app.core.database import AsyncSessionLocal
from app.core.redis import analysis_channel, entry_channel
from app.core.logger import get_logger
from app.services.ai_factory import get_ai_provider
from app.services.journal_service import JournalService
from app.services.base_provider import AnalysisError

logger = get_logger(__name__)
settings = get_settings()


async def analyze_entry(ctx: dict, entry_id: int, user_id: str):
    redis = ctx["redis"]
    provider = get_ai_provider()
    journal_svc = JournalService()

    logger.info("Job started", entry_id=entry_id, provider=provider.provider_name)

    # 1. DB-с текст татна + status → "analyzing"
    async with AsyncSessionLocal() as db:
        entry = await journal_svc.get(db, entry_id)
        if not entry:
            logger.warning("Entry not found", entry_id=entry_id)
            return
        entry.status = "analyzing"
        await db.commit()
        text = entry.text

    # 2. AI шинжилгээ
    try:
        analysis = await provider.analyze(text)

        async with AsyncSessionLocal() as db:
            await journal_svc.update_analysis(
                db=db,
                entry_id=entry_id,
                analysis=analysis,
                provider=provider.provider_name,
                model=provider.model_name,
            )
            await db.commit()

        payload = json.dumps({
            "event": "analysis_ready",
            "entry_id": entry_id,
            "user_id": user_id,
            "analysis": analysis.model_dump(),
            "provider": provider.provider_name,
            "model": provider.model_name,
        })
        await redis.publish(analysis_channel(user_id), payload)
        await redis.publish(entry_channel(entry_id), payload)

        logger.info(
            "Job done",
            entry_id=entry_id,
            hawkins_level=analysis.hawkins.level,
            emotion=analysis.hawkins.emotion,
            dyad=analysis.plutchik.primary_dyad,
        )

    except AnalysisError as e:
        logger.error("Analysis failed", entry_id=entry_id, error=str(e))
        async with AsyncSessionLocal() as db:
            await journal_svc.mark_failed(db, entry_id, str(e))
            await db.commit()
        error_payload = json.dumps({
            "event": "analysis_failed",
            "entry_id": entry_id,
            "user_id": user_id,
            "error": str(e),
        })
        await redis.publish(analysis_channel(user_id), error_payload)

    except Exception as e:
        logger.exception("Unexpected worker error", entry_id=entry_id)
        async with AsyncSessionLocal() as db:
            await journal_svc.mark_failed(db, entry_id, f"Unexpected: {e}")
            await db.commit()


async def startup(ctx: dict):
    logger.info(
        "Worker started",
        provider=settings.ai_provider,
        log_level=settings.log_level,
    )


async def shutdown(ctx: dict):
    logger.info("Worker stopping")


class WorkerSettings:
    functions = [analyze_entry]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = RedisSettings.from_dsn(settings.redis_url)
    max_jobs = 10
    job_timeout = 120
    max_tries = 3
    retry_delay = 5.0


async def get_arq_pool():
    return await create_pool(WorkerSettings.redis_settings)
