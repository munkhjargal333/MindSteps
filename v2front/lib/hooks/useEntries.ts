'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  listEntries,
  getEntry,
  deleteEntry,
  type EntryResponse,
  type PaginatedEntryResponse,
} from '@/lib/api/journalBackend';

// ─── List hook ────────────────────────────────────────────────

interface UseEntriesOptions {
  token: string | null;
  initialPage?: number;
  pageSize?: number;
}

export function useEntries({ token, initialPage = 1, pageSize = 20 }: UseEntriesOptions) {
  const [data, setData] = useState<PaginatedEntryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');

  const fetch = useCallback(
    async (p: number, s: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await listEntries(token, { page: p, page_size: pageSize, search: s || undefined });
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
    fetch(page, search);
  }, [fetch, page, search]);

  const refresh = () => fetch(page, search);

  const remove = async (entryId: string) => {
    if (!token) return;
    await deleteEntry(token, entryId);
    await fetch(page, search);
  };

  return {
    entries: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch: (s: string) => { setSearch(s); setPage(1); },
    setPage,
    refresh,
    remove,
  };
}

// ─── Single entry hook ────────────────────────────────────────

export function useEntry(token: string | null, entryId: string | null) {
  const [entry, setEntry] = useState<EntryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !entryId) return;
    setLoading(true);
    setError(null);
    getEntry(token, entryId)
      .then(setEntry)
      .catch((err) => setError(err instanceof Error ? err.message : 'Алдаа гарлаа'))
      .finally(() => setLoading(false));
  }, [token, entryId]);

  return { entry, loading, error };
}
