import { QuickActionButton } from '@/components/thought/components/QuickActionButton'
import type { ActionConfig } from '@/data/constants'

interface Props {
  actions: ActionConfig[]
  onSelect?: (type: any) => void
  disabled?: boolean
}

export function ActionGrid({ actions, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <QuickActionButton
          key={action.type}
          action={action}
          onSelect={onSelect ?? (() => {})} // 🛡 хамгаалалт
          disabled={disabled}
          variant="compact"
        />
      ))}
    </div>
  )
}


