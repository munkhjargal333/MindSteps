import type { Metadata, Viewport } from 'next';
import { Providers } from '@/context/Providers';
import './globals.css';
import PWARegister from '@/public/pwa-register';

export const metadata: Metadata = {
  title: 'Mindful - Таны сэтгэцийн аюулгүй орон зай',
  description:
    'Өдрийн тэмдэглэл, сэтгэл санаа, зорилго, болон бясалгалын платформ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mindful',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="mn"
      suppressHydrationWarning
      className="bg-black"
    >
      <body className="antialiased min-h-screen bg-theme-gradient">
        <Providers>
          {children}
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}