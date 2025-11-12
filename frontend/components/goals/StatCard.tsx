import { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  color,
  icon
}: {
  label: string;
  value: number;
  color: string;
  icon?: ReactNode; // new optional prop
}) {
  const colors = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-xl p-4 border flex items-center gap-3`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}
