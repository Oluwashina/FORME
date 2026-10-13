import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Photo } from './Photo'

const scrollToGallery = () => {
  document.getElementById('style-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-16 pt-6 md:pt-10 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-12 lg:gap-6 lg:pb-14">
        {/* copy */}
        <div className="relative z-10 lg:col-span-5 lg:pr-4">
          <p className="eyebrow animate-fade-up !text-olive" style={{ animationDelay: '80ms' }}>
            Autumn / Winter 2026 · The Style Edit
          </p>
          <h1 className="display mt-6 text-[clamp(4.4rem,13.5vw,9.75rem)] leading-[0.88] tracking-[-0.035em]">
            <span className="block animate-fade-up" style={{ animationDelay: '160ms' }}>
              Find
            </span>
            <span className="block animate-fade-up" style={{ animationDelay: '260ms' }}>
              your <em className="pr-2 italic text-olive">fit.</em>
            </span>
          </h1>
          <p className="mt-8 max-w-[26rem] animate-fade-up text-pretty text-[1.1875rem] leading-[1.55] text-ink/80" style={{ animationDelay: '420ms' }}>
            Good style isn’t about owning more. It’s about knowing what works.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '540ms' }}>
            <button type="button" onClick={scrollToGallery} className="btn btn-dark">
              Explore the styles <ArrowRight size={16} className="btn-arrow" />
            </button>
            <Link to="/quiz" className="btn btn-line">
              Find your aesthetic
            </Link>
          </div>

          <dl className="mt-14 hidden animate-fade-in grid-cols-3 gap-6 border-t border-charcoal/12 pt-6 text-sm lg:grid" style={{ animationDelay: '900ms' }}>
            {[
              ['Looks', 'Fully broken down'],
              ['Color Lab', 'Palettes that work'],
              ['Occasions', 'Dressed for each'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-serif text-xl">{k}</dt>
                <dd className="mt-1 text-[13px] text-ink/60">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* editorial collage */}
        <div className="relative lg:col-span-7">
          <div className="relative mx-auto grid max-w-[40rem] grid-cols-12 gap-3 sm:gap-4 lg:max-w-none">
            {/* main */}
            <figure className="group relative col-span-8 col-start-5 overflow-hidden rounded-[10px] animate-clip lg:col-span-7 lg:col-start-6" style={{ animationDelay: '200ms' }}>
              <Link to="/look/camel-coat-season" aria-label="View The Camel Coat look" className="block aspect-[3/4] lg:aspect-[3/4.1]">
                <Photo
                  id="1557342892-93950a8caa84"
                  alt="A man in a camel overcoat standing in front of a vintage red car"
                  focus="center 20%"
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  widths={[600, 900, 1200, 1600]}
                  priority
                  imgClassName="animate-drift"
                />
              </Link>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-charcoal/60 to-transparent p-4 pt-14 text-ivory sm:p-5">
                <span className="font-serif text-xl leading-none sm:text-2xl">The Camel Coat</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/80">No. 01</span>
              </figcaption>
            </figure>

            {/* secondary left (overlaps) */}
            <figure
              className="absolute -left-1 bottom-6 z-10 w-[38%] overflow-hidden rounded-[10px] border-[5px] border-ivory animate-clip sm:bottom-10 lg:bottom-16 lg:left-0 lg:w-[31%] lg:border-[7px]"
              style={{ animationDelay: '500ms' }}
            >
              <div className="aspect-[3/4]">
                <Photo
                  id="1619603364937-8d7af41ef206"
                  alt="A man in a brown coat standing against a pale wall"
                  focus="center 18%"
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  widths={[400, 700, 1000]}
                  priority
                />
              </div>
            </figure>

            {/* tertiary top-left (desktop) */}
            <figure className="col-span-4 col-start-1 row-start-1 hidden self-start overflow-hidden rounded-[10px] animate-clip lg:col-span-3 lg:col-start-3 lg:block" style={{ animationDelay: '650ms' }}>
              <div className="aspect-square">
                <Photo
                  id="1584119164246-461d43e9bab3"
                  alt="A man in a black turtleneck sweater"
                  focus="center 30%"
                  sizes="20vw"
                  widths={[300, 500, 800]}
                  priority
                />
              </div>
            </figure>

            {/* floating label */}
            <div className="absolute right-2 top-5 z-20 hidden animate-float rounded-full bg-ivory px-4 py-2 text-[11px] font-medium shadow-[0_10px_30px_-10px_rgba(37,37,34,0.4)] sm:block lg:right-[-0.5rem]">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-olive align-middle" />
              Look of the week
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
