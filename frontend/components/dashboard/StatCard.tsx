// components/ui/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
}

export default function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-all hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colorClass || 'bg-gray-500'} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
