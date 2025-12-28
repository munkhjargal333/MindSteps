'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

// Саяны зураг дээрх шиг Soft Blue Gradient-тай лого
const MindfulLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mindfulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* Зөөлөн тойрог хэлбэртэй Zen/Mindful дүрс */}
    <circle cx="50" cy="50" r="40" stroke="url(#mindfulGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="180 60" />
    <path d="M50 30C50 30 35 45 35 55C35 63.2843 41.7157 70 50 70C58.2843 70 65 63.2843 65 55C65 45 50 30 50 30Z" fill="url(#mindfulGradient)" />
  </svg>
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }
    if (password.length < 6) {
      setError('Нууц үг 6-аас дээш тэмдэгт байх ёстой');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
    } catch (err: any) {
      const errorMessage = err?.message || 'Бүртгэл үүсгэхэд алдаа гарлаа';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 overflow-hidden relative font-sans">
      {/* Background Ornaments - Зөөлөн гэрэлтсэн фон */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-500" />
              <MindfulLogo className="w-16 h-16 relative z-10 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <span className="block text-3xl font-black text-gray-900 italic leading-none tracking-tighter">Mindful</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 block">Step by Step</span>
            </div>
          </Link>
        </div>

        {/* Card - Glassmorphism стиль */}
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 md:p-10 border-b-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-black text-gray-900 italic uppercase">Бүртгүүлэх</h1>
            <p className="text-gray-400 font-medium text-[10px] mt-1 uppercase tracking-widest">Аялалаа өнөөдөр эхлүүл</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', type: 'text', placeholder: 'Таны нэр', icon: User, value: name, setter: setName },
              { id: 'email', type: 'email', placeholder: 'И-мэйл хаяг', icon: Mail, value: email, setter: setEmail },
              { id: 'password', type: 'password', placeholder: 'Нууц үг', icon: Lock, value: password, setter: setPassword },
              { id: 'confirm', type: 'password', placeholder: 'Нууц үг баталгаажуулах', icon: Lock, value: confirmPassword, setter: setConfirmPassword }
            ].map((input) => (
              <div key={input.id} className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                  <input.icon size={18} />
                </div>
                <input
                  type={input.type}
                  value={input.value}
                  onChange={(e) => input.setter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-600 outline-none transition-all duration-300 font-medium text-sm placeholder:text-gray-300 shadow-sm"
                  placeholder={input.placeholder}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Уншиж байна...</span>
                </div>
              ) : (
                <>Бүртгүүлэх <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Бүртгэлтэй юу?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-1 transition-colors font-black">
                  Нэвтрэх
                </Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}