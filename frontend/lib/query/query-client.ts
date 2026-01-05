import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Өгөгдөл 5 минутын турш "шинэ" хэвээр байна
      gcTime: 1000 * 60 * 10,    // Ашиглагдахгүй байгаа кэшийг 10 минутын дараа устгана
      retry: 1,                 // Алдаа гарвал 1 удаа дахин оролдоно
      refetchOnWindowFocus: false, // Цонх солиод буцаж ирэхэд дахин дуудахыг болиулах
    },
  },
});