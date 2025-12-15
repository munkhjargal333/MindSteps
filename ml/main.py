# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import logging
import re
from typing import Optional, List, Dict, Any
import transformers

from config import Config
from prompts import get_prompt, PromptTemplates
from encoding_dsv32 import encode_messages

# Тохиргоо шалгах
Config.validate()

# Logging тохируулга
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# HuggingFace Client
client = InferenceClient(token=Config.HF_TOKEN)

# DeepSeek Tokenizer (глобал - нэг удаа ачаална)
try:
    tokenizer = transformers.AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-V3.2")
    logger.info("✅ DeepSeek-V3.2 Tokenizer ачаалагдлаа")
except Exception as e:
    logger.warning(f"⚠️ Tokenizer ачаалах алдаа: {e}")
    tokenizer = None

# FastAPI апп
app = FastAPI(
    title=Config.APP_TITLE,
    version=Config.APP_VERSION,
    description="Монгол хэл дээрх Prompt Engineering Platform - DeepSeek-V3.2"
)


# ============ MODELS ============
class ChatInput(BaseModel):
    type: str
    message: str
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    top_p: Optional[float] = None
    top_k: Optional[int] = None
    repetition_penalty: Optional[float] = None
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    show_thinking: Optional[bool] = False


class ChatHistory(BaseModel):
    messages: List[Dict[str, str]]
    prompt_type: str = "system"
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None


class ModelResponse(BaseModel):
    """Хариултын бүтэц"""
    reply: str
    type: str
    model: str
    thinking: Optional[str] = None
    raw: Optional[str] = None
    tokens_used: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


# ============ LLM FUNCTION ============
def call_llm(
    prompt: str = None,
    messages: List[Dict[str, str]] = None,
    max_tokens: int = None,
    temperature: float = None,
    # top_p: float = 0.9,
    # top_k: int = 50,
    # repetition_penalty: float = 1.1,
    # presence_penalty: float = 0.2,
    # frequency_penalty: float = 0.0,
    show_thinking: bool = False
) -> Dict[str, Any]:
    """
    Сайжруулсан LLM дуудлага - DeepSeek-V3.2 тохируулгатай
    
    Args:
        prompt: Шууд prompt string (хэрэв messages байхгүй бол)
        messages: Chat түүх формат [{"role": "user", "content": "..."}]
        max_tokens: Хариултын дээд хэмжээ
        temperature: Хариултын сонголтын тохиргоо (0.0-2.0)
        top_p: Nucleus sampling (0.0-1.0)
        top_k: Top-K sampling
        repetition_penalty: Давталтын шийтгэл
        presence_penalty: Шинэ сэдэв гаргах түлхэц
        frequency_penalty: Давтамжийн шийтгэл
        show_thinking: <think> хэсгийг буцаах эсэх
        
    Returns:
        Dict хариулт, thinking, алдаа мэдээлэл
    """
    max_tokens = max_tokens or Config.MAX_TOKENS
    temperature = temperature or Config.TEMPERATURE
    
    # Messages эсвэл prompt шалгах
    if not messages and not prompt:
        return {"success": False, "error": "⚠️ Мессеж эсвэл промпт шаардлагатай"}
    
    # Prompt string бол messages рүү хөрвүүлэх
    if prompt and not messages:
        messages = [{"role": "user", "content": prompt}]
    
    try:
        # ============ DEEPSEEK TOKENIZATION ============
        # Encode тохиргоо
        encode_config = dict(
            thinking_mode="thinking",        # reasoning блокийг зөв удирдах
            drop_thinking=(not show_thinking),  # <think> харуулах эсэх
            add_default_bos_token=True       # BOS token автоматаар нэмэх
        )
        
        # Messages → Prompt string (DeepSeek формат)
        encoded_prompt = encode_messages(messages, **encode_config)
        
        # Prompt → Tokens (тооцооллын зорилгоор)
        tokens_input = None
        if tokenizer:
            tokens_input = tokenizer.encode(encoded_prompt)
            logger.info(f"📊 Input tokens: {len(tokens_input)}")
        
        logger.info(f"🔡 Model: {Config.MODEL_NAME}")
        logger.info(f"🔧 Тохиргоо: temp={temperature}, max_tokens={max_tokens}")

        print("Prompt:", messages)
        print("Хувиргасан promt", tokens_input)

        # print("Prompt:", len(messages))
        # print("Хувиргасан promt", len(tokens_input))
        raw_text = messages[0]["content"]
        raw_tokens = tokenizer.encode(raw_text)
        print("Анхны prompt tokens:", len(raw_tokens))
        print("Хувиргасан prompt tokens:", len(tokens_input))
        
        # ============ API ДУУДЛАГА ============
        response = client.chat.completions.create(
            model=Config.MODEL_NAME,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            # top_p=top_p,
            # top_k=top_k,
            # repetition_penalty=repetition_penalty,
            # presence_penalty=presence_penalty,
            # frequency_penalty=frequency_penalty,
            stop=["<｜end▁of▁sentence｜>"],  # DeepSeek EOS
        )
        
        raw_reply = response.choices[0].message.content.strip()
        
        # <think>...</think> хэсгийг салгах
        think_match = re.search(r"<think>(.*?)</think>", raw_reply, flags=re.DOTALL)
        thinking = think_match.group(1).strip() if think_match else ""
        
        # Жинхэнэ хариулт (<think> хасаад үлдсэн)
        clean_reply = re.sub(r"<think>.*?</think>", "", raw_reply, flags=re.DOTALL).strip()
        
        # Token тооцоо (output)
        tokens_output = len(raw_reply.split()) if not tokenizer else len(tokenizer.encode(raw_reply))
        tokens_used = (len(tokens_input) if tokens_input else 0) + tokens_output
        
        logger.info(f"✅ Хариулт бэлэн: {len(clean_reply)} тэмдэгт, ~{tokens_used} токен")
        
        return {
            "success": True,
            "reply": clean_reply,
            "thinking": thinking if show_thinking else None,
            "raw": raw_reply if show_thinking else None,
            "tokens_used": tokens_used,
            "tokens_input": len(tokens_input) if tokens_input else None,
            "tokens_output": tokens_output
        }
        
    except Exception as e:
        logger.error(f"⚠️ LLM алдаа: {str(e)}")
        error_msg = str(e).lower()
        
        # Алдааны төрлөөр ангилах
        if "rate limit" in error_msg:
            error = "⏱️ Хэт олон хүсэлт. Түр хүлээнэ үү"
        elif "loading" in error_msg or "unavailable" in error_msg:
            error = "⏳ Model ачаалагдаж байна. Дахин оролдоно уу"
        elif "token" in error_msg or "unauthorized" in error_msg:
            error = "🔒 Token алдаатай эсвэл хүчингүй"
        elif "timeout" in error_msg:
            error = "⏰ Timeout - Model удаан хариу өгч байна"
        else:
            error = f"⚠️ Алдаа: {str(e)[:300]}"
        
        return {"success": False, "error": error}


