from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import init_db
from app.core.redis import close_redis
from app.api.journal import router as journal_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting {settings.app_name} [{settings.app_env}]")
    await init_db()
    yield
    # Shutdown
    await close_redis()
    print("Shutdown complete")


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production-д хязгаарла
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(journal_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "ai_provider": settings.ai_provider,
    }
