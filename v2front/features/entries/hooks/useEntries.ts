// ─────────────────────────────────────────────────────────────────────────────
// features/entries/hooks/useEntries.ts
// Feature hook for journal entries list + single entry.
// Delegates ALL API calls to journal.service.ts
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JournalEntry, PaginatedEntries } from '@/types';
import {
  listEntries,
  getEntry,
  deleteEntry,
} from '@/lib/services/journal.service';

// ─── useEntries (paginated list) ──────────────────────────────────────────────

interface UseEntriesOptions {
  token: string | null;
  initialPage?: number;
  pageSize?: number;
}

export function useEntries({
  token,
  initialPage = 1,
  pageSize = 20,
}: UseEntriesOptions) {
  const [data, setData] = useState<PaginatedEntries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');

  const fetchPage = useCallback(
    async (p: number, s: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await listEntries(token, {
          page: p,
          page_size: pageSize,
          search: s || undefined,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    },
    [token, pageSize]
  );

  useEffect(() => {
    fetchPage(page, search);
  }, [fetchPage, page, search]);

  const refresh = () => fetchPage(page, search);

  const remove = async (entryId: string) => {
    if (!token) return;
    await deleteEntry(token, entryId);
    await fetchPage(page, search);
  };

  return {
    entries: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch: (s: string) => {
      setSearch(s);
      setPage(1);
    },
    setPage,
    refresh,
    remove,
  } as const;
}

// ─── useEntry (single entry) ──────────────────────────────────────────────────

export function useEntry(token: string | null, entryId: string | null) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !entryId) return;
    setLoading(true);
    setError(null);
    getEntry(token, entryId)
      .then(setEntry)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
      )
      .finally(() => setLoading(false));
  }, [token, entryId]);

  return { entry, loading, error } as const;
}
