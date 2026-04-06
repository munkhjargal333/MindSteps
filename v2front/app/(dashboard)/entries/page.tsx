// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/entries/page.tsx  — CLIENT COMPONENT
// Journal entries list page. All data logic in useEntries hook.
// This file is ONLY layout + rendering — zero business logic.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Suspense } from 'react';
import { Search, Trash2, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionBadge } from '@/components/atoms/ActionBadge';
import { useEntries } from '@/features/entries/hooks/useEntries';
import { useThoughtContext } from '@/contexts/TierContext';
import { cn } from '@/lib/utils';
import { relativeTimeMn } from '@/lib/utils/date';

export default function EntriesPage() {
  return (
    <Suspense fallback={<EntriesSkeleton />}>
      <EntriesView />
    </Suspense>
  );
}

function EntriesView() {
  const { token } = useThoughtContext();
  const {
    entries,
    total,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    remove,
  } = useEntries({ token, pageSize: 20 });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Түүх</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} тэмдэглэл
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <EntriesSkeleton />}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <BookOpen size={32} className="opacity-30" />
          <p className="text-sm">Тэмдэглэл байхгүй байна</p>
        </div>
      )}

      {/* Entry list */}
      {!loading && entries.length > 0 && (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="group p-4 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    {relativeTimeMn(entry.created_at)}
                  </p>
                  {entry.surface_text && (
                    <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                      {entry.surface_text}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity',
                      'text-muted-foreground hover:text-destructive'
                    )}
                    onClick={() => remove(entry.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Өмнөх
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Дараах
          </Button>
        </div>
      )}
    </div>
  );
}

function EntriesSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
