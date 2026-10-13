import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormalityMeter } from '../components/FormalityMeter'
import { Photo } from '../components/Photo'
import { StyleGallery } from '../components/StyleGallery'
import { OCCASIONS, OCCASION_BY_ID } from '../data/aesthetics'
import { getOutfit, OUTFITS } from '../data/outfits'
import { cn } from '../lib/cn'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { FORMALITY_LABELS, type Formality, type OccasionId } from '../types'

const LEGEND: { level: Formality; note: string }[] = [
  { level: 1, note: 'Jeans, tees, trainers. Clean and considered.' },
  { level: 2, note: 'Tailored trousers or chinos, knitwear, a good shoe.' },
  { level: 3, note: 'Jacket and trousers, shirt, leather shoes.' },
  { level: 4, note: 'Suit or dinner jacket. Polished from head to toe.' },
]

export function OccasionsPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('o') as OccasionId | null
  const activeId: OccasionId = requested && OCCASION_BY_ID[requested] ? requested : 'everyday'
  const active = OCCASION_BY_ID[activeId]
  useDocumentTitle(`${active.name} — Occasions — FORME.`)

  const source = useMemo(() => OUTFITS.filter((o) => o.occasion === activeId || o.occasions.includes(activeId)), [activeId])

  const select = (id: OccasionId) => {
    setParams({ o: id }, { replace: true })
    document.getElementById('occasion-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pb-28">
      <header className="container-x pb-12 pt-12 md:pt-20">
        <p className="eyebrow mb-4">Dress for the occasion</p>
        <h1 className="display max-w-4xl text-balance text-[3rem] sm:text-6xl lg:text-7xl">
          The right look for <em className="italic text-olive">where you’re going.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          Choose the moment. We’ll show you how formal it calls for — and the looks that get it right.
        </p>
      </header>

      <div className="container-x">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {OCCASIONS.map((o) => {
            const out = getOutfit(o.outfitId)
            const isActive = o.id === activeId
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => select(o.id)}
                aria-pressed={isActive}
                className={cn(
                  'group relative aspect-[4/5] overflow-hidden rounded-[10px] bg-stone text-left outline-offset-4 transition-all duration-500',
                  isActive ? 'outline-2 outline-charcoal' : 'opacity-90 hover:opacity-100',
                )}
              >
                <Photo id={out.image.id} alt="" focus={out.image.focus} sizes="(min-width:1024px) 20vw, 50vw" zoomOnHover />
                <div className={cn('absolute inset-0 transition-colors duration-500', isActive ? 'bg-charcoal/55' : 'bg-charcoal/35 group-hover:bg-charcoal/45')} />
                <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/75">{o.dressCode}</p>
                  <p className="mt-1 font-serif text-[1.45rem] leading-tight">{o.name}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* legend */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-[10px] bg-charcoal/15 sm:grid-cols-2 lg:grid-cols-4">
          {LEGEND.map((l) => {
            const inRange = active.formality.includes(l.level)
            return (
              <div key={l.level} className={cn('bg-ivory p-6 transition-colors duration-500', inRange && 'bg-paper')}>
                <div className="flex items-center justify-between">
                  <FormalityMeter level={l.level} showLabel={false} />
                  {inRange && <span className="rounded-full bg-olive px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ivory">Suits {active.name.split(' ')[0]}</span>}
                </div>
                <p className="mt-4 font-serif text-2xl">{FORMALITY_LABELS[l.level]}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{l.note}</p>
              </div>
            )
          })}
        </div>
      </div>

      <section id="occasion-results" className="container-x mt-24 scroll-mt-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3 !text-olive">{active.dressCode}</p>
            <h2 className="display text-4xl sm:text-6xl">{active.name}</h2>
            <p className="mt-4 max-w-lg text-[1.0625rem] text-ink/75">{active.blurb}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/70">
            Dress code
            <div className="flex flex-wrap gap-3">
              {active.formality.map((f) => (
                <FormalityMeter key={f} level={f} compact />
              ))}
            </div>
          </div>
        </div>
        <StyleGallery source={source} resetKey={activeId} hideGroups={['occasion']} />
      </section>
    </div>
  )
}
