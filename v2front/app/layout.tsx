import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Plus_Jakarta_Sans } from 'next/font/google'; 
import { AuthProvider } from "@/contexts/AuthContext";
import { ThoughtProvider } from "@/components/thought";
// import { TourProvider } from "@/contexts/TourContext";

// Фонт тохируулга
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Ухаалаг тэмдэглэлийн дэвтэр',
    template: '%s | Mind-steps'
  },
  description: 'Сэтгэлзүйн туслах платформ',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mind-steps',
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
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* <TourProvider> */}
              <ThoughtProvider >
                  {children}
              </ThoughtProvider>
            {/* </TourProvider> */}

          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
