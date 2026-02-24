"""
Centralized Logger
==================
Хэрэглэх:
    from app.core.logger import get_logger
    logger = get_logger(__name__)
    logger.info("Analyzing entry", entry_id=42, provider="gemini")
"""
import logging
import sys
from functools import lru_cache
from app.core.config import get_settings

settings = get_settings()


class _ContextFormatter(logging.Formatter):
    """
    Structured log format.
    Extra kwargs-ийг мөрийн эцэст key=value хэлбэрээр хавсаргана.
    """
    FMT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    DATE_FMT = "%Y-%m-%d %H:%M:%S"

    def __init__(self):
        super().__init__(fmt=self.FMT, datefmt=self.DATE_FMT)

    def format(self, record: logging.LogRecord) -> str:
        base = super().format(record)
        # Extra context fields нэмэх
        extras = {
            k: v for k, v in record.__dict__.items()
            if k not in logging.LogRecord.__dict__
            and not k.startswith("_")
            and k not in (
                "name", "msg", "args", "levelname", "levelno",
                "pathname", "filename", "module", "exc_info",
                "exc_text", "stack_info", "lineno", "funcName",
                "created", "msecs", "relativeCreated", "thread",
                "threadName", "processName", "process", "message",
                "asctime", "taskName",
            )
        }
        if extras:
            ctx = "  " + "  ".join(f"{k}={v}" for k, v in extras.items())
            return base + ctx
        return base


@lru_cache(maxsize=1)
def _setup_root_logger() -> None:
    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_ContextFormatter())

    root = logging.getLogger()
    root.setLevel(level)
    # Давхар handler нэмэхгүй
    if not root.handlers:
        root.addHandler(handler)
    else:
        root.handlers = [handler]

    # 3rd party шуугианыг намсгах
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.DEBUG if settings.debug else logging.WARNING
    )
    logging.getLogger("arq").setLevel(logging.INFO)
    logging.getLogger("httpx").setLevel(logging.WARNING)


class _ContextLogger(logging.LoggerAdapter):
    """
    Extra context-г kwargs-аар дамжуулах боломжтой logger.
    logger.info("msg", entry_id=1, provider="gemini")
    """
    def process(self, msg, kwargs):
        extra = kwargs.pop("extra", {})
        # Keyword args-ийг extra-д нэм
        for k in list(kwargs.keys()):
            if k not in ("exc_info", "stack_info", "stacklevel"):
                extra[k] = kwargs.pop(k)
        kwargs["extra"] = {**self.extra, **extra}
        return msg, kwargs


def get_logger(name: str) -> _ContextLogger:
    """
    Хаанаас ч дуудаж болох logger factory.

    Жишээ:
        logger = get_logger(__name__)
        logger.info("Worker started", provider="gemini", model="gemini-1.5-pro")
        logger.warning("Retry attempt", entry_id=5, attempt=2)
        logger.error("Analysis failed", entry_id=5, error=str(e))
    """
    _setup_root_logger()
    base = logging.getLogger(name)
    return _ContextLogger(base, {})
