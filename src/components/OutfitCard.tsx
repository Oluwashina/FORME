import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { AESTHETIC_BY_ID, OCCASION_BY_ID } from '../data/aesthetics'
import { cn } from '../lib/cn'
import { useSaved } from '../lib/saved'
import type { Outfit } from '../types'
import { ColorDot } from './ColorSwatch'
import { Photo } from './Photo'
import { SaveButton } from './SaveButton'

interface Props {
  outfit: Outfit
  /** override the image ratio (width / height) */
  ratio?: number
  className?: string
  priority?: boolean
  sizes?: string
  /** show the compact caption (no tags) */
  compact?: boolean
}

export function OutfitCard({ outfit, ratio, className, priority, sizes, compact }: Props) {
  const { isSaved } = useSaved()
  const saved = isSaved(outfit.id)
  const aesthetic = AESTHETIC_BY_ID[outfit.aesthetic]
  const occasion = OCCASION_BY_ID[outfit.occasion]
  const r = ratio ?? outfit.image.ratio

  return (
    <article className={cn('group relative', className)}>
      <div className="relative overflow-hidden rounded-[10px] bg-stone">
        <Link
          to={`/look/${outfit.id}`}
          aria-label={`View ${outfit.title}`}
          className="block"
          style={{ aspectRatio: String(r) }}
        >
          <Photo
            id={outfit.image.id}
            alt={outfit.image.alt}
            focus={outfit.image.focus}
            priority={priority}
            sizes={sizes}
            zoomOnHover
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute bottom-3.5 left-3.5 flex translate-y-2 items-center gap-1.5 rounded-full bg-ivory/95 py-1.5 pl-3.5 pr-2.5 text-xs font-medium text-charcoal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
            View look <ArrowUpRight size={13} />
          </span>
        </Link>
        <div
          className={cn(
            'absolute right-3 top-3 transition-opacity duration-300',
            saved ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100',
          )}
        >
          <SaveButton outfitId={outfit.id} />
        </div>
      </div>

      <div className="px-0.5 pb-1 pt-3.5">
        <p className="eyebrow !text-[10px]">{aesthetic.name}</p>
        <h3 className="mt-1.5 font-serif text-[1.45rem] leading-[1.1] tracking-[-0.01em]">
          <Link to={`/look/${outfit.id}`} className="transition-colors hover:text-olive">
            {outfit.title}
          </Link>
        </h3>
        {!compact && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="tag">{occasion.name}</span>
            <span className="flex items-center gap-1" aria-label="Palette">
              {outfit.palette.slice(0, 4).map((p) => (
                <ColorDot key={p.key} hex={p.hex} size={11} />
              ))}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
