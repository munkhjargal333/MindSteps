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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-3 md:gap-8">
              <Link
                href="/dashboard"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 flex items-center gap-2"
              >
                <span className="text-xl sm:text-2xl">🧘</span>
                <span className="hidden sm:inline">Mindful</span>
              </Link>

              {/* Desktop & Tablet Nav */}
              <div className="hidden md:flex gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base lg:text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: User Info + Menu */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Desktop User Info */}
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  Lv.{user?.current_level} • {user?.total_score} pts
                </div>
              </div>

              {/* Logout Button (Tablet & up) */}
              <button
                onClick={logout}
                className="hidden sm:block px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Гарах
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="grid grid-cols-2 gap-2 p-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              {/* Logout inside menu on mobile */}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                🚪 Гарах
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="grid grid-cols-6 gap-0.5 p-1.5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
