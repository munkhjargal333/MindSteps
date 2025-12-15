# config.py
"""
Тохиргооны файл - DeepSeek-V3.2 API
Орчны хувьсагчид болон үндсэн параметрүүд
"""
import os
from typing import Optional


class Config:
    """Апп-ын тохиргоо"""
    
    # ============ APP INFO ============
    APP_TITLE: str = "Монгол Prompt Engineering API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "DeepSeek-V3.2 дээр суурилсан Монгол хэлний AI туслах"
    
    # ============ HUGGINGFACE ============
    # HuggingFace Token (орчны хувьсагчаас унших)
    HF_TOKEN: Optional[str] = os.getenv("HF_TOKEN")
    
    # Model нэр
    MODEL_NAME: str = "deepseek-ai/DeepSeek-V3.2"
    
    # ============ MODEL PARAMETERS ============
    # Үндсэн параметрүүд
    TEMPERATURE: float = 0.3        # 0.0-2.0 (Бага = баримтад суурилсан, Өндөр = бүтээлч)
    MAX_TOKENS: int = 500           # 1-4000 (model-оос хамаарна)
    TOP_P: float = 0.9              # 0.0-1.0 (Nucleus sampling)
    TOP_K: int = 50                 # Top-K sampling
    
    # Шийтгэлийн параметрүүд
    REPETITION_PENALTY: float = 1.1     # 0.0-2.0 (Давталтыг багасгах)
    PRESENCE_PENALTY: float = 0.2       # 0.0-2.0 (Шинэ сэдэв гаргах)
    FREQUENCY_PENALTY: float = 0.0      # 0.0-2.0 (Давтамжийн шийтгэл)
    
    # ============ API SETTINGS ============
    # Timeout (секундээр)
    API_TIMEOUT: int = 60
    
    # Retry тохиргоо
    MAX_RETRIES: int = 3
    RETRY_DELAY: float = 1.0  # секунд
    
    # ============ LOGGING ============
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # ============ VALIDATION ============
    @classmethod
    def validate(cls) -> None:
        """
        Тохиргоог шалгах
        
        Raises:
            ValueError: Хэрэв шаардлагатай тохиргоо дутуу бол
        """
        if not cls.HF_TOKEN:
            raise ValueError(
                "⚠️ HF_TOKEN байхгүй байна!\n"
                "Орчны хувьсагч дээр тохируулна уу:\n"
                "export HF_TOKEN='your_token_here'\n"
                "эсвэл .env файл ашигла"
            )
        
        # Temperature хязгаар
        if not 0.0 <= cls.TEMPERATURE <= 2.0:
            raise ValueError(f"TEMPERATURE 0.0-2.0 хооронд байх ёстой: {cls.TEMPERATURE}")
        
        # Max tokens хязгаар
        if not 1 <= cls.MAX_TOKENS <= 4000:
            raise ValueError(f"MAX_TOKENS 1-4000 хооронд байх ёстой: {cls.MAX_TOKENS}")
        
        # Top P хязгаар
        if not 0.0 <= cls.TOP_P <= 1.0:
            raise ValueError(f"TOP_P 0.0-1.0 хооронд байх ёстой: {cls.TOP_P}")
    
    @classmethod
    def get_model_params(cls) -> dict:
        """
        Model параметрүүдийг dictionary-ээр буцаах
        
        Returns:
            dict: Бүх model параметрүүд
        """
        return {
            "model": cls.MODEL_NAME,
            "temperature": cls.TEMPERATURE,
            "max_tokens": cls.MAX_TOKENS,
            "top_p": cls.TOP_P,
            "top_k": cls.TOP_K,
            "repetition_penalty": cls.REPETITION_PENALTY,
            "presence_penalty": cls.PRESENCE_PENALTY,
            "frequency_penalty": cls.FREQUENCY_PENALTY,
        }
    
    @classmethod
    def info(cls) -> dict:
        """
        Тохиргооны мэдээлэл
        
        Returns:
            dict: Тохиргооны мэдээлэл
        """
        return {
            "app": {
                "title": cls.APP_TITLE,
                "version": cls.APP_VERSION,
                "description": cls.APP_DESCRIPTION,
            },
            "model": {
                "name": cls.MODEL_NAME,
                "provider": "HuggingFace",
                "has_token": bool(cls.HF_TOKEN),
            },
            "parameters": cls.get_model_params(),
            "api": {
                "timeout": cls.API_TIMEOUT,
                "max_retries": cls.MAX_RETRIES,
                "retry_delay": cls.RETRY_DELAY,
            }
        }


# ============ ENVIRONMENT SETUP ============
def load_env_file(filepath: str = ".env") -> None:
    """
    .env файлаас орчны хувьсагчдыг ачаалах
    
    Args:
        filepath: .env файлын зам
    """
    try:
        if not os.path.exists(filepath):
            print(f"⚠️ {filepath} файл олдсонгүй")
            return
        
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip().strip('"').strip("'")
                        os.environ[key] = value
        
        print(f"✅ {filepath} ачаалагдлаа")
    except Exception as e:
        print(f"⚠️ .env ачаалах алдаа: {e}")


# ============ TESTING ============
if __name__ == "__main__":
    print("🧪 Config тест\n" + "=" * 60)
    
    # .env файл ачаалах (хэрэв байвал)
    load_env_file()
    
    try:
        # Validation
        Config.validate()
        print("✅ Тохиргоо зөв байна\n")
        
        # Мэдээлэл харуулах
        import json
        info = Config.info()
        print(json.dumps(info, indent=2, ensure_ascii=False))
        
    except ValueError as e:
        print(f"❌ {e}")
    
    print("\n" + "=" * 60)