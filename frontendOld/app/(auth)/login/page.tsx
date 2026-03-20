'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, Sunrise, AlertCircle, X, 
  UserCircle2, Eye, EyeOff, Shield, CheckCircle2, 
  Sparkles, Info
} from 'lucide-react';

// Separate component for search params
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
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
    try {
      await login(email, password);
    } catch (err) { /* Error context-оор дамжина */ }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-12 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-300/50 group-hover:shadow-blue-400/60 transition-all"
            >
              <Sunrise size={28} strokeWidth={2.5} />
            </motion.div>
            <span className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Mindful
            </span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Тавтай морил
            </h1>
            <p className="text-gray-500 font-medium text-sm flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              Өөрийгөө таних аялал эхэллээ
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)] p-8 md:p-10 relative overflow-hidden"
        >
          
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          {/* Error Alert */}
          <AnimatePresence>
            {displayError && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-rose-50/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl relative">
                  <button 
                    onClick={() => setDisplayError(null)} 
                    className="absolute top-3 right-3 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg p-1 transition-all"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-start gap-3 pr-6">
                    <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={20} />
                    <div>
                      <p className="text-rose-700 text-sm font-semibold mb-1">Алдаа гарлаа</p>
                      <p className="text-rose-600 text-xs leading-relaxed">{displayError}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                И-мэйл хаяг
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder:text-gray-400"
                  placeholder="example@mail.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                Нууц үг
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:shadow-2xl hover:shadow-blue-300/50 active:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Уншиж байна...
                  </>
                ) : (
                  <>
                    Нэвтрэх <ArrowRight size={18} />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-black uppercase tracking-widest text-gray-400">
                Бусад сонголт
              </span>
            </div>
          </div>

          {/* Alternative Login Options */}
          <div className="space-y-3">
            
            {/* Google Login - Detailed */}
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-4 bg-white border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 text-gray-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:text-blue-700 transition-colors">Google-ээр нэвтрэх</span>
              </button>
            </motion.div>

            {/* Guest Login - Detailed */}
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <button
                onClick={handleGuestLogin}
                type="button"
                className="w-full py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 hover:border-indigo-200 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-3 group"
              >
                <UserCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                <span>Зочноор үргэлжлүүлэх</span>
              </button>
              <div className="mt-2 ml-1 flex items-start gap-2 text-xs text-gray-500">
                <Info size={14} className="mt-0.5 text-indigo-500 shrink-0" />
                <span>И-мэйл шаардлагагүй, туршилтын горим</span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Privacy & Terms - Enhanced */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
                    {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Манайхыг дэмжиж хамтран ажиллах болон анхны хэрэглэгч болох уу?{' '}
              <Link 
                href="/join" 
                className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-500 transition-all"
              >
                Дэлгэрэнгүй →
              </Link>
            </p>
          </div>
          
          {/* Privacy Toggle Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-4">
            <button
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Shield className="text-blue-600 shrink-0" size={18} />
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  Таны нууцлал хамгаалагдсан
                </span>
              </div>
              <motion.div
                animate={{ rotate: showPrivacyInfo ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="text-gray-400 -rotate-90" size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {showPrivacyInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-green-500 shrink-0" />
                      <p><span className="font-semibold">Таны мэдээлэл шифрлэгдсэн</span> - End-to-end encryption ашиглан хамгаалагдана</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-green-500 shrink-0" />
                      <p><span className="font-semibold">Мэдээлэл зарагдахгүй</span> - Бид таны мэдээллийг гуравдагч этгээдэд огт дамжуулахгүй</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-green-500 shrink-0" />
                      <p><span className="font-semibold">Хэдийд ч устгах боломжтой</span> - Та өөрийн бүх мэдээллийг хүссэн үедээ устгах эрхтэй</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terms Footer */}
          <p className="text-xs text-center text-gray-500 leading-relaxed px-4">
            Нэвтрэх товчийг дарснаар та манай{' '}
            <Link href="/terms" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-500 transition-all">
              Үйлчилгээний нөхцөл
            </Link>
            {' '}болон{' '}
            <Link href="/privacy" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-500 transition-all">
              Нууцлалын бодлого
            </Link>
            -тай танилцаж, зөвшөөрч байна.
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Ачаалж байна...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}