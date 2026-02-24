# Journal Backend — FastAPI + arq + Provider Pattern

## Архитектур

```
POST /journal/
  └─ DB save (status=pending)
  └─ arq.enqueue("analyze_entry", entry_id, user_id)
  └─ 201 → {id, status: "pending"}

arq Worker (тусдаа process)
  └─ analyze_entry(ctx, entry_id, user_id)
  └─ AI Provider (Gemini / Claude / GPT)
  └─ DB update (status=done, analysis={...})
  └─ Redis PUBLISH analysis:user:{user_id}

FastAPI WebSocket /journal/ws/{user_id}
  └─ Redis SUBSCRIBE analysis:user:{user_id}
  └─ websocket.send(payload)
```

## AI Provider солих

`.env` файлд нэг мөр өөрчил:

```env
# Gemini ашиглах
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza...

# Claude ашиглах
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# GPT ашиглах
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Код хаана ч өөрчлөх шаардлагагүй.

## Шинэ Provider нэмэх

```python
# app/services/provider_myai.py
from app.services.base_provider import BaseAIProvider, AnalysisError

class MyAIProvider(BaseAIProvider):
    @property
    def provider_name(self): return "myai"

    @property
    def model_name(self): return "myai-v1"

    async def analyze(self, text: str) -> JournalAnalysis:
        prompt = self.build_prompt(text)
        raw = await my_ai_sdk.generate(prompt)
        # parse → JournalAnalysis
        ...
```

```python
# app/services/ai_factory.py дотор нэм:
from app.services.provider_myai import MyAIProvider
registry["myai"] = MyAIProvider
```

`.env` дотор `AI_PROVIDER=myai` гэж тохируул. Болоо.

## Эхлүүлэх

### Docker (хялбар)
```bash
cp .env.example .env
# .env дотор API key оруул
docker-compose up
```

### Гараар
```bash
# Dependencies
pip install -r requirements.txt

# PostgreSQL + Redis ажиллаж байх ёстой
cp .env.example .env  # API key оруул

# API server
uvicorn app.main:app --reload --port 8000

# Worker (өөр terminal)
arq app.workers.analysis_worker.WorkerSettings
```

## API Endpoints

| Method | Path | Тайлбар |
|--------|------|---------|
| POST | /journal/ | Тэмдэглэл үүсгэж шинжилгээ эхлүүл |
| GET | /journal/ | Жагсаалт (page, page_size) |
| GET | /journal/{id} | Нэг тэмдэглэл |
| WS | /journal/ws/{user_id} | Хэрэглэгчийн бүх шинжилгээ |
| WS | /journal/ws/entry/{id} | Нэг entry-ийн шинжилгээ |
| GET | /health | Provider мэдээлэл |

## WebSocket payload

```json
{
  "event": "analysis_ready",
  "entry_id": 42,
  "user_id": 1,
  "provider": "gemini",
  "model": "gemini-1.5-pro",
  "analysis": {
    "maslow": [
      {"key": "physiological", "values": ["эрүүл мэнд", "амралт"]},
      {"key": "safety", "values": ["орлого", "тогтвортой байдал"]}
    ],
    "plutchik": {"primary_dyad": "joy_trust", "secondary": null},
    "hawkins": {"emotion": "Баяр", "level": 540},
    "summary": "..."
  }
}
```

## Файлын бүтэц

```
journal_backend/
├── app/
│   ├── api/
│   │   └── journal.py          # HTTP + WebSocket routes
│   ├── core/
│   │   ├── config.py           # Settings (.env)
│   │   ├── database.py         # SQLAlchemy async
│   │   └── redis.py            # Redis pool + channels
│   ├── models/
│   │   ├── journal.py          # SQLAlchemy ORM
│   │   └── schemas.py          # Pydantic schemas
│   ├── services/
│   │   ├── base_provider.py    # Abstract base (provider pattern)
│   │   ├── ai_factory.py       # ← Provider сонгох цэг
│   │   ├── provider_anthropic.py
│   │   ├── provider_gemini.py
│   │   ├── provider_openai.py
│   │   └── journal_service.py  # DB CRUD
│   ├── workers/
│   │   └── analysis_worker.py  # arq tasks
│   └── main.py                 # FastAPI app
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env.example
```
