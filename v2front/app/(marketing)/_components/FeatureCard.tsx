import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="
        p-5 md:p-6
        border rounded-xl
        bg-background
        transition-all duration-200
        hover:border-primary/40
      "
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm md:text-base">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}