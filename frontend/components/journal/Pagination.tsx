interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / 10);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
      >
        ← Өмнөх
      </button>

      <div className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm sm:text-base">
        {page} / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
      >
        Дараах →
      </button>
    </div>
  );
}
