// ─── Централ API config ───────────────────────────────────────
// Энэ файлд байгаа утгуудыг .env-с авна.
// Next.js: NEXT_PUBLIC_ prefix шаардлагатай (client-side readable)

export const API_CONFIG = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
} as const;
