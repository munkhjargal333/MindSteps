// components/ui/QuickActionCard.tsx
import Link from 'next/link';

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  gradient?: string;
}

export default function QuickActionCard({ href, icon, title, description, gradient }: QuickActionCardProps) {
  return (
    <Link href={href} className="block group">
      <div className={`${gradient || 'bg-gradient-to-br from-gray-400 to-gray-600'} rounded-xl p-5 sm:p-6 text-white hover:scale-105 active:scale-95 transition-transform shadow-lg`}>
        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{title}</h3>
        <p className="text-xs sm:text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
}
