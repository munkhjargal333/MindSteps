'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Journal } from '@/lib/types';
import JournalCard from '@/components/journal/JournalCard';
import Link from 'next/link';

import LoadingSpinner from '@/components/journal/LoadingSpinner';
import JournalEmptyState from '@/components/journal/JournalEmptyState';
import Pagination from '@/components/journal/Pagination';

export default function JournalListPage() {
  const { token } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadJournals = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiClient.getJournals(page, 10, token);
      setJournals(data.journals);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => { if (token) loadJournals(); }, [token, loadJournals]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Энэ тэмдэглэлийгг устгахдаа итгэлтэй байна уу?')) return;
    setDeletingId(id);
    try {
      await apiClient.deleteJournal(id, token);
      setJournals(prev => prev.filter(j => j.id !== id));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Тэмдэглэл устгахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally { setDeletingId(null); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📔 Миний тэмдэглэлүүд</h1>
        <Link
          href="/journal/new"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition text-center text-sm sm:text-base shadow-lg"
        >
          <span className="sm:hidden">+ Шинэ</span>
          <span className="hidden sm:inline">+ Шинэ тэмдэглэл</span>
        </Link>
      </div>

      {journals.length === 0 ? (
        <JournalEmptyState />
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {journals.map(journal => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onDelete={handleDelete}
                isDeleting={deletingId === journal.id}
              />
            ))}
          </div>

          <Pagination page={page} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
