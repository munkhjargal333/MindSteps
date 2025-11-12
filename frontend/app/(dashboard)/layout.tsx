'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Нүүр', href: '/dashboard', icon: '🏠' },
    { name: 'Өдрийн тэмдэглэл', href: '/journal', icon: '📔' },
    { name: 'Сэтгэл санаа', href: '/mood', icon: '😊' },
    { name: 'Зорилго', href: '/goals', icon: '🎯' },
    { name: 'Хичээл', href: '/lessons', icon: '📚' },
    { name: 'Бясалгал', href: '/meditation', icon: '🧘' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Left Side */}
            <div className="flex items-center gap-3 sm:gap-8">
              <Link 
                href="/dashboard" 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 flex items-center gap-2"
              >
                <span className="text-2xl sm:text-3xl">🧘</span>
                <span>Mindful</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2.5 rounded-lg text-base font-medium transition flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Info - Desktop & Tablet */}
              <div className="hidden sm:block text-right">
                <div className="text-sm sm:text-base font-medium text-gray-900">
                  {user?.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Level {user?.current_level} • {user?.total_score} pts
                </div>
              </div>

              {/* Mobile User Stats */}
              <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">Lv.{user?.current_level}</span>
                <span className="text-gray-400">|</span>
                <span>{user?.total_score}pts</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Гарах
              </button>

              {/* Mobile Menu Toggle - Tablet only */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <div className="grid grid-cols-6 gap-0.5 p-1.5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition active:scale-95 ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <span className="text-lg sm:text-xl mb-0.5">{item.icon}</span>
              <span className="text-[9px] sm:text-[10px] leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content with proper spacing */}
      <main className="pb-20 md:pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}