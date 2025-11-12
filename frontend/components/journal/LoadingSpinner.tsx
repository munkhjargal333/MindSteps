export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-base sm:text-lg text-gray-600">тэмдэглэлууд ачааллаж байна...</div>
    </div>
  );
}
