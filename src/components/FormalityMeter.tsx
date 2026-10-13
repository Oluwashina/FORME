import { FORMALITY_LABELS, type Formality } from '../types'
import { cn } from '../lib/cn'

interface Props {
  level: Formality
  compact?: boolean
  className?: string
  showLabel?: boolean
}

/** Four-step formality indicator: Casual · Smart Casual · Business · Formal */
export function FormalityMeter({ level, compact, className, showLabel = true }: Props) {
  return (
    <div className={cn('flex items-center gap-2.5', className)} title={`Formality: ${FORMALITY_LABELS[level]}`}>
      <div className="flex items-center gap-[3px]" role="img" aria-label={`Formality ${level} of 4: ${FORMALITY_LABELS[level]}`}>
        {([1, 2, 3, 4] as Formality[]).map((n) => (
          <span
            key={n}
            className={cn(
              'h-[3px] rounded-full transition-colors',
              compact ? 'w-3.5' : 'w-6',
              n <= level ? 'bg-charcoal' : 'bg-charcoal/15',
            )}
          />
        ))}
      </div>
      {showLabel && <span className={cn('text-ink/70', compact ? 'text-[11px]' : 'text-xs')}>{FORMALITY_LABELS[level]}</span>}
    </div>
  )
}
