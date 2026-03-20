import { Heart } from 'lucide-react'

export function WhoForItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function WhoNotForItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground/40 text-sm">✕</span>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
