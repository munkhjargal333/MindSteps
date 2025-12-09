import { Providers } from '@/context/Providers';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mindful - Таны сэтгэцийн аюулгүй орон зай',
  description: 'Өдрийн тэмдэглэл, сэтгэл санаа, зорилго, болон бясалгалын платформ',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}