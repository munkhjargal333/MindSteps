'use client';

//import { useAuth } from '../../context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Нүүр', href: '/dashboard', icon: '🏠' },
    { name: 'Журнал', href: '/journal', icon: '📔' },
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                🧘 Mindful
              </Link>
              
              <div className="hidden md:flex gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">
                  Level {user?.current_level} • {user?.total_score} pts
                </div>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Гарах
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 rounded-lg text-xs font-medium transition ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[10px]">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">{children}</main>
    </div>
  );
}
