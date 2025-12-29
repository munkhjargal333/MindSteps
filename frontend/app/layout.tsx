import type { Metadata, Viewport } from 'next';
import { Providers } from '@/context/Providers';
import { Plus_Jakarta_Sans } from 'next/font/google'; // Илүү зөөлөн, сэтгэл зүйн апп-д тохиромжтой
import './globals.css';
import PWARegister from '@/public/pwa-register';
import { ToastProvider } from '@/context/ToastContext';


// Фонт тохируулга
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Mindful - Сэтгэцийн аюулгүй орон зай',
    template: '%s | Mindful'
  },
  description: 'Өдрийн тэмдэглэл, сэтгэл санаа, зорилго, болон бясалгалын нэгдсэн платформ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mindful',
  },
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  // Энэ өнгө таны bg-theme-gradient-ийн дээд өнгөтэй ижил байвал гоё харагдана
  themeColor: '#020617', 
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mobile дээр дизайн эвдрэхээс хамгаална
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
      className={`${jakarta.variable} selection:bg-blue-100 selection:text-blue-900`}
    >
      <body className={`${jakarta.className} antialiased min-h-screen bg-theme-gradient`}>
        <Providers>
          <ToastProvider>
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
            <PWARegister />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}