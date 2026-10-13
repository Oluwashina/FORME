import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Layers, Palette, Shirt } from 'lucide-react'
import { AestheticGrid } from '../components/AestheticGrid'
import { GuideCard } from '../components/GuideCard'
import { Hero } from '../components/Hero'
import { Newsletter } from '../components/Newsletter'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { StyleGallery } from '../components/StyleGallery'
import { GUIDES } from '../data/guides'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const TOOLS = [
  { to: '/color-lab', icon: Palette, title: 'Color Lab', copy: 'Pick a base colour and see what belongs with it.' },
  { to: '/occasions', icon: Compass, title: 'Dress for the Occasion', copy: 'From the office to the wedding, with the right formality.' },
  { to: '/build', icon: Shirt, title: 'Build Around One Item', copy: 'Start with the piece you own. We’ll do the rest.' },
  { to: '/quiz', icon: Layers, title: 'Find Your Aesthetic', copy: 'Seven quick questions. A style direction that fits.' },
]

export function HomePage() {
  useDocumentTitle('FORME. — Find your fit.')
  const [feature, ...rest] = GUIDES

  return (
    <>
      <Hero />

      {/* Explore by aesthetic */}
      <section className="container-x pb-32 pt-20 md:pt-28 lg:pb-44">
        <Reveal>
          <SectionHeading
            eyebrow="Explore by aesthetic"
            title={
              <>
                Nine ways to <em className="italic text-olive">dress well.</em>
              </>
            }
            description="Every strong wardrobe starts with a direction. Choose the one that feels closest to you — you can always cross over."
            action={
              <Link to="/quiz" className="link-underline inline-flex items-center gap-2 text-sm font-medium">
                Not sure? Take the quiz <ArrowRight size={15} />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-14 md:mt-20">
          <AestheticGrid />
        </div>
      </section>

      {/* Style gallery */}
      <section id="style-gallery" className="scroll-mt-20 bg-paper py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="The style gallery"
              title={
                <>
                  Looks worth <em className="italic text-olive">saving.</em>
                </>
              }
              description="Open any look for the full breakdown: every piece, the palette, and why it works."
            />
          </Reveal>
          <div className="mt-12">
            <StyleGallery />
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="container-x py-24 md:py-36">
        <Reveal>
          <SectionHeading
            eyebrow="Style guides"
            title={
              <>
                Learn the <em className="italic text-olive">logic.</em>
              </>
            }
            description="Short, practical reading on the principles behind the outfits."
            action={
              <Link to="/guides" className="link-underline inline-flex items-center gap-2 text-sm font-medium">
                All guides <ArrowRight size={15} />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <Reveal className="md:col-span-2 lg:row-span-2">
            <GuideCard guide={feature} variant="feature" index={0} />
          </Reveal>
          {rest.slice(0, 4).map((g, i) => (
            <Reveal key={g.id} delay={i * 80} className={i < 2 ? 'lg:col-span-1' : 'lg:col-span-1'}>
              <GuideCard guide={g} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="bg-charcoal text-ivory">
        <div className="container-x py-24 md:py-32">
          <Reveal>
            <p className="eyebrow !text-ivory/60">Tools</p>
            <h2 className="display mt-4 max-w-2xl text-balance text-[2.5rem] sm:text-5xl lg:text-6xl">Practical help, when you need it.</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[10px] bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((t) => (
              <Link key={t.to} to={t.to} className="group flex min-h-64 flex-col justify-between bg-charcoal p-7 transition-colors duration-500 hover:bg-[#2f2f2b]">
                <t.icon size={22} strokeWidth={1.4} className="text-ivory/70 transition-colors group-hover:text-ivory" />
                <div>
                  <h3 className="font-serif text-[1.7rem] leading-tight">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65">{t.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm">
                    Open <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
