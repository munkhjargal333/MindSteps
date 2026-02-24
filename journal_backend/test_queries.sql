-- ============================================================
-- TEST QUERIES — Supabase SQL Editor эсвэл psql-д ажиллуул
-- ============================================================
SET search_path TO mind;


-- ──────────────────────────────────────────────────────────────
-- 1. SCHEMA / TABLE шалгах
-- ──────────────────────────────────────────────────────────────

-- Бүх column-ийг харах
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'mind'
  AND table_name   = 'journal_entries'
ORDER BY ordinal_position;

-- RLS policy-нүүдийг харах
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'mind'
  AND tablename  = 'journal_entries';


-- ──────────────────────────────────────────────────────────────
-- 2. CRUD TEST — өгөгдөл оруулах/унших
-- ──────────────────────────────────────────────────────────────

-- Test entry оруулах (service role-оор)
INSERT INTO mind.journal_entries (user_id, text, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',  -- test user UUID
    'Өнөөдөр маш сайн унтлаа, ажил сайн явлаа.',
    'pending'
)
RETURNING id, user_id, status, created_at;

-- Pending entry-нүүдийг харах
SELECT id, user_id, text, status, created_at
FROM mind.journal_entries
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Шинжилгээ дууссан entry-г харах
SELECT
    id,
    text,
    status,
    analysis->>'summary'                        AS summary,
    (analysis->'hawkins'->>'level')::int        AS hawkins_level,
    analysis->'hawkins'->>'emotion'             AS emotion,
    analysis->'plutchik'->>'primary_dyad'       AS dyad,
    ai_provider,
    created_at
FROM mind.journal_entries
WHERE status = 'done'
ORDER BY created_at DESC
LIMIT 10;

-- Нэг entry-ийн бүрэн analysis харах
SELECT id, analysis
FROM mind.journal_entries
WHERE id = 1;  -- ← id-г солино


-- ──────────────────────────────────────────────────────────────
-- 3. HAWKINS LEVEL ШИНЖИЛГЭЭ
-- ──────────────────────────────────────────────────────────────

-- Сүүлийн 30 хоногийн Hawkins дундаж
SELECT
    DATE_TRUNC('day', created_at) AS day,
    ROUND(AVG((analysis->'hawkins'->>'level')::int)) AS avg_level,
    COUNT(*) AS entry_count
FROM mind.journal_entries
WHERE status = 'done'
  AND created_at >= NOW() - INTERVAL '30 days'
  AND user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY 1
ORDER BY 1 DESC;

-- Хамгийн өндөр level-тэй entry-нүүд
SELECT
    id,
    text,
    (analysis->'hawkins'->>'level')::int AS level,
    analysis->'hawkins'->>'emotion'       AS emotion,
    created_at
FROM mind.journal_entries
WHERE status = 'done'
  AND user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY (analysis->'hawkins'->>'level')::int DESC
LIMIT 5;


-- ──────────────────────────────────────────────────────────────
-- 4. MASLOW CLUSTER ШИНЖИЛГЭЭ
-- ──────────────────────────────────────────────────────────────

-- Maslow level тус бүрт хэдэн удаа тохиолдсон
SELECT
    maslow_item->>'key'   AS maslow_level,
    COUNT(*)              AS frequency
FROM mind.journal_entries,
     JSONB_ARRAY_ELEMENTS(analysis->'maslow') AS maslow_item
WHERE status = 'done'
  AND user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY 1
ORDER BY 2 DESC;

-- Хамгийн олон давтагдсан keyword-нүүд (maslow values)
SELECT
    maslow_item->>'key' AS level,
    keyword,
    COUNT(*) AS cnt
FROM mind.journal_entries,
     JSONB_ARRAY_ELEMENTS(analysis->'maslow') AS maslow_item,
     JSONB_ARRAY_ELEMENTS_TEXT(maslow_item->'values') AS keyword
WHERE status = 'done'
  AND user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 20;


-- ──────────────────────────────────────────────────────────────
-- 5. PLUTCHIK ШИНЖИЛГЭЭ
-- ──────────────────────────────────────────────────────────────

-- Сэтгэл хөдлөлийн тархалт
SELECT
    analysis->'plutchik'->>'primary_dyad' AS emotion_dyad,
    COUNT(*)                              AS frequency,
    ROUND(AVG((analysis->'hawkins'->>'level')::int)) AS avg_hawkins
FROM mind.journal_entries
WHERE status = 'done'
  AND user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY 1
ORDER BY 2 DESC;


-- ──────────────────────────────────────────────────────────────
-- 6. WORKER / QUEUE DEBUGGING
-- ──────────────────────────────────────────────────────────────

-- Боловсруулагдаагүй (pending) entry-нүүдийн тоо
SELECT status, COUNT(*) AS cnt
FROM mind.journal_entries
GROUP BY status
ORDER BY cnt DESC;

-- Сүүлийн 1 цагт ямар провайдер хэрэглэгдсэн
SELECT ai_provider, ai_model, COUNT(*) AS cnt
FROM mind.journal_entries
WHERE status = 'done'
  AND created_at >= NOW() - INTERVAL '1 hour'
GROUP BY 1, 2;

-- Failed entry-нүүдийн алдааг харах
SELECT id, analysis->>'error' AS error_msg, created_at
FROM mind.journal_entries
WHERE status = 'failed'
ORDER BY created_at DESC;

-- Шинжилгээ хэр хурдан дуусдагийг хэмжих (секундаар)
SELECT
    ROUND(
        EXTRACT(EPOCH FROM (updated_at - created_at))
    ) AS processing_seconds,
    ai_provider,
    COUNT(*) AS cnt
FROM mind.journal_entries
WHERE status = 'done'
GROUP BY 1, 2
ORDER BY 1;


-- ──────────────────────────────────────────────────────────────
-- 7. CLEANUP (test өгөгдөл устгах)
-- ──────────────────────────────────────────────────────────────

-- Test user-ийн өгөгдөл устгах
-- DELETE FROM mind.journal_entries
-- WHERE user_id = '00000000-0000-0000-0000-000000000001';
