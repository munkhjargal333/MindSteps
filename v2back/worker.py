"""
Worker эхлүүлэгч.
Ажиллуулах: python worker.py

Queue-ууд:
  analysis    — тэмдэглэлийн LLM шинжилгээ (timeout: 2 мин)
  deep_insight — гүн шинжилгээ (timeout: 5 мин)
"""

import logging
import sys
from dotenv import load_dotenv

load_dotenv()

from rq import Worker, Queue
from app.db.redis_client import get_redis_connection

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

_QUEUE_NAMES = ["analysis", "deep_insight"]


if __name__ == "__main__":
    conn = get_redis_connection()
    queues = [Queue(name, connection=conn) for name in _QUEUE_NAMES]
    logging.getLogger(__name__).info(
        f"🔧 Worker эхэлж байна — queues: {_QUEUE_NAMES}"
    )
    Worker(queues, connection=conn).work(with_scheduler=True)
