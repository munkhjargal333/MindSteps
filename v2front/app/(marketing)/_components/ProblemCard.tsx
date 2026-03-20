import type { LucideIcon } from 'lucide-react'

interface ProblemCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ProblemCard({ icon: Icon, title, description }: ProblemCardProps) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm md:text-base">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
