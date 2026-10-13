import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { ColorDot } from '../components/ColorSwatch'
import { GarmentIcon } from '../components/GarmentIcon'
import { OutfitCard } from '../components/OutfitCard'
import { Photo } from '../components/Photo'
import { AESTHETIC_BY_ID } from '../data/aesthetics'
import { item } from '../data/items'
import { getOutfit, OUTFITS } from '../data/outfits'
import { QUIZ, type QuizQuestion } from '../data/quiz'
import { cn } from '../lib/cn'
import { clearQuiz, computeResult, loadQuizResult, saveQuizAnswers, type QuizAnswers, type QuizResult } from '../lib/quiz'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/* ───────────── steps ───────────── */

interface StepProps {
  q: QuizQuestion
  value: string[]
  onToggle: (id: string) => void
}

const atMax = (q: QuizQuestion, value: string[]) => !!q.max && value.length >= q.max

function VisualStep({ q, value, onToggle }: StepProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
      {q.options.map((o) => {
        const on = value.includes(o.id)
        const outfit = o.outfitId ? getOutfit(o.outfitId) : null
        const locked = !on && atMax(q, value)
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.id)}
            className={cn('group relative aspect-[4/5] overflow-hidden rounded-[10px] bg-stone text-left outline-offset-4 transition-all duration-500', on && 'outline-[3px] outline-olive', locked && 'opacity-45')}
          >
            {outfit && <Photo id={outfit.image.id} alt="" focus={outfit.image.focus} sizes="(min-width:1024px) 22vw, 45vw" zoomOnHover />}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-transparent" />
            <span className={cn('absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300', on ? 'border-olive bg-olive text-ivory' : 'border-ivory/70 text-transparent')}>
              <Check size={14} strokeWidth={2.4} />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 text-ivory">
              <span className="block font-serif text-2xl leading-tight">{o.label}</span>
              <span className="mt-0.5 block text-xs text-ivory/75">{o.hint}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function SwatchStep({ q, value, onToggle }: StepProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {q.options.map((o) => {
        const on = value.includes(o.id)
        const locked = !on && atMax(q, value)
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.id)}
            className={cn('rounded-[10px] bg-paper p-4 text-left ring-1 transition-all duration-300', on ? 'ring-2 ring-charcoal' : 'ring-charcoal/15 hover:ring-charcoal/35', locked && 'opacity-45')}
          >
            <div className="flex h-16 overflow-hidden rounded-md ring-1 ring-black/10">
              {o.swatches?.map((s) => (
                <span key={s} className="flex-1" style={{ backgroundColor: s }} />
              ))}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-xl leading-tight">{o.label}</p>
                <p className="text-xs text-ink/60">{o.hint}</p>
              </div>
              <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all', on ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/25 text-transparent')}>
                <Check size={13} strokeWidth={2.4} />
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function TextStep({ q, value, onToggle }: StepProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {q.options.map((o) => {
        const on = value.includes(o.id)
        const locked = !on && atMax(q, value)
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.id)}
            className={cn('flex items-start justify-between gap-4 rounded-[10px] px-5 py-5 text-left ring-1 transition-all duration-300', on ? 'bg-charcoal text-ivory ring-charcoal' : 'bg-paper ring-charcoal/15 hover:ring-charcoal/40', locked && 'opacity-45')}
          >
            <span>
              <span className="block font-serif text-[1.45rem] leading-tight">{o.label}</span>
              {o.hint && <span className={cn('mt-1 block text-sm', on ? 'text-ivory/70' : 'text-ink/60')}>{o.hint}</span>}
            </span>
            <span className={cn('mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all', on ? 'border-ivory bg-ivory text-charcoal' : 'border-charcoal/25 text-transparent')}>
              <Check size={13} strokeWidth={2.4} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ───────────── results ───────────── */

function Results({ result, onRetake }: { result: QuizResult; onRetake: () => void }) {
  const [top, ...others] = result.aesthetics
  const topA = AESTHETIC_BY_ID[top.id]
  const topOutfit = getOutfit(topA.outfitId)
  const outfits = result.outfitIds.map((id) => OUTFITS.find((o) => o.id === id)).filter((o): o is NonNullable<typeof o> => !!o)

  return (
    <div className="pb-28">
      <section className="container-x pt-12 md:pt-20">
        <p className="eyebrow mb-4 !text-olive">Your style direction</p>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h1 className="display text-[3.2rem] sm:text-7xl lg:text-8xl">
              <em className="italic text-olive">{topA.name}</em>
            </h1>
            <p className="mt-3 font-serif text-2xl text-ink/80">{topA.tagline}</p>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">{topA.description}</p>

            <div className="mt-10 space-y-5">
              {result.aesthetics.map((a, i) => (
                <div key={a.id}>
                  <div className="mb-2 flex items-baseline justify-between text-sm">
                    <Link to={`/discover?aesthetic=${a.id}`} className="font-serif text-xl hover:text-olive">
                      {AESTHETIC_BY_ID[a.id].name}
                    </Link>
                    <span className="text-ink/60">{Math.round(a.share)}%</span>
                  </div>
                  <div className="h-[3px] overflow-hidden rounded-full bg-charcoal/10">
                    <div className={cn('h-full rounded-full', i === 0 ? 'bg-olive' : 'bg-charcoal/55')} style={{ width: `${Math.max(6, a.share)}%`, transition: 'width 1.2s var(--ease-editorial)' }} />
                  </div>
                </div>
              ))}
            </div>
            {others.length > 0 && (
              <p className="mt-6 text-sm text-ink/60">
                Your secondary directions are {others.map((o) => AESTHETIC_BY_ID[o.id].name).join(' and ')}. They work well as accents to your main style.
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to={`/discover?aesthetic=${result.aesthetics.map((a) => a.id).join(',')}`} className="btn btn-dark">
                Browse your looks <ArrowRight size={16} className="btn-arrow" />
              </Link>
              <button type="button" onClick={onRetake} className="btn btn-line">
                <RotateCcw size={15} /> Retake the quiz
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Link to={`/look/${topOutfit.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-stone">
              <Photo id={topOutfit.image.id} alt={topOutfit.image.alt} focus={topOutfit.image.focus} priority zoomOnHover sizes="(min-width:1024px) 40vw, 100vw" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-5 text-sm text-ivory">{topOutfit.title}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* palettes */}
      <section className="container-x mt-24">
        <p className="eyebrow mb-3">Your palettes</p>
        <h2 className="display text-3xl sm:text-5xl">Colours that suit you</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {result.palettes.map((p) => (
            <div key={p.name} className="rounded-[10px] bg-paper p-5 ring-1 ring-charcoal/10">
              <div className="flex h-24 overflow-hidden rounded-md ring-1 ring-black/10">
                {p.swatches.map((s) => (
                  <span key={s.hex} className="flex-1" style={{ backgroundColor: s.hex }} title={`${s.name} ${s.hex}`} />
                ))}
              </div>
              <p className="mt-4 font-serif text-xl">{p.name}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                {p.swatches.map((s) => (
                  <li key={s.hex} className="flex items-center gap-2">
                    <ColorDot hex={s.hex} size={10} />
                    {s.name}
                    <span className="ml-auto font-mono text-[11px] text-ink/45">{s.hex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* outfits */}
      <section className="container-x mt-24">
        <p className="eyebrow mb-3">Sample outfits</p>
        <h2 className="display text-3xl sm:text-5xl">Six looks to start with</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {outfits.map((o) => (
            <OutfitCard key={o.id} outfit={o} ratio={4 / 5} compact sizes="(min-width:1024px) 30vw, 50vw" />
          ))}
        </div>
      </section>

      {/* starter pieces + tips */}
      <section className="container-x mt-24 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-3">Starter pieces</p>
          <h2 className="display text-3xl sm:text-4xl">Where to begin</h2>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {result.starterKeys.map((k) => {
              const it = item(k)
              return (
                <div key={k} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-paper ring-1 ring-charcoal/10">
                    <GarmentIcon kind={it.icon} color={it.color.hex} size="60%" title={it.name} />
                  </div>
                  <span className="text-xs leading-tight text-ink/75">{it.name}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="space-y-6 lg:col-span-5">
          {[
            ['Fit', result.fitLabel],
            ['Budget', result.budgetTip],
            ['Climate', result.climateTip],
          ].map(([label, text]) => (
            <div key={label} className="border-t border-charcoal/15 pt-5">
              <p className="eyebrow mb-2">{label}</p>
              <p className="leading-relaxed text-ink/80">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ───────────── page ───────────── */

export function QuizPage() {
  useDocumentTitle('Find your aesthetic — FORME.')
  const [result, setResult] = useState<QuizResult | null>(() => loadQuizResult())
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const q = QUIZ[step]
  const value = answers[q.id] ?? []
  const last = step === QUIZ.length - 1

  const toggle = (id: string) => {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? []
      if (!q.multi) return { ...prev, [q.id]: [id] }
      if (cur.includes(id)) return { ...prev, [q.id]: cur.filter((x) => x !== id) }
      if (q.max && cur.length >= q.max) return prev
      return { ...prev, [q.id]: [...cur, id] }
    })
  }

  const finish = () => {
    saveQuizAnswers(answers)
    setResult(computeResult(answers))
    window.scrollTo({ top: 0 })
  }

  const retake = () => {
    clearQuiz()
    setResult(null)
    setAnswers({})
    setStep(0)
    setStarted(true)
    window.scrollTo({ top: 0 })
  }

  if (result) return <Results result={result} onRetake={retake} />

  if (!started) {
    return (
      <div className="container-x grid min-h-[70vh] items-center gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4">Personal style discovery</p>
          <h1 className="display text-balance text-[3.2rem] sm:text-7xl">
            Find your <em className="italic text-olive">aesthetic.</em>
          </h1>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink/75">
            Seven short questions about the looks, colours and moments you care about. You’ll get your style direction, palettes, sample outfits and a few pieces to start with.
          </p>
          <button type="button" onClick={() => setStarted(true)} className="btn btn-dark mt-9">
            Start the quiz <ArrowRight size={16} className="btn-arrow" />
          </button>
          <p className="mt-4 text-sm text-ink/55">About two minutes. Saved only in your browser.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 lg:col-span-6">
          {['the-modern-earth-tone-fit', 'black-turtleneck-evening', 'wide-denim-beanie'].map((id, i) => {
            const o = getOutfit(id)
            return (
              <div key={id} className={cn('relative aspect-[3/5] overflow-hidden rounded-[10px] bg-stone', i === 1 && 'mt-10')}>
                <Photo id={o.image.id} alt="" focus={o.image.focus} sizes="20vw" />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const Step = q.kind === 'visual' ? VisualStep : q.kind === 'swatch' ? SwatchStep : TextStep
  const canContinue = value.length > 0

  return (
    <div className="container-x pb-28 pt-8 md:pt-12">
      <div className="mb-10 flex items-center gap-5">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-valuemin={1} aria-valuemax={QUIZ.length} aria-valuenow={step + 1}>
          <div className="h-full rounded-full bg-charcoal" style={{ width: `${((step + 1) / QUIZ.length) * 100}%`, transition: 'width 600ms var(--ease-editorial)' }} />
        </div>
        <span className="text-xs tracking-wide text-ink/60">
          {step + 1} / {QUIZ.length}
        </span>
      </div>

      <div key={q.id} className="animate-fade-up">
        <p className="eyebrow mb-3 !text-olive">{q.eyebrow}</p>
        <h1 className="display max-w-3xl text-balance text-[2.4rem] sm:text-5xl lg:text-6xl">{q.title}</h1>
        <p className="mt-4 text-ink/65">
          {q.subtitle}
          {q.multi && q.max && <span className="ml-2 text-ink/45">({value.length}/{q.max} selected)</span>}
        </p>
        <div className="mt-10">
          <Step q={q} value={value} onToggle={toggle} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center justify-between border-t border-charcoal/10 bg-ivory/90 px-5 py-4 backdrop-blur md:-mx-0 md:static md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <button type="button" onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))} className="btn btn-line">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="button" disabled={!canContinue} onClick={() => (last ? finish() : (setStep(step + 1), window.scrollTo({ top: 0, behavior: 'smooth' })))} className="btn btn-dark disabled:cursor-not-allowed disabled:opacity-40">
          {last ? 'See my results' : 'Continue'} <ArrowRight size={16} className="btn-arrow" />
        </button>
      </div>
    </div>
  )
}
