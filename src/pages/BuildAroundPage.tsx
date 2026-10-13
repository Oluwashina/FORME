import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FormalityMeter } from '../components/FormalityMeter'
import { GarmentIcon } from '../components/GarmentIcon'
import { Photo } from '../components/Photo'
import { BUILD_CATEGORIES, HERO_ITEMS, type BuildCategory, type Combo } from '../data/buildAround'
import { item } from '../data/items'
import { OUTFIT_BY_ID } from '../data/outfits'
import { cn } from '../lib/cn'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function Tile({ k, size = 64 }: { k: string; size?: number }) {
  const it = item(k)
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-ivory-deep/70">
        <GarmentIcon kind={it.icon} color={it.color.hex} size={size} title={it.name} />
      </div>
      <span className="text-[12px] leading-tight text-ink/75">{it.name}</span>
    </div>
  )
}

function ComboCard({ combo }: { combo: Combo }) {
  const outfit = combo.outfitId ? OUTFIT_BY_ID[combo.outfitId] : undefined
  return (
    <article className="flex flex-col overflow-hidden rounded-[10px] bg-paper ring-1 ring-charcoal/10">
      {outfit && (
        <Link to={`/look/${outfit.id}`} className="group relative block aspect-[5/4] overflow-hidden bg-stone" aria-label={`See ${outfit.title}`}>
          <Photo id={outfit.image.id} alt={outfit.image.alt} focus={outfit.image.focus} zoomOnHover sizes="(min-width:1024px) 30vw, 100vw" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[11px] font-medium opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            See the look <ArrowRight size={12} />
          </span>
        </Link>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink/55">{combo.occasion}</p>
        <h3 className="mt-1 font-serif text-2xl leading-tight">{combo.title}</h3>
        <FormalityMeter level={combo.formality} compact className="mt-3" />
        <div className="mt-5 grid grid-cols-4 gap-2">
          {combo.pieces.map((p) => (
            <Tile key={p} k={p} size={54} />
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink/70">{combo.note}</p>
      </div>
    </article>
  )
}

export function BuildAroundPage() {
  useDocumentTitle('Build Around One Item — FORME.')
  const [category, setCategory] = useState<BuildCategory>('Tops')
  const inCategory = HERO_ITEMS.filter((h) => h.category === category)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const hero = inCategory.find((h) => h.key === selected[category]) ?? inCategory[0]
  const heroItem = item(hero.key)

  return (
    <div className="pb-28">
      <header className="container-x pb-12 pt-12 md:pt-20">
        <p className="eyebrow mb-4">Build around one item</p>
        <h1 className="display max-w-4xl text-balance text-[3rem] sm:text-6xl lg:text-7xl">
          Start with what you <em className="italic text-olive">already own.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          Choose a piece and see what to wear with it — the tops, trousers and shoes that work, and complete outfits for different moments.
        </p>
      </header>

      <div className="container-x">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Item category">
          {BUILD_CATEGORIES.map((c) => {
            const count = HERO_ITEMS.filter((h) => h.category === c).length
            return (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                type="button"
                className="chip"
                data-active={category === c}
                disabled={count === 0}
                onClick={() => setCategory(c)}
              >
                {c} <span className="ml-1 opacity-50">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {inCategory.map((h) => {
            const it = item(h.key)
            const active = h.key === hero.key
            return (
              <button
                key={h.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected((s) => ({ ...s, [category]: h.key }))}
                className={cn(
                  'flex items-center gap-4 rounded-[10px] p-4 text-left ring-1 transition-all duration-500',
                  active ? 'bg-paper ring-2 ring-charcoal' : 'bg-transparent ring-charcoal/15 hover:bg-paper hover:ring-charcoal/30',
                )}
              >
                <GarmentIcon kind={it.icon} color={it.color.hex} size={48} />
                <span className="font-serif text-lg leading-tight">{it.name}</span>
              </button>
            )
          })}
        </div>

        <section key={hero.key} className="mt-16 animate-fade-up">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative flex aspect-square items-center justify-center rounded-[14px] bg-paper ring-1 ring-charcoal/10 lg:sticky lg:top-28">
                <GarmentIcon kind={heroItem.icon} color={heroItem.color.hex} size="58%" title={heroItem.name} />
                <span className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.18em] text-ink/55">Hero piece</span>
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow !text-olive">The hero piece · {heroItem.name}</p>
              <h2 className="display mt-4 text-balance text-4xl sm:text-5xl lg:text-6xl">{hero.headline}</h2>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">{hero.blurb}</p>
              <dl className="mt-8 grid gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-ink/50">Fabric</dt>
                <dd>{heroItem.fabric}</dd>
                <dt className="text-ink/50">Fit</dt>
                <dd>{heroItem.fit}</dd>
                <dt className="text-ink/50">Tip</dt>
                <dd>{heroItem.note}</dd>
              </dl>

              <h3 className="mt-14 font-serif text-3xl">What goes with it</h3>
              <div className="mt-6 space-y-8">
                {(
                  [
                    ['Tops & layers', hero.partners.tops],
                    ['Trousers', hero.partners.bottoms],
                    ['Footwear', hero.partners.footwear],
                    ['Accessories', hero.partners.accessories],
                  ] as const
                )
                  .filter(([, list]) => list.length > 0)
                  .map(([label, list]) => (
                    <div key={label}>
                      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/55">{label}</p>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {list.map((k) => (
                          <Tile key={k} k={k} size={52} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-24">
            <p className="eyebrow mb-3">Complete outfits</p>
            <h3 className="display text-3xl sm:text-5xl">{hero.combos.length} outfits, one {heroItem.name.toLowerCase()}</h3>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {hero.combos.map((c) => (
                <ComboCard key={c.title} combo={c} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
