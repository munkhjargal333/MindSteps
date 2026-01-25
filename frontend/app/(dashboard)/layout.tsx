'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/lib/hooks/useGamification';
import { 
  Compass, BookOpen, Activity, Gem, 
  Sparkles, LogOut, Menu, X, User, Sunrise
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { gamification, loading } = useGamification(user?.id);

  // Хэрэв дата ачаалж дуусаагүй бол null safety ашиглах
  const currentLevel = gamification?.level?.level_number || 1;
  const totalScore = gamification?.total_score || 0;
  const levelName = gamification?.level?.level_name || 'Шинэ';
  const levelIcon = gamification?.level?.icon || '🌱';
  const levelColor = gamification?.level?.color || '#3b82f6';

    const navigation = [
    { name: 'Нүүр', href: '/dashboard', icon: <Compass size={20} />, shortName: 'Нүүр' },
    { name: 'Бодол', href: '/journal', icon: <BookOpen size={20} />, shortName: 'Бодол' },
    { name: 'Сэтгэл', href: '/mood', icon: <Activity size={20} />, shortName: 'Сэтгэл' },
    { name: 'Цэнэ', href: '/core-values', icon: <Gem size={20} />, shortName: 'Цэнэ' },
    { name: 'Мэдлэг', href: '/lessons', icon: <Sparkles size={20} />, shortName: 'Мэдлэг' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      
      {/* ========== DESKTOP NAVIGATION ========== */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 hidden md:block shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo & Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:shadow-xl transition-all">
                  <Sunrise size={24} />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  Mind<span className="text-blue-600">ful</span>
                </span>
              </Link>

              <div className="flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span className={isActive(item.href) ? 'scale-110' : ''}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              {/* Gamification Badge - Level color ашигласан */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-2xl border-2 shadow-sm"
                style={{ 
                  backgroundColor: `${levelColor}15`,
                  borderColor: `${levelColor}40`
                }}
              >
                <div className="text-2xl">{levelIcon}</div>
                <div className="text-right">
                  <p className="text-xs font-black leading-none" style={{ color: levelColor }}>
                    Level {currentLevel}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-tight mt-0.5" style={{ color: `${levelColor}cc` }}>
                    {totalScore} оноо
                  </p>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.user_metadata.name || 'User'}</p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight mt-1">
                    {levelName}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-500 shadow-inner">
                  <User size={20} />
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={logout} 
                className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Гарах"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== MOBILE HEADER ========== */}
      <div className="md:hidden flex justify-between items-center px-4 h-16 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Sunrise size={20} />
          </div>
          <span className="font-black text-lg text-gray-900">Mind<span className="text-blue-600">ful</span></span>
        </Link>
        
        <div className="flex items-center gap-2">
          {/* Mobile Score Badge - Level color ашигласан */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2"
            style={{ 
              backgroundColor: `${levelColor}15`,
              borderColor: `${levelColor}40`
            }}
          >
            <span className="text-base">{levelIcon}</span>
            <span className="text-xs font-black" style={{ color: levelColor }}>Lv.{currentLevel}</span>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ========== MOBILE SLIDE DRAWER ========== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-[60] md:hidden shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Цэс</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Navigation</p>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 bg-white rounded-xl text-gray-500 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info Card - Level color ашигласан */}
              <div className="m-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg text-2xl"
                    style={{ backgroundColor: levelColor }}
                  >
                    {levelIcon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-none">{user?.user_metadata.name || 'User'}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide mt-1" style={{ color: levelColor }}>
                      {levelName}
                    </p>
                  </div>
                </div>
                
                {/* Level & Score */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-black" style={{ color: levelColor }}>{currentLevel}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Level</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-black text-amber-600">{totalScore}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Оноо</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-black text-green-600">{gamification?.current_streak || 0}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Цуваа</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${
                      isActive(item.href) 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive(item.href) ? 'scale-110' : ''}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-100 mt-auto">
                <button 
                  onClick={logout} 
                  className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Гарах</span>
                </button>
              </div>

              {/* Footer */}
              <div className="p-6 text-center">
                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">Mindful v1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== MOBILE BOTTOM NAVIGATION ========== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-4 mb-4">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-[2rem] px-2 py-3"
          >
            <div className="flex justify-around items-center">
              {navigation.slice(0, 5).map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2"
                  >
                    {active && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 rounded-2xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className={`transition-all duration-300 ${active ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tight transition-all ${
                      active ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {item.shortName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-x-hidden pb-28 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}