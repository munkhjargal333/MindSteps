'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, BookOpen, Activity, Gem, 
  Sparkles, Flower2, LogOut, Menu, X, User, 
  LayoutDashboard
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Нэршлийг сэтгэл зүйн утга агуулгатай болгон шинэчлэв
  const navigation = [
    { name: 'Миний ертөнц', href: '/dashboard', icon: <Compass size={20} /> },
    { name: 'Бодол', href: '/journal', icon: <BookOpen size={20} /> },
    { name: 'Сэтгэл зүй', href: '/mood', icon: <Activity size={20} /> },
    { name: 'Үнэт зүйл', href: '/core-values', icon: <Gem size={20} /> },
    { name: 'Мэдлэгийн сан', href: '/lessons', icon: <Sparkles size={20} /> },
    { name: 'Амар амгалан', href: '/meditation', icon: <Flower2 size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* 🟢 TOP NAVIGATION (Desktop) */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Flower2 size={24} />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight italic">Mindful</span>
              </Link>

              <div className="flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-900 leading-none">{user?.name || 'User'}</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">
                    Level {user?.current_level || 1} • {user?.total_score || 0} pts
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <User size={20} />
                </div>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-rose-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE HEADER (Зөвхөн Mobile дээр) */}
      <div className="md:hidden flex justify-between items-center px-6 h-16 bg-white sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
             <Flower2 size={18} />
           </div>
           <span className="font-black text-gray-900 italic">Mindful</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-gray-50 rounded-xl text-gray-600"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 📱 MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[60] bg-white p-8 md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-black text-2xl italic">Цэс</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-100 rounded-2xl">
                <X size={24} />
              </button>
            </div>

            {/* User Info Mobile */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">
                    Level {user?.current_level || 1} • {user?.total_score || 0} pts
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all ${
                    isActive(item.href) 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={logout} 
                className="mt-8 flex items-center justify-center gap-2 p-5 rounded-[2rem] bg-rose-50 text-rose-500 font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
              >
                <LogOut size={20} /> Гарах
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📱 FLOATING BOTTOM NAVIGATION (Mobile-д зориулсан) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] px-3 py-3"
        >
          <div className="flex justify-around items-center gap-2">
            {navigation.slice(0, 5).map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center gap-1 flex-1"
                >
                  {active && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`transition-all duration-300 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${
                    active ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {item.name.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-x-hidden pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}