import { ChevronRight } from 'lucide-react'

interface TierCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  bgClass: string
  isSpecial?: boolean
  onClick?: () => void
}

export function TierCard({
  icon,
  title,
  description,
  badge,
  bgClass,
  onClick,
}: TierCardProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${bgClass}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold">{title}</h3>
          {badge && (
            <span className="text-[10px] bg-background/80 px-1.5 py-0.5 rounded-full border">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </div>
  )
}
