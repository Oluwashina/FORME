import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ColorDot, PaletteSwatchCard, SelectableSwatch } from '../components/ColorSwatch'
import { GarmentIcon } from '../components/GarmentIcon'
import { OutfitCard } from '../components/OutfitCard'
import { COLORS, onColor } from '../data/colors'
import { cn } from '../lib/cn'
import { BASE_COLORS, buildLab, CURATED_COMBOS, MODES, SEASONS, type CuratedCombo, type PaletteMode, type Season } from '../lib/palette'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const currentSeason = (): Season => {
  const m = new Date().getMonth()
  return m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'autumn' : 'winter'
}

export function ColorLabPage() {
  useDocumentTitle('Color Lab — FORME.')
  const [base, setBase] = useState<string>('olive')
  const [mode, setMode] = useState<PaletteMode>('earth')
  const [season, setSeason] = useState<Season>(currentSeason)
  const [combo, setCombo] = useState<CuratedCombo | null>(null)

  const lab = useMemo(() => buildLab(base, mode, season, combo), [base, mode, season, combo])
  const modeInfo = MODES.find((m) => m.id === mode)!

  const pickBase = (key: string) => {
    setBase(key)
    setCombo(null)
  }
  const pickMode = (m: PaletteMode) => {
    setMode(m)
    setCombo(null)
  }
  const pickCombo = (c: CuratedCombo) => {
    setCombo(combo?.id === c.id ? null : c)
    if (combo?.id !== c.id) {
      setBase(c.base)
      setMode(c.mode)
    }
  }

  return (
    <div className="pb-28">
      <header className="container-x pb-12 pt-12 md:pt-20">
        <p className="eyebrow mb-4">Color Lab</p>
        <h1 className="display max-w-4xl text-balance text-[3rem] sm:text-6xl lg:text-7xl">
          Start with one colour. <em className="italic text-olive">We’ll build the rest.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          Pick a base, choose a mood, and see the shirt, trousers, shoes and accessories that belong with it — with real colour names and HEX values.
        </p>
      </header>

      {/* controls */}
      <section className="container-x">
        <div className="rounded-[14px] bg-paper p-6 ring-1 ring-charcoal/10 md:p-9">
          <p className="eyebrow mb-5">1 · Choose a base colour</p>
          <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-12">
            {BASE_COLORS.map((k) => (
              <SelectableSwatch key={k} name={COLORS[k].name} hex={COLORS[k].hex} selected={base === k} onSelect={() => pickBase(k)} />
            ))}
          </div>

          <div className="mt-10 grid gap-8 border-t border-charcoal/10 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow mb-4">2 · Choose a mood</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Palette mode">
                {MODES.map((m) => (
                  <button key={m.id} type="button" className="chip" data-active={!combo && mode === m.id} aria-pressed={!combo && mode === m.id} onClick={() => pickMode(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-ink/65">{combo ? combo.note : modeInfo.blurb}</p>
            </div>
            {mode === 'seasonal' && !combo && (
              <div className="animate-fade-in">
                <p className="eyebrow mb-4">Season</p>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map((s) => (
                    <button key={s.id} type="button" className="chip" data-active={season === s.id} aria-pressed={season === s.id} onClick={() => setSeason(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* result */}
      <section key={lab.title + lab.swatches.map((s) => s.hex).join()} className="container-x mt-16 animate-fade-up">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow !text-olive">Your palette</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">{lab.title}</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/75">{lab.explanation}</p>
            <dl className="mt-8 space-y-3 border-t border-charcoal/15 pt-6 text-sm">
              {lab.swatches.map((s) => (
                <div key={s.hex} className="flex items-center gap-3">
                  <ColorDot hex={s.hex} size={18} />
                  <dt className="font-medium">{s.name}</dt>
                  <dd className="ml-auto flex items-center gap-4 text-ink/60">
                    <span className="hidden sm:inline">{s.role}</span>
                    <span className="font-mono text-xs">{s.hex}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {lab.swatches.map((s, i) => (
                <PaletteSwatchCard key={s.hex} name={s.name} hex={s.hex} role={s.role} tall className={cn(i === 0 && 'col-span-2 sm:col-span-1')} />
              ))}
            </div>
          </div>
        </div>

        {/* recipe */}
        <div className="mt-20">
          <p className="eyebrow mb-3">The recipe</p>
          <h3 className="display text-3xl sm:text-4xl">Wear it like this</h3>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] bg-charcoal/15 sm:grid-cols-3 lg:grid-cols-5">
            {lab.recipe.map((p) => (
              <div key={p.slot} className="flex flex-col items-center bg-paper px-4 pb-6 pt-8 text-center">
                <GarmentIcon kind={p.icon} color={p.color.hex} size={92} title={`${p.color.name} ${p.slot.toLowerCase()}`} />
                <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/55">{p.slot}</p>
                <p className="mt-1 font-serif text-xl leading-tight">{p.color.name}</p>
                <p className="mt-1 font-mono text-[11px] text-ink/55">{p.color.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* variations */}
        <div className="mt-20">
          <p className="eyebrow mb-3">Three ways</p>
          <h3 className="display text-3xl sm:text-4xl">Same palette, different moments</h3>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {lab.variations.map((v) => (
              <article key={v.name} className="rounded-[10px] bg-paper p-6 ring-1 ring-charcoal/10">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/55">{v.occasion}</p>
                <h4 className="mt-1 font-serif text-2xl">{v.name}</h4>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {v.pieces.map((p) => (
                    <div key={p.slot + p.color.hex} className="flex aspect-square items-center justify-center rounded-md bg-ivory-deep/70">
                      <GarmentIcon kind={p.icon} color={p.color.hex} size="72%" title={p.slot} />
                    </div>
                  ))}
                </div>
                <ul className="mt-5 space-y-1.5 text-sm text-ink/70">
                  {v.pieces.map((p) => (
                    <li key={p.slot + p.color.hex} className="flex items-center gap-2">
                      <ColorDot hex={p.color.hex} size={10} />
                      <span className="text-ink/50">{p.slot}</span>
                      <span className="ml-auto">{p.color.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* matching looks */}
      {lab.matchingOutfits.length > 0 && (
        <section className="container-x mt-24">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">In the wild</p>
              <h3 className="display text-3xl sm:text-4xl">Looks with this palette</h3>
            </div>
            <Link to="/discover" className="link-underline hidden items-center gap-2 text-sm font-medium sm:inline-flex">
              Browse all looks <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {lab.matchingOutfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} ratio={4 / 5} compact sizes="(min-width:1024px) 25vw, 50vw" />
            ))}
          </div>
        </section>
      )}

      {/* curated combos */}
      <section className="container-x mt-28">
        <p className="eyebrow mb-3">Curated combinations</p>
        <h3 className="display text-3xl sm:text-4xl">Pairings that never fail</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_COMBOS.map((c) => {
            const active = combo?.id === c.id
            const colors = c.recipe.slice(0, 4).map((k) => COLORS[k])
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  pickCombo(c)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aria-pressed={active}
                className={cn(
                  'group flex flex-col rounded-[10px] bg-paper p-5 text-left ring-1 transition-all duration-500 hover:-translate-y-0.5',
                  active ? 'ring-2 ring-charcoal' : 'ring-charcoal/10 hover:ring-charcoal/30',
                )}
              >
                <div className="flex h-20 overflow-hidden rounded-md ring-1 ring-black/10">
                  {colors.map((col) => (
                    <span key={col.key} className="flex-1" style={{ backgroundColor: col.hex, color: onColor(col.hex) }} />
                  ))}
                </div>
                <p className="mt-5 font-serif text-2xl">{c.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{c.note}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                  {active ? 'Showing above' : 'Try this pairing'} <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
