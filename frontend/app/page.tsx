'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🧘</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mindful</h1>
          <p className="text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧘</span>
          <span className="text-2xl font-bold text-gray-900">Mindful</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Бүртгүүлэх
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Өөрийгөө танин мэдэх
            <br />
            <span className="text-indigo-600">Хөгжлийн аялал</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Өдрийн тэмдэглэл, сэтгэл санааны хяналт, зорилго удирдлага болон AI шинжилгээг
            нэгтгэсэн хувийн хөгжлийн цогц систем
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Эхлүүлэх
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Онцлог боломжууд
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">📔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Өдрийн тэмдэглэл</h3>
            <p className="text-gray-600">
              Бодол санааг тэмдэглэж, AI шинжилгээгээр үнэт зүйлсээ илрүүл
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Зорилго удирдлага</h3>
            <p className="text-gray-600">
              Богино болон урт хугацааны зорилгоо тодорхойлж, биелэлтийг хяна
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Бясалгал</h3>
            <p className="text-gray-600">
              Meditation болон mindfulness дадлага хийж, сэтгэлийн амар тайванд хүрэх
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Сэтгэл санааны хяналт</h3>
            <p className="text-gray-600">
              Өдөр тутмын сэтгэл хөдлөлөө тэмдэглэж, хэв маягийг ойлгох
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI шинжилгээ</h3>
            <p className="text-gray-600">
              Автомат сэтгэл хөдлөл таних болон хувийн зөвлөмж авах
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gamification</h3>
            <p className="text-gray-600">
              Оноо, түвшин, badge цуглуулж урам зоригоо дэмж
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Хувийн хөгжлийн аяллаа эхлүүлэхэд бэлэн үү?
          </h2>
          <p className="text-lg mb-8 text-indigo-100">
            Өнөөдөр бүртгүүлж, өөрийгөө илүү сайн танин мэдээрэй
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-indigo-600 text-lg rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-lg"
          >
            Үнэгүй эхлэх
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2025 Mindful. Бүх эрх хуулиар хамгаалагдсан.</p>
      </footer>
    </div>
  );
}