'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sunrise, AlertCircle, X, UserCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginAnonymously, error, clearError } = useAuth();
  const searchParams = useSearchParams();
  
  const urlMessage = searchParams.get('message');
  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (urlMessage) {
      setDisplayError(decodeURIComponent(urlMessage));
    } else if (error) {
      setDisplayError(error);
    }
  }, [urlMessage, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setDisplayError(null);
    setLoading(true);
    try { await login(email, password); } catch (err) { }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setDisplayError(null);
    try { await loginWithGoogle(); } catch (err) { }
  };

  const handleGuestLogin = async () => {
    clearError();
    setDisplayError(null);
    setLoading(true);
    try {
      if (loginAnonymously) await loginAnonymously();
    } catch (err) {
      setDisplayError("Зочноор нэвтрэхэд алдаа гарлаа.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] bg-blue-50/60 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] bg-indigo-50/60 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[380px] w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Sunrise size={20} />
            </div>
            <span className="text-2xl font-black text-gray-900 italic tracking-tighter">Mindful</span>
          </Link>
          <h1 className="text-xl font-black text-gray-900 italic mb-1">Тавтай морил</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em]">Өөрийгөө таних аялал</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-7 md:p-9">
          
          {/* Error Message - Small font */}
          <AnimatePresence>
            {displayError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 relative">
                  <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={14} />
                  <p className="text-rose-700 text-[11px] font-medium leading-tight pr-4">{displayError}</p>
                  <button onClick={() => setDisplayError(null)} className="absolute top-2.5 right-2.5 text-rose-300 hover:text-rose-500">
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-[13px] placeholder:text-gray-300"
                placeholder="И-мэйл хаяг"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-[13px] placeholder:text-gray-300"
                placeholder="Нууц үг"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-gray-200"
            >
              {loading ? 'Уншиж байна...' : <>Нэвтрэх <ArrowRight size={14} /></>}
            </button>
          </form>

          {/* Divider - Tiny font */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300">
              <span className="bg-white px-3">эсвэл</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 bg-white border border-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              onClick={handleGuestLogin}
              type="button"
              className="w-full py-3 bg-blue-50/50 text-blue-600 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <UserCircle2 size={14} />
              Зочноор орох
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center px-6">
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            <Link href="/terms" className="text-gray-800 hover:underline underline-offset-4">Нөхцөл</Link> ба <Link href="/privacy" className="text-gray-800 hover:underline underline-offset-4">Нууцлал</Link> зөвшөөрч байна.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}