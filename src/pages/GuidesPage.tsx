import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { GuideCard } from '../components/GuideCard'
import { OutfitCard } from '../components/OutfitCard'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { GUIDES, GUIDE_BY_ID } from '../data/guides'
import { OUTFIT_BY_ID } from '../data/outfits'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'

export function GuidesPage() {
  useDocumentTitle('Style Guides — FORME.')
  const [first, ...rest] = GUIDES
  return (
    <div className="container-x pb-28 pt-12 md:pt-20">
      <header className="mb-14 max-w-3xl">
        <p className="eyebrow mb-4">Style guides</p>
        <h1 className="display text-[3rem] sm:text-6xl lg:text-7xl">
          Learn the <em className="italic text-olive">logic.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          Short, practical reading on the principles behind well-dressed men — written to be used, not just admired.
        </p>
      </header>

      <Reveal className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <Link to={`/guides/${first.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[10px] bg-stone">
          <Photo id={first.image.id} alt={first.image.alt} focus={first.image.focus} priority zoomOnHover sizes="(min-width:1024px) 50vw, 100vw" />
        </Link>
        <div>
          <p className="eyebrow !text-olive">{first.category}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            <Link to={`/guides/${first.id}`} className="transition-colors hover:text-olive">
              {first.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink/75">{first.dek}</p>
          <Link to={`/guides/${first.id}`} className="btn btn-line mt-8">
            Read the guide <ArrowRight size={16} className="btn-arrow" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((g, i) => (
          <Reveal key={g.id} delay={i * 80}>
            <GuideCard guide={g} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function GuideDetailPage() {
  const { id } = useParams()
  const guide = id ? GUIDE_BY_ID[id] : undefined
  useDocumentTitle(guide ? `${guide.title} — FORME.` : 'Guide — FORME.')

  if (!guide) return <NotFoundPage title="We couldn’t find that guide." />

  const idx = GUIDES.findIndex((g) => g.id === guide.id)
  const next = GUIDES[(idx + 1) % GUIDES.length]
  const outfits = guide.relatedOutfitIds.map((oid) => OUTFIT_BY_ID[oid]).filter(Boolean)

  return (
    <article>
      <div className="container-x pt-10 md:pt-14">
        <Link to="/guides" className="link-underline inline-flex items-center gap-2 text-sm text-ink/70">
          <ArrowLeft size={15} /> All guides
        </Link>
      </div>

      <header className="container-x mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6 lg:self-center">
          <p className="eyebrow !text-olive">
            {guide.category} · {guide.readTime}
          </p>
          <h1 className="display mt-5 text-balance text-[2.8rem] sm:text-6xl lg:text-[4.4rem]">{guide.title}</h1>
          <p className="mt-6 max-w-md text-[1.125rem] leading-relaxed text-ink/75">{guide.dek}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-stone lg:col-span-6">
          <Photo id={guide.image.id} alt={guide.image.alt} focus={guide.image.focus} priority sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
      </header>

      <div className="container-x mt-20 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-4">
          <p className="font-serif text-[1.6rem] leading-[1.35] text-charcoal sm:text-3xl">{guide.intro}</p>

          <div className="mt-14 space-y-12">
            {guide.sections.map((s, i) => (
              <Reveal key={s.heading} className="grid gap-4 border-t border-charcoal/15 pt-8 sm:grid-cols-[3.5rem_1fr]">
                <span className="font-serif text-3xl italic text-olive">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-serif text-[1.9rem] leading-tight">{s.heading}</h2>
                  <p className="mt-3 text-[1.0625rem] leading-[1.7] text-ink/80">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <aside className="mt-16 rounded-[10px] bg-olive px-8 py-10 text-ivory">
            <p className="eyebrow !text-ivory/70">The takeaway</p>
            <p className="mt-4 font-serif text-2xl leading-snug sm:text-[1.9rem]">{guide.takeaway}</p>
          </aside>
        </div>
      </div>

      {outfits.length > 0 && (
        <section className="container-x mt-28">
          <p className="eyebrow mb-3">See it in practice</p>
          <h2 className="display mb-10 text-4xl sm:text-5xl">Looks that follow the idea</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} ratio={4 / 5} sizes="(min-width:1024px) 33vw, 50vw" />
            ))}
          </div>
        </section>
      )}

      <section className="container-x mt-28 pb-28">
        <Link to={`/guides/${next.id}`} className="group flex items-center justify-between gap-6 border-y border-charcoal/15 py-10">
          <div>
            <p className="eyebrow mb-3">Next guide</p>
            <p className="font-serif text-3xl transition-colors group-hover:text-olive sm:text-5xl">{next.title}</p>
          </div>
          <ArrowRight size={28} strokeWidth={1.3} className="shrink-0 transition-transform duration-500 group-hover:translate-x-2" />
        </Link>
      </section>
    </article>
  )
}
