FROM python:3.12-slim

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# API эхлүүлэхэд: uvicorn app.main:app ...
# Worker эхлүүлэхэд: arq app.workers.analysis_worker.WorkerSettings
