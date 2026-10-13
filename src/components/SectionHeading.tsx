import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface Props {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, action, className, align = 'left' }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="display text-balance text-[2.5rem] sm:text-5xl lg:text-[3.6rem]">{title}</h2>
        {description && <p className="mt-5 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ink/75">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
