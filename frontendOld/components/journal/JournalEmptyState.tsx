import Link from "next/link";

export default function JournalEmptyState() {
  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="text-5xl sm:text-6xl mb-4">📔</div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">тэмдэглэл байхгүй байна</h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6">Эхний тэмдэглэлаа бичиж эхлээрэй!</p>
      <Link
        href="/journal/new"
        className="inline-block px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-lg"
      >
        тэмдэглэл бичих
      </Link>
    </div>
  );
}
