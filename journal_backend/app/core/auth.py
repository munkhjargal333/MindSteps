"""
Supabase Auth Integration
=========================

Supabase Auth-ийн JWT token-г FastAPI-д verify хийх.

Яаж ажилладаг:
  1. Frontend: supabase.auth.signIn() → access_token авна
  2. Frontend: Authorization: Bearer <access_token> header илгээнэ
  3. FastAPI: JWT-г Supabase public key-р verify хийнэ
  4. user_id (sub claim) → бүх route-д ашиглана

ЧУХАЛ — Supabase JWT-д байдаг:
  {
    "sub": "uuid-v4",          ← user id (auth.users.id)
    "email": "...",
    "role": "authenticated",
    "aud": "authenticated",
    "exp": 1234567890
  }
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import httpx
from functools import lru_cache
from app.core.config import get_settings

settings = get_settings()
bearer_scheme = HTTPBearer()


@lru_cache(maxsize=1)
def _get_supabase_public_key() -> str:
    """
    Supabase JWT public key (JWKS endpoint-с татна).
    Production-д env-д хадгална — network call хийхгүйн тулд.
    """
    if settings.supabase_jwt_secret:
        # Хялбар аргаар: Supabase dashboard → Settings → API → JWT Secret
        return settings.supabase_jwt_secret
    raise ValueError("SUPABASE_JWT_SECRET тохируулаагүй байна")


class AuthUser:
    """Verify хийгдсэн хэрэглэгчийн мэдээлэл."""
    def __init__(self, user_id: str, email: str | None, role: str):
        self.user_id = user_id      # Supabase auth.users.id (UUID)
        self.email = email
        self.role = role


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    """
    FastAPI dependency — route-д inject хийнэ.

    Хэрэглэх:
        @router.post("/journal/")
        async def create_entry(user: AuthUser = Depends(get_current_user)):
            user_id = user.user_id
    """
    token = credentials.credentials
    try:
        secret = _get_supabase_public_key()
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return AuthUser(
            user_id=payload["sub"],
            email=payload.get("email"),
            role=payload.get("role", "authenticated"),
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token дууссан байна. Дахин нэвтэрнэ үү.",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token буруу байна: {e}",
        )


# ── Optional: Dev mode-д auth тойрч гарах ───────────────────
async def get_current_user_or_dev(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        HTTPBearer(auto_error=False)
    ),
) -> AuthUser:
    """
    DEBUG=true үед token шаардахгүй — dev хялбар болгоно.
    Production-д get_current_user ашиглах ёстой.
    """
    if settings.debug and not credentials:
        return AuthUser(
            user_id="00000000-0000-0000-0000-000000000001",
            email="dev@local.test",
            role="authenticated",
        )
    return await get_current_user(credentials)
