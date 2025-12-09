'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { theme, primaryColor, toggleTheme, setPrimaryColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const presetColors = [
    { name: 'Indigo', color: '#6366f1' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Green', color: '#10b981' },
    { name: 'Orange', color: '#f97316' },
  ];

  return (
    <div className="min-h-screen bg-theme-gradient transition-colors duration-300">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧘</span>
          <span className="text-2xl font-bold text-theme-primary">Mindful</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg card-theme hover:opacity-80 transition-all"
            title={theme === 'light' ? 'Dark mode руу шилжих' : 'Light mode руу шилжих'}
          >
            <span className="text-2xl">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>

          {/* Color Picker Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg card-theme hover:opacity-80 transition-all"
              title="Өнгө солих"
            >
              <span className="text-2xl">🎨</span>
            </button>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 p-4 card-theme rounded-xl border border-theme z-50 w-64">
                <p className="text-sm font-medium text-theme-primary mb-3">Өнгө сонгох</p>
                
                {/* Preset Colors */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setPrimaryColor(preset.color)}
                      className="h-10 rounded-lg transition-transform hover:scale-110 border-2"
                      style={{ 
                        backgroundColor: preset.color,
                        borderColor: primaryColor === preset.color ? '#fff' : 'transparent'
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="space-y-2">
                  <label className="text-xs text-theme-secondary">Өөрийн өнгө</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 text-theme-secondary hover:text-theme-primary font-medium transition-colors"
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-2 btn-primary rounded-lg font-medium shadow-lg"
          >
            Бүртгүүлэх
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-theme-primary mb-6">
            Өөрийгөө танин мэдэх
            <br />
            <span className="text-primary-color">Хөгжлийн аялал</span>
          </h1>
          <p className="text-xl text-theme-secondary mb-8">
            Өдрийн тэмдэглэл, сэтгэл санааны хяналт, зорилго удирдлага болон AI шинжилгээг
            нэгтгэсэн хувийн хөгжлийн цогц систем
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="px-8 py-4 btn-primary text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Эхлүүлэх
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-theme-primary mb-12">
          Онцлог боломжууд
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { emoji: '📔', title: 'Өдрийн тэмдэглэл', desc: 'Бодол санааг тэмдэглэж, AI шинжилгээгээр үнэт зүйлсээ илрүүл' },
            { emoji: '🎯', title: 'Зорилго удирдлага', desc: 'Богино болон урт хугацааны зорилгоо тодорхойлж, биелэлтийг хяна' },
            { emoji: '🧘‍♀️', title: 'Бясалгал', desc: 'Meditation болон mindfulness дадлага хийж, сэтгэлийн амар тайванд хүрэх' },
            { emoji: '😊', title: 'Сэтгэл санааны хяналт', desc: 'Өдөр тутмын сэтгэл хөдлөлөө тэмдэглэж, хэв маягийг ойлгох' },
            { emoji: '🤖', title: 'AI шинжилгээ', desc: 'Автомат сэтгэл хөдлөл таних болон хувийн зөвлөмж авах' },
            { emoji: '🎮', title: 'Gamification', desc: 'Оноо, түвшин, badge цуглуулж урам зоригоо дэмж' },
          ].map((feature, index) => (
            <div key={index} className="card-theme rounded-xl p-6 transition-transform hover:scale-105">
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold text-theme-primary mb-2">{feature.title}</h3>
              <p className="text-theme-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div 
          className="rounded-2xl p-12 text-center text-white max-w-4xl mx-auto shadow-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${adjustColorBrightness(primaryColor, -20)})` 
          }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Хувийн хөгжлийн аяллаа эхлүүлэхэд бэлэн үү?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Өнөөдөр бүртгүүлж, өөрийгөө илүү сайн танин мэдээрэй
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ color: primaryColor }}
          >
            Үнэгүй эхлэх
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-theme-secondary">
        <p>© 2025 Mindful. Бүх эрх хуулиар хамгаалагдсан.</p>
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