import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Plus_Jakarta_Sans } from 'next/font/google'; 
import { AuthProvider } from "@/context/AuthContext";

// Фонт тохируулга
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Mindful - Тэмдэглэл ба Бясалгалын Платформ',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning-ийг энд нэмж өгнө
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
