import type { LucideIcon } from 'lucide-react'

interface HowItWorksCardProps {
  step: string
  icon: LucideIcon
  title: string
  description: string
}

export function HowItWorksCard({ step, icon: Icon, title, description }: HowItWorksCardProps) {
  return (
    <div className="space-y-4">
      <div className="text-4xl font-light text-muted-foreground/40">{step}</div>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
