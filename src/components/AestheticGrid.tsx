import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { AESTHETICS } from '../data/aesthetics'
import { getOutfit } from '../data/outfits'
import { cn } from '../lib/cn'
import { Photo } from './Photo'
import { Reveal } from './Reveal'

export function AestheticGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-10">
      {AESTHETICS.map((a, i) => {
        const outfit = getOutfit(a.outfitId)
        return (
          <Reveal key={a.id} delay={(i % 3) * 90} className={cn(i % 3 === 1 && 'lg:translate-y-14')}>
            <Link
              to={`/discover?aesthetic=${a.id}`}
              className="group relative block overflow-hidden rounded-[10px] bg-stone"
              aria-label={`Explore ${a.name} looks`}
            >
              <div className="aspect-[4/5]">
                <Photo
                  id={outfit.image.id}
                  alt={`${a.name} — ${outfit.title}`}
                  focus={outfit.image.focus}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  zoomOnHover
                  imgClassName="duration-[1400ms]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent transition-opacity duration-500 group-hover:from-charcoal/85" />
              <span className="absolute left-4 top-4 text-[10px] font-medium tracking-[0.2em] text-ivory/85 sm:left-5 sm:top-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="absolute right-3.5 top-3.5 flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-ivory text-charcoal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:right-4 sm:top-4">
                <ArrowUpRight size={16} />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-ivory sm:p-6">
                <h3 className="font-serif text-[1.6rem] leading-[1.02] tracking-[-0.01em] sm:text-4xl">{a.name}</h3>
                <p className="mt-0 max-h-0 overflow-hidden text-[0.8rem] leading-snug text-ivory/80 opacity-0 transition-all duration-500 ease-[var(--ease-editorial)] group-hover:mt-2 group-hover:max-h-12 group-hover:opacity-100 sm:text-sm max-md:hidden">
                  {a.tagline}
                </p>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
