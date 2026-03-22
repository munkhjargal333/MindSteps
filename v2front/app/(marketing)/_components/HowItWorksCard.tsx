import type { LucideIcon } from 'lucide-react'

interface HowItWorksCardProps {
  step: number
  icon: LucideIcon
  title: string
  description: string
}

export function HowItWorksCard({ step, icon: Icon, title, description }: HowItWorksCardProps) {
  return (
    <div
      className="
        group
        relative
        p-5 md:p-6
        rounded-xl
        border
        bg-background
        transition-colors
        hover:border-primary/40
      "
    >
      <div className="flex gap-4 md:gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-xs font-bold tracking-widest text-primary/60">
            {String(step).padStart(2, '0')}
          </span>
          <div className="w-px flex-1 bg-border mt-1 group-hover:bg-primary/30 transition-colors" />
        </div>

        <div className="flex gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}