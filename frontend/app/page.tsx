'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { theme, primaryColor, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-theme-gradient transition-colors duration-300">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧘</span>
            <span className="text-xl md:text-2xl font-bold text-theme-primary">Mindful</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg card-theme hover:opacity-80 transition-all"
              title={theme === 'light' ? 'Dark mode руу шилжих' : 'Light mode руу шилжих'}
            >
              <span className="text-xl md:text-2xl">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>

            <button
              onClick={() => router.push('/login')}
              className="px-3 md:px-6 py-2 text-sm md:text-base text-theme-secondary hover:text-theme-primary font-medium transition-colors"
            >
              Нэвтрэх
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-3 md:px-6 py-2 text-sm md:text-base btn-primary rounded-lg font-medium shadow-lg"
            >
              Бүртгүүлэх
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-theme-primary mb-4 md:mb-6">
            Өөрийгөө танин мэдэх
            <br />
            <span className="text-primary-color">Хөгжлийн аялал</span>
          </h1>
          <p className="text-base md:text-xl text-theme-secondary mb-6 md:mb-8 px-4">
            Өдрийн тэмдэглэл, сэтгэл санааны хяналт, зорилго удирдлага болон AI шинжилгээг
            нэгтгэсэн хувийн хөгжлийн цогц систем
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="px-6 md:px-8 py-3 md:py-4 btn-primary text-base md:text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Эхлүүлэх
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-theme-primary mb-8 md:mb-12">
          Онцлог боломжууд
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { emoji: '📔', title: 'Өдрийн тэмдэглэл', desc: 'Бодол санааг тэмдэглэж, AI шинжилгээгээр үнэт зүйлсээ илрүүл' },
            { emoji: '🎯', title: 'Зорилго удирдлага', desc: 'Богино болон урт хугацааны зорилгоо тодорхойлж, биелэлтийг хяна' },
            { emoji: '🧘‍♀️', title: 'Бясалгал', desc: 'Meditation болон mindfulness дадлага хийж, сэтгэлийн амар тайванд хүрэх' },
            { emoji: '😊', title: 'Сэтгэл санааны хяналт', desc: 'Өдөр тутмын сэтгэл хөдлөлөө тэмдэглэж, хэв маягийг ойлгох' },
            { emoji: '🤖', title: 'AI шинжилгээ', desc: 'Автомат сэтгэл хөдлөл таних болон хувийн зөвлөмж авах' },
            { emoji: '🎮', title: 'Gamification', desc: 'Оноо, түвшин, badge цуглуулж урам зоригоо дэмж' },
          ].map((feature, index) => (
            <div key={index} className="card-theme rounded-xl p-6 transition-transform hover:scale-105">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">{feature.emoji}</div>
              <h3 className="text-lg md:text-xl font-bold text-theme-primary mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-theme-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div 
          className="rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${adjustColorBrightness(primaryColor, -20)})` 
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Хувийн хөгжлийн аяллаа эхлүүлэхэд бэлэн үү?
          </h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
            Өнөөдөр бүртгүүлж, өөрийгөө илүү сайн танин мэдээрэй
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-base md:text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ color: primaryColor }}
          >
            Үнэгүй эхлэх
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-theme-secondary">
        <p className="text-sm md:text-base">© 2025 Mindful. Бүх эрх хуулиар хамгаалагдсан.</p>
      </footer>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}