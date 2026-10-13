import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { ColorDot, PaletteSwatchCard } from '../components/ColorSwatch'
import { FormalityMeter } from '../components/FormalityMeter'
import { GarmentIcon } from '../components/GarmentIcon'
import { OutfitCard } from '../components/OutfitCard'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { SaveButton } from '../components/SaveButton'
import { AESTHETIC_BY_ID, OCCASION_BY_ID } from '../data/aesthetics'
import { OUTFITS, OUTFIT_BY_ID } from '../data/outfits'
import { cn } from '../lib/cn'
import { relatedOutfits } from '../lib/search'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import type { Slot } from '../types'
import { NotFoundPage } from './NotFoundPage'

const SLOT_LABEL: Record<Slot, string> = { top: 'Top', layer: 'Layer', bottom: 'Trousers', shoes: 'Shoes', accessory: 'Accessory' }

type Tier = 'invest' | 'mid' | 'budget'
const TIERS: { id: Tier; label: string }[] = [
  { id: 'invest', label: 'Invest' },
  { id: 'mid', label: 'Mid-range' },
  { id: 'budget', label: 'Budget' },
]

/** Generic, brand-free guidance per slot and budget tier. */
const TIER_ADVICE: Record<Slot, Record<Tier, string>> = {
  top: {
    invest: 'Choose natural fibres with a dense, even finish: merino, long-staple cotton or fine linen.',
    mid: 'Look for good cotton or a cotton-wool blend. Check the collar and cuffs hold their shape.',
    budget: 'Plain, well-cut basics in cotton are enough. Fit across the shoulder matters more than the label.',
  },
  layer: {
    invest: 'A layer you’ll wear for years: pure wool or heavy cotton, half-canvassed or properly lined.',
    mid: 'Wool blends hold structure well. Make sure the shoulders sit flat and sleeves end at the wrist.',
    budget: 'Second-hand and thrifted outerwear is often better made. Tailor the sleeves if needed.',
  },
  bottom: {
    invest: 'Pay for fabric and finishing: wool, heavy twill, a proper waistband. Then have the hem done.',
    mid: 'A cotton twill or wool blend with a clean taper works. Hem them to rest just on the shoe.',
    budget: 'A plain cotton pair in the right colour and rise. A tailor’s hem makes it look twice the price.',
  },
  shoes: {
    invest: 'Goodyear-welted leather you can resole. They improve with age and polish.',
    mid: 'Smooth leather uppers with a stitched sole. Keep them clean and use shoe trees.',
    budget: 'Simple leather-look or suede-look styles in the right colour. Clean, polished shoes beat expensive scuffed ones.',
  },
  accessory: {
    invest: 'One good leather piece in a matching tone, bought once and kept.',
    mid: 'Simple, unbranded and matched to your shoes. Avoid logos and busy buckles.',
    budget: 'Minimal designs in plain leather or steel. Match metal and leather tones across the outfit.',
  },
}

const WHY: { key: 'silhouette' | 'proportions' | 'colorBalance' | 'formality' | 'accessories'; label: string }[] = [
  { key: 'silhouette', label: 'Silhouette' },
  { key: 'proportions', label: 'Proportions' },
  { key: 'colorBalance', label: 'Colour balance' },
  { key: 'formality', label: 'Formality' },
  { key: 'accessories', label: 'Accessories' },
]

