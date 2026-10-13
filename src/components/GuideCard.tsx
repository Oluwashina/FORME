import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/cn'
import type { Guide } from '../types'
import { Photo } from './Photo'

interface Props {
  guide: Guide
  variant?: 'feature' | 'standard' | 'row'
  index?: number
  className?: string
}

export function GuideCard({ guide, variant = 'standard', index, className }: Props) {
  const feature = variant === 'feature'
  const row = variant === 'row'

  return (
    <Link
      to={`/guides/${guide.id}`}
      className={cn('group flex gap-5', row ? 'flex-row items-center' : 'flex-col', feature && 'h-full', className)}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-[10px] bg-stone',
          row ? 'w-32 sm:w-44' : feature ? 'flex-1 min-h-[22rem]' : '',
        )}
        style={row ? { aspectRatio: '1' } : !feature ? { aspectRatio: '4 / 3.2' } : undefined}
      >
        <Photo
          id={guide.image.id}
          alt={guide.image.alt}
          focus={guide.image.focus}
          sizes={feature ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
          zoomOnHover
          imgClassName="duration-[1400ms]"
        />
        {index !== undefined && (
          <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-charcoal backdrop-blur">
            {guide.category}
          </span>
        )}
      </div>
      <div className={cn(feature && 'max-w-xl')}>
        {index === undefined && <p className="eyebrow !text-[10px]">{guide.category}</p>}
        <h3
          className={cn(
            'font-serif leading-[1.05] tracking-[-0.015em] transition-colors group-hover:text-olive',
            index === undefined && 'mt-2',
            feature ? 'text-[2.2rem] sm:text-5xl' : row ? 'text-2xl' : 'text-[1.65rem]',
          )}
        >
          {guide.title}
        </h3>
        {!row && <p className={cn('mt-3 text-pretty leading-relaxed text-ink/70', feature ? 'text-[1.0625rem]' : 'text-[0.9375rem]')}>{guide.dek}</p>}
        <p className="mt-4 flex items-center gap-2 text-[13px] text-ink/60">
          {guide.readTime}
          <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  )
}
