import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '../lib/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}

/** Fades & lifts content in as it scrolls into view. */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-in={seen}
      style={{ transitionDelay: seen ? `${delay}ms` : undefined }}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  )
}