export function OutfitPage() {
  const { id } = useParams()
  const outfit = id ? OUTFIT_BY_ID[id] : undefined
  useDocumentTitle(outfit ? `${outfit.title} — FORME.` : 'Look — FORME.')

  const [tier, setTier] = useState<Tier>('mid')
  const [owned, setOwned] = useState<Set<string>>(new Set())

  useEffect(() => setOwned(new Set()), [id])

  const related = useMemo(() => (outfit ? relatedOutfits(outfit, 3) : []), [outfit])

  if (!outfit) return <NotFoundPage title="We couldn’t find that look." />

  const aesthetic = AESTHETIC_BY_ID[outfit.aesthetic]
  const occasion = OCCASION_BY_ID[outfit.occasion]
  const index = OUTFITS.findIndex((o) => o.id === outfit.id)
  const prev = OUTFITS[(index - 1 + OUTFITS.length) % OUTFITS.length]
  const next = OUTFITS[(index + 1) % OUTFITS.length]

  const toggleOwned = (key: string) =>
    setOwned((s) => {
      const n = new Set(s)
      if (n.has(key)) n.delete(key)
      else n.add(key)
      return n
    })

  const sharedWith = (o: typeof outfit) => {
    const mine = new Set(outfit.items.map((i) => i.key))
    const shared = o.items.find((i) => mine.has(i.key))
    if (shared) return `Shares the ${shared.name.toLowerCase()}`
    if (o.aesthetic === outfit.aesthetic) return `Another ${aesthetic.name.toLowerCase()} take`
    return 'Similar palette'
  }

  return (
    <article className="pb-28">
      <div className="container-x pt-8 md:pt-10">
        <Link to="/discover" className="link-underline inline-flex items-center gap-2 text-sm text-ink/70">
          <ArrowLeft size={15} /> Back to looks
        </Link>
      </div>

      {/* header */}
      <section className="container-x mt-6 grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[12px] bg-stone" style={{ aspectRatio: String(Math.min(outfit.image.ratio, 0.95)) }}>
            <Photo id={outfit.image.id} alt={outfit.image.alt} focus={outfit.image.focus} priority widths={[600, 900, 1200, 1800]} sizes="(min-width:1024px) 58vw, 100vw" />
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow !text-olive">
              Look {String(outfit.number).padStart(3, '0')} · {aesthetic.name}
            </p>
            <h1 className="display mt-4 text-balance text-[2.8rem] sm:text-6xl">{outfit.title}</h1>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink/75">{outfit.summary}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link to={`/discover?aesthetic=${outfit.aesthetic}`} className="tag hover:bg-charcoal hover:text-ivory">
                {aesthetic.name}
              </Link>
              <Link to={`/occasions?o=${outfit.occasion}`} className="tag hover:bg-charcoal hover:text-ivory">
                {occasion.name}
              </Link>
              {outfit.moods.slice(0, 2).map((m) => (
                <span key={m} className="tag">
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-6 border-y border-charcoal/10 py-5">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-ink/55">Formality</p>
                <FormalityMeter level={outfit.formality} />
              </div>
              <div className="ml-auto">
                <SaveButton outfitId={outfit.id} variant="inline" />
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              {outfit.palette.map((p) => (
                <ColorDot key={p.hex} hex={p.hex} size={28} />
              ))}
              <span className="ml-2 self-center text-sm text-ink/60">{outfit.paletteRelation}</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink/70">{outfit.logic}</p>
          </div>
        </div>
      </section>

      {/* items */}
      <section className="container-x mt-28">
        <p className="eyebrow mb-3">The pieces</p>
        <h2 className="display text-4xl sm:text-5xl">What’s in the look</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outfit.items.map((it, i) => (
            <Reveal key={it.key} delay={(i % 3) * 70}>
              <div className="flex h-full flex-col rounded-[10px] bg-paper p-6 ring-1 ring-charcoal/10">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink/55">{SLOT_LABEL[it.slot]}</span>
                  <span className="font-mono text-[11px] text-ink/45">{it.color.hex}</span>
                </div>
                <div className="my-5 flex h-36 items-center justify-center rounded-lg bg-ivory-deep/60">
                  <GarmentIcon kind={it.icon} color={it.color.hex} size={104} title={it.name} />
                </div>
                <h3 className="font-serif text-[1.65rem] leading-tight">{it.name}</h3>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-14 shrink-0 text-ink/50">Colour</dt>
                    <dd className="flex items-center gap-2">
                      <ColorDot hex={it.color.hex} size={11} /> {it.color.name}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-14 shrink-0 text-ink/50">Fabric</dt>
                    <dd>{it.fabric}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-14 shrink-0 text-ink/50">Fit</dt>
                    <dd>{it.fit}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-charcoal/10 pt-4 text-sm leading-relaxed text-ink/75">{it.outfitNote || it.note}</p>
                {it.alternatives.length > 0 && (
                  <div className="mt-auto pt-5">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-ink/50">Or try</p>
                    <div className="flex flex-wrap gap-1.5">
                      {it.alternatives.map((a) => (
                        <span key={a} className="rounded-full border border-charcoal/15 px-2.5 py-1 text-xs text-ink/75">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* palette */}
      <section className="mt-28 bg-paper py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">The palette</p>
            <h2 className="display text-4xl sm:text-5xl">{outfit.palette.length} colours, one idea</h2>
            <p className="mt-6 font-serif text-2xl italic text-olive">{outfit.paletteRelation}</p>
            <p className="mt-6 leading-relaxed text-ink/75">{outfit.paletteNote}</p>
            <p className="mt-6 text-sm text-ink/55">Tap a swatch to copy its HEX.</p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {outfit.palette.map((p) => (
                <PaletteSwatchCard key={p.hex} name={p.name} hex={p.hex} role={p.role} tall />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* why it works */}
      <section className="container-x mt-28">
        <p className="eyebrow mb-3">Why it works</p>
        <h2 className="display max-w-2xl text-balance text-4xl sm:text-5xl">Five reasons this look is right</h2>
        <ol className="mt-12 grid gap-x-14 gap-y-0 lg:grid-cols-2">
          {WHY.map((w, i) => (
            <li key={w.key} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-charcoal/15 py-7">
              <span className="font-serif text-3xl italic text-olive">{i + 1}</span>
              <div>
                <h3 className="font-serif text-2xl">{w.label}</h3>
                <p className="mt-2 leading-relaxed text-ink/75">{outfit.why[w.key]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* recreate */}
      <section className="container-x mt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">Recreate this look</p>
            <h2 className="display text-4xl sm:text-5xl">Your checklist</h2>
            <p className="mt-6 leading-relaxed text-ink/75">Tick what you already own. Then choose a budget to see how to approach the rest.</p>
            <div className="mt-8 flex gap-1 rounded-full bg-ivory-deep p-1" role="tablist" aria-label="Budget">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tier === t.id}
                  onClick={() => setTier(t.id)}
                  className={cn('flex-1 rounded-full px-3 py-2 text-sm transition-all duration-300', tier === t.id ? 'bg-charcoal text-ivory' : 'text-ink/70 hover:text-charcoal')}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span>{owned.size === outfit.items.length ? 'You have everything.' : `${owned.size} of ${outfit.items.length} owned`}</span>
              </div>
              <div className="h-[3px] overflow-hidden rounded-full bg-charcoal/10">
                <div className="h-full rounded-full bg-olive transition-[width] duration-700" style={{ width: `${(owned.size / outfit.items.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
              {outfit.items.map((it) => {
                const has = owned.has(it.key)
                return (
                  <li key={it.key} className="py-5">
                    <label className="flex cursor-pointer items-start gap-4">
                      <input type="checkbox" className="peer sr-only" checked={has} onChange={() => toggleOwned(it.key)} />
                      <span className={cn('mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal', has ? 'border-olive bg-olive text-ivory' : 'border-charcoal/30')}>
                        {has && <Check size={13} strokeWidth={2.6} />}
                      </span>
                      <span className="flex-1">
                        <span className={cn('flex items-center gap-3 font-serif text-xl transition-colors', has && 'text-ink/45 line-through decoration-1')}>
                          <ColorDot hex={it.color.hex} size={12} /> {it.name}
                        </span>
                        {!has && <span className="mt-1.5 block text-sm leading-relaxed text-ink/70">{TIER_ADVICE[it.slot][tier]}</span>}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-ink/50">
              Sample content: pieces are illustrative descriptions only. FORME. doesn’t show real brands, prices or shopping links.
            </p>
          </div>
        </div>
      </section>

      {/* variations */}
      {related.length > 0 && (
        <section className="container-x mt-28">
          <p className="eyebrow mb-3">Style variations</p>
          <h2 className="display text-4xl sm:text-5xl">Three ways to take it further</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((o) => (
              <div key={o.id}>
                <OutfitCard outfit={o} ratio={4 / 5} compact sizes="(min-width:1024px) 30vw, 100vw" />
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-olive">{sharedWith(o)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* prev / next */}
      <nav className="container-x mt-28 grid gap-px overflow-hidden rounded-[10px] bg-charcoal/15 sm:grid-cols-2" aria-label="More looks">
        <Link to={`/look/${prev.id}`} className="group flex items-center gap-4 bg-ivory p-7 transition-colors hover:bg-paper">
          <ArrowLeft size={20} strokeWidth={1.4} className="transition-transform duration-500 group-hover:-translate-x-1" />
          <span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-ink/55">Previous look</span>
            <span className="font-serif text-2xl">{prev.title}</span>
          </span>
        </Link>
        <Link to={`/look/${next.id}`} className="group flex items-center justify-end gap-4 bg-ivory p-7 text-right transition-colors hover:bg-paper">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-ink/55">Next look</span>
            <span className="font-serif text-2xl">{next.title}</span>
          </span>
          <ArrowRight size={20} strokeWidth={1.4} className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </nav>
    </article>
  )
}
