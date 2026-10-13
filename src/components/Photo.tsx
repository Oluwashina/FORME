import { useEffect, useRef, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../lib/cn'
import { photoSrcSet, photoUrl } from '../lib/photo'

interface PhotoProps {
  id: string
  alt: string
  /** CSS object-position, e.g. "center 20%" */
  focus?: string
  sizes?: string
  widths?: number[]
  priority?: boolean
  className?: string
  imgClassName?: string
  /** a tint shown while loading */
  tint?: string
  zoomOnHover?: boolean
}

/**
 * Photograph with loading placeholder, fade-in and a graceful fallback if the image fails.
 * Fills its parent: give the parent a size (aspect-ratio or fixed height).
 */
export function Photo({
  id,
  alt,
  focus = 'center 25%',
  sizes = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw',
  widths,
  priority,
  className,
  imgClassName,
  tint = '#d9d3c7',
  zoomOnHover,
}: PhotoProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const ref = useRef<HTMLImageElement>(null)

  // Reset when the photo changes
  useEffect(() => {
    setState('loading')
    setAttempt(0)
  }, [id])

  // Handle images that finished loading before hydration (cache hits)
  useEffect(() => {
    const el = ref.current
    if (el?.complete && el.naturalWidth > 0) setState('loaded')
  }, [id, attempt])

  const onError = () => {
    if (attempt < 1) {
      // one retry with a cache-busting param before giving up
      window.setTimeout(() => setAttempt((a) => a + 1), 700)
    } else setState('error')
  }

  const src = photoUrl(id, 900) + (attempt ? `&r=${attempt}` : '')

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} style={{ backgroundColor: tint }}>
      {state !== 'loaded' && state !== 'error' && (
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5" aria-hidden />
      )}
      {state === 'error' ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-stone to-[#c4bcaa] text-charcoal/55"
        >
          <span className="font-serif text-3xl tracking-tight text-charcoal/70">
            FORME<span className="text-olive">.</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]">
            <ImageOff size={13} /> Image unavailable
          </span>
        </div>
      ) : (
        <img
          key={attempt}
          ref={ref}
          src={src}
          srcSet={attempt ? undefined : photoSrcSet(id, widths)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          onLoad={() => setState('loaded')}
          onError={onError}
          style={{ objectPosition: focus }}
          className={cn(
            'h-full w-full object-cover transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-editorial)]',
            state === 'loaded' ? 'opacity-100' : 'opacity-0',
            zoomOnHover && 'group-hover:scale-[1.045]',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