# ============ ENDPOINTS ============
@app.get("/")
def root():
    """API үндсэн мэдээлэл"""
    return {
        "status": "✅ Ажиллаж байна",
        "version": Config.APP_VERSION,
        "model": Config.MODEL_NAME,
        "description": "Монгол хэл дээрх Prompt Engineering API",
        "endpoints": {
            "GET /": "API мэдээлэл",
            "GET /prompts": "Prompt төрлүүдийн жагсаалт",
            "POST /chat": "Нэг удаагийн чат",
            "POST /chat/history": "Түүхтэй чат (multi-turn)",
            "GET /health": "Health check",
            "GET /model-info": "Model тохиргооны мэдээлэл"
        },
        "features": [
            "🤖 DeepSeek-V3.2 загвар",
            "💭 Thinking mode дэмжлэг",
            "🎯 9 төрлийн prompt engineering",
            "📊 Тохируулах боломжит параметрүүд",
            "💬 Multi-turn conversation"
        ]
    }


@app.get("/prompts")
def list_prompts():
    """Prompt төрлүүдийн жагсаалт"""
    names = PromptTemplates.get_names()
    descriptions = PromptTemplates.get_descriptions()
    
    return {
        "available": list(names.keys()),
        "templates": {k: {"name": v, "description": descriptions.get(k, "")} 
                     for k, v in names.items()},
        "count": len(names),
        "usage": "POST /chat эсвэл /chat/history дээр 'type' параметрээр сонго"
    }


