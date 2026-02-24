-- ============================================================
-- Supabase SQL Editor-т ажиллуул
-- Schema: mind
-- ============================================================

-- 1. Schema үүсгэ
CREATE SCHEMA IF NOT EXISTS mind;

-- 2. journal_entries хүснэгт
--    user_id = auth.users.id (UUID) — FK шаардахгүй,
--    Supabase auth schema нь хязгаарлагдмал байдаг
CREATE TABLE IF NOT EXISTS mind.journal_entries (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID        NOT NULL,           -- auth.users.id
    text        TEXT        NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
                                                -- pending|analyzing|done|failed
    analysis    JSONB,                          -- AI шинжилгээний үр дүн
    ai_provider VARCHAR(50),                    -- gemini|anthropic|openai
    ai_model    VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id
    ON mind.journal_entries (user_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_status
    ON mind.journal_entries (status);

CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at
    ON mind.journal_entries (created_at DESC);

-- JSONB index (hawkins level-р хайхад)
CREATE INDEX IF NOT EXISTS idx_journal_entries_analysis
    ON mind.journal_entries USING GIN (analysis);

-- 4. updated_at auto-update trigger
CREATE OR REPLACE FUNCTION mind.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_journal_entries_updated_at ON mind.journal_entries;
CREATE TRIGGER trg_journal_entries_updated_at
    BEFORE UPDATE ON mind.journal_entries
    FOR EACH ROW EXECUTE FUNCTION mind.set_updated_at();

-- 5. Row Level Security (RLS) — Supabase аюулгүй байдал
ALTER TABLE mind.journal_entries ENABLE ROW LEVEL SECURITY;

-- Хэрэглэгч зөвхөн өөрийнхөө мөрийг харна
CREATE POLICY "users_own_entries" ON mind.journal_entries
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role (backend worker) бүгдийг харна
CREATE POLICY "service_role_all" ON mind.journal_entries
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Backend search_path тохиргоо
-- .env дотор DB_SCHEMA=mind тохируулснаар
-- FastAPI connect_args search_path=mind гэж очно
