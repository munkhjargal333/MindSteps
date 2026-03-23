import { Heart, X } from 'lucide-react'

interface WhoItemProps {
  text: string
  variant: 'for' | 'not'
}

export function WhoItem({ text, variant }: WhoItemProps) {
  const isFor = variant === 'for'

  return (
    <div className="flex items-start gap-3">
      {isFor ? (
        <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}