@app.post("/chat")
def chat(req: ChatInput):
    """
    Нэг удаагийн чат
    
    """
    
    # Prompt төрөл шалгах
    available = list(PromptTemplates.get_all().keys())
    if req.type not in available:
        raise HTTPException(
            status_code=400,
            detail=f"⚠️ '{req.type}' байхгүй. Боломжтой: {', '.join(available)}"
        )
    
    # Хоосон мессеж шалгах
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="⚠️ Хоосон мессеж")
    
    # Prompt үүсгэх
    prompt = get_prompt(req.type, req.message)
    logger.info(f"🔎 Төрөл: {req.type} | Мессеж: {req.message[:50]}...")
    
    # LLM дуудах
    result = call_llm(
        prompt=prompt,
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        # top_p=req.top_p or 0.9,
        # top_k=req.top_k or 50,
        # repetition_penalty=req.repetition_penalty or 1.1,
        # presence_penalty=req.presence_penalty or 0.2,
        # frequency_penalty=req.frequency_penalty or 0.0,
        # show_thinking=req.show_thinking
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return ModelResponse(
        reply=result["reply"],
        type=req.type,
        model=Config.MODEL_NAME,
        thinking=result.get("thinking"),
        raw=result.get("raw"),
        tokens_used=result.get("tokens_used"),
        metadata={
            "temperature": req.temperature or Config.TEMPERATURE,
            "max_tokens": req.max_tokens or Config.MAX_TOKENS,
            "tokens_input": result.get("tokens_input"),
            "tokens_output": result.get("tokens_output")
        }
    )


@app.post("/chat/history")
def chat_with_history(req: ChatHistory):
    """
    Түүхтэй чат (multi-turn conversation)
    
    Example:
    ```json
    {
        "messages": [
            {"role": "user", "content": "Сайн уу"},
            {"role": "assistant", "content": "Сайн байна уу"},
            {"role": "user", "content": "Python гэж юу вэ?"}
        ],
        "prompt_type": "system",
        "temperature": 0.4
    }
    ```
    """
    
    # Мессеж формат шалгах
    if not req.messages or len(req.messages) == 0:
        raise HTTPException(status_code=400, detail="⚠️ Мессеж хоосон байна")
    
    # Сүүлчийн мессеж user байх ёстой
    if req.messages[-1]["role"] != "user":
        raise HTTPException(
            status_code=400, 
            detail="⚠️ Сүүлчийн мессеж 'user' байх ёстой"
        )
    
    # Prompt төрөл шалгах
    available = list(PromptTemplates.get_all().keys())
    if req.prompt_type not in available:
        raise HTTPException(
            status_code=400,
            detail=f"⚠️ '{req.prompt_type}' байхгүй"
        )
    
    # System prompt нэмэх (хэрэв байхгүй бол)
    if req.messages[0]["role"] != "system":
        system_prompt = PromptTemplates.get_system_for_type(req.prompt_type)
        req.messages.insert(0, {"role": "system", "content": system_prompt})
    
    logger.info(f"💬 Multi-turn чат: {len(req.messages)} мессеж")
    
    # LLM дуудах
    result = call_llm(
        messages=req.messages,
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        show_thinking=False
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return ModelResponse(
        reply=result["reply"],
        type=req.prompt_type,
        model=Config.MODEL_NAME,
        tokens_used=result.get("tokens_used"),
        metadata={
            "conversation_length": len(req.messages),
            "temperature": req.temperature or Config.TEMPERATURE
        }
    )


@app.get("/model-info")
def model_info():
    """Model тохиргооны мэдээлэл"""
    return {
        "model": Config.MODEL_NAME,
        "provider": "HuggingFace Inference API",
        "capabilities": {
            "thinking_mode": True,
            "multi_turn": True,
            "max_tokens": "1-4000 (model-оос хамаарна)",
            "languages": ["Монгол", "English", "Chinese", "Олон хэл"]
        },
        "default_parameters": {
            "temperature": Config.TEMPERATURE,
            "max_tokens": Config.MAX_TOKENS,
            "top_p": 0.9,
            "top_k": 50,
            "repetition_penalty": 1.1,
            "presence_penalty": 0.2,
            "frequency_penalty": 0.0
        },
        "prompt_types": list(PromptTemplates.get_all().keys())
    }


@app.get("/health")
def health():
    """Health check endpoint"""
    try:
        # Token шалгах
        if not Config.HF_TOKEN:
            return {
                "status": "unhealthy",
                "error": "🔒 HF_TOKEN байхгүй",
                "model": Config.MODEL_NAME
            }
        
        return {
            "status": "healthy",
            "model": Config.MODEL_NAME,
            "version": Config.APP_VERSION,
            "timestamp": "2025-12-12"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


# ============ ERROR HANDLERS ============
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP алдааны handler"""
    logger.error(f"HTTP алдаа: {exc.detail}")
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Ерөнхий алдааны handler"""
    logger.error(f"Ерөнхий алдаа: {str(exc)}")
    return {
        "error": f"⚠️ Серверийн алдаа: {str(exc)[:200]}",
        "status_code": 500
    }