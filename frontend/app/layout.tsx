import type { Metadata, Viewport } from 'next';
import { Providers } from '@/context/Providers';
import { Plus_Jakarta_Sans } from 'next/font/google'; 
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
    default: 'Mindful - Өөрийгөө олох зам',
    template: '%s | Mindful'
  },
  description: 'Өөрийгөө таних аялалд чиглэсэн мэдлэг, бясалгал, тэмдэглэлийн платформ',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning className={`${jakarta.variable}`}>
      <body className={`${jakarta.className} antialiased min-h-screen bg-theme-gradient`}>
        <Providers>
 
            <ToastProvider>
              {children}  {/* ← main-ийг энд шууд оруулах */}
              <PWARegister />
            </ToastProvider>
          
        </Providers>
      </body>
    </html>
  );
}
