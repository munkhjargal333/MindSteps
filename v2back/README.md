# Тэмдэглэлийн системийн Backend

```bash
# 1. Суулгах
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Тохируулах
cp .env.example .env
# .env-д SUPABASE_URL, SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, LLM_API_KEY оруулна

# 3. Redis (Docker)
docker run -d -p 6379:6379 redis:7-alpine

# 4. API эхлүүлэх
uvicorn app.main:app --reload
# → http://localhost:8000/docs

# 5. Worker эхлүүлэх (шинэ terminal)
python worker.py
```

## Docker-оор бүгдийг нэгдүгээрт

```bash
cp .env.example .env  # засаад
docker-compose up --build

# RQ monitor (optional):
docker-compose --profile dev up
# → http://localhost:9181
```

---

## Файлын бүтэц

```
app/
├── core/
│   ├── settings.py      ← Бүх тохиргоо (.env)
│   └── middleware.py    ← Rate limiting
├── db/
│   ├── supabase.py      ← Client factory (anon + admin)
│   └── redis_client.py  ← Redis + Queue factory
├── schemas/
│   ├── entry.py         ← Тэмдэглэлийн схем
│   ├── analysis.py      ← LLM шинжилгээний схем
│   └── graph.py         ← ValueGraph схем
├── services/
│   ├── auth_service.py     ← Supabase JWT баталгаажуулалт
│   ├── llm_service.py      ← OpenAI/Qwen3 шинжилгээ
│   └── journal_service.py  ← CRUD + ValueGraph логик
├── workers/
│   └── jobs.py          ← RQ Worker jobs
├── api/routes/
│   ├── entries.py       ← /api/entries
│   ├── graph.py         ← /api/graph, /api/insights
│   ├── admin.py         ← /api/admin
│   └── websocket.py     ← /ws/{channel}
└── main.py              ← FastAPI app, router холболт
```

---

## Clean Code зарчмууд

| Зарчим | Хэрэгжилт |
|--------|-----------|
| **SRP** | Схем, сервис, route, worker тус бүр нэг үүрэгтэй |
| **DRY** | DB client factory — нэг газраас авна |
| **KISS** | Route-д зөвхөн HTTP логик, бизнес логик service-д |
| **OCP** | LLM загвар солиход зөвхөн `.env` өөрчилнө |

---

## API Endpoint-ууд

| Method | URL | Тайлбар |
|--------|-----|---------|
| GET | `/health` | Redis + Supabase шалгах |
| GET | `/api/entries` | Тэмдэглэлийн жагсаалт |
| POST | `/api/entries` | Тэмдэглэл үүсгэх → queue |
| GET | `/api/entries/{id}` | Дэлгэрэнгүй |
| DELETE | `/api/entries/{id}` | Устгах |
| GET | `/api/graph` | Үнэт зүйлсийн граф |
| GET | `/api/insights/deep` | Deep Insight жагсаалт |
| GET | `/api/insights/seed/{id}` | Seed Insight |
| GET | `/api/stats/emotions` | Сэтгэл хөдлөлийн статистик |
| WS | `/ws/{channel}` | Бодит цагийн мэдэгдэл |
| GET | `/api/admin/stats` | (Admin) Статистик |
| GET | `/api/admin/users` | (Admin) Хэрэглэгчид |
| POST | `/api/admin/users/invite` | (Admin) Урилга |
| POST | `/api/admin/llm/test` | (Admin) LLM шалгах |

---

## Qwen3 руу шилжих

`.env`-д зөвхөн 2 мөр солино, кодонд хүрэхгүй:

```
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL=qwen3-235b-a22b
LLM_API_KEY=<Alibaba Cloud key>
```
