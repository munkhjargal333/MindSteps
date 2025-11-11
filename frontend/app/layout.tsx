import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mindful - Таны сэтгэцийн аюулгүй орон зай',
  description: 'Журнал, сэтгэл санаа, зорилго, болон бясалгалын платформ',
  icons: {
    icon: '/logo.webp', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}