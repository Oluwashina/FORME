import { useState } from 'react'
import { Check } from 'lucide-react'
import { onColor } from '../data/colors'
import { cn } from '../lib/cn'

interface DotProps {
  hex: string
  size?: number
  className?: string
}

export function ColorDot({ hex, size = 14, className }: DotProps) {
  return (
    <span
      className={cn('inline-block shrink-0 rounded-full ring-1 ring-inset ring-black/15', className)}
      style={{ width: size, height: size, backgroundColor: hex }}
    />
  )
}

interface SelectableProps {
  name: string
  hex: string
  selected: boolean
  onSelect: () => void
  size?: number
}

/** A clickable colour chip used to pick a base colour. */
export function SelectableSwatch({ name, hex, selected, onSelect, size = 52 }: SelectableProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={name}
      title={name}
      className="group flex flex-col items-center gap-2"
    >
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full ring-1 ring-inset ring-black/15 transition-all duration-500 ease-[var(--ease-editorial)]',
          selected ? 'scale-100 outline-2 outline-offset-4 outline-charcoal' : 'group-hover:scale-105',
        )}
        style={{ width: size, height: size, backgroundColor: hex, outlineStyle: selected ? 'solid' : 'none' }}
      >
        {selected && <Check size={size * 0.34} style={{ color: onColor(hex) }} strokeWidth={2.2} />}
      </span>
      <span className={cn('text-[11px] tracking-wide transition-colors', selected ? 'text-charcoal' : 'text-ink/60')}>{name}</span>
    </button>
  )
}

interface CardProps {
  name: string
  hex: string
  role?: string
  className?: string
  tall?: boolean
}

/** A palette swatch with name, role and copy-to-clipboard HEX. */
export function PaletteSwatchCard({ name, hex, role, className, tall }: CardProps) {
  const [copied, setCopied] = useState(false)
  const fg = onColor(hex)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-[10px] p-4 text-left ring-1 ring-inset ring-black/10 transition-transform duration-500 ease-[var(--ease-editorial)] hover:-translate-y-0.5',
        tall ? 'min-h-48' : 'min-h-32',
        className,
      )}
      style={{ backgroundColor: hex, color: fg }}
      aria-label={`${name} ${hex}. Click to copy HEX.`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-70">{role ?? 'Colour'}</span>
      <span>
        <span className="block font-serif text-2xl leading-tight">{name}</span>
        <span className="mt-1 flex items-center gap-1.5 font-mono text-[11px] tracking-wider opacity-75">
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            hex
          )}
        </span>
      </span>
    </button>
  )
}
