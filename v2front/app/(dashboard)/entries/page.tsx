'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEntries } from '@/lib/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lock,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { relativeTimeMn } from '@/lib/utils/date';

// ─── Helper ───────────────────────────────────────────────────

function relativeTime(iso: string) {
  return relativeTimeMn(iso);
}

function EntryCard({
  entry,
  onDelete,
  deleting,
}: {
  entry: {
    id: string;
    surface_text: string | null;
    is_encrypted: boolean;
    is_text_saved: boolean;
    entry_index: number;
    created_at: string;
  };
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const preview = entry.surface_text?.slice(0, 120) ?? null;

  return (
    <div className="group relative flex gap-4 p-4 rounded-2xl border bg-card hover:border-primary/40 transition-all">
      {/* Index badge */}
      <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
        #{entry.entry_index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[13px] text-muted-foreground">
            {relativeTime(entry.created_at)}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {entry.is_encrypted && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                <Lock size={9} />
                Шифрлэгдсэн
              </span>
            )}
            {!entry.is_text_saved && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                <FileText size={9} />
                Хадгалаагүй
              </span>
            )}
          </div>
        </div>

        {preview ? (
          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{preview}</p>
        ) : (
          <p className="text-sm text-muted-foreground/40 italic">
            {entry.is_encrypted ? 'Шифрлэгдсэн бичлэг' : 'Текст хадгалаагүй'}
          </p>
        )}
      </div>

      {/* Actions (appear on hover) */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/entries/${entry.id}`}>
          <Button variant="ghost" size="sm" className="rounded-xl text-xs h-8">
            Дэлгэрэнгүй
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(entry.id)}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function EntriesPage() {
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ бичлэгийг устгах уу?')) return;
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Бичлэгүүд</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Нийт {total} бичлэг
            </p>
          </div>
          <Link href="/home">
            <Button size="sm" className="rounded-xl gap-2">
              <BookOpen size={14} />
              Шинэ
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хайх..."
            className="pl-9 rounded-xl bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <BookOpen size={24} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-medium text-foreground/70">Бичлэг олдсонгүй</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? 'Өөр үгээр хайж үзнэ үү' : 'Эхний бичлэгээ үүсгэнэ үү'}
              </p>
            </div>
            {!search && (
              <Link href="/home">
                <Button size="sm" variant="outline" className="rounded-xl">
                  Бичлэг үүсгэх →
                </Button>
              </Link>
            )}
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                deleting={deletingId === entry.id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-xl gap-1"
            >
              <ChevronLeft size={14} />
              Өмнөх
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="rounded-xl gap-1"
            >
              Дараах
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>
  );
}
