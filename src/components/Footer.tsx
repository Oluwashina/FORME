import { Link } from 'react-router-dom'
import { Wordmark } from './Navigation'

const cols = [
  {
    title: 'Explore',
    links: [
      { to: '/discover', label: 'Discover looks' },
      { to: '/guides', label: 'Style guides' },
      { to: '/color-lab', label: 'Color Lab' },
      { to: '/occasions', label: 'Dress for the occasion' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { to: '/build', label: 'Build around one item' },
      { to: '/quiz', label: 'Find your aesthetic' },
      { to: '/saved', label: 'Saved looks' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark className="!text-5xl" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-ivory/60">
              A men’s style discovery platform. Find the look, understand every piece, learn why the colours work, and leave knowing how to dress better.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow !text-ivory/45">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[0.95rem] text-ivory/80 transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory/12 pt-8 text-xs leading-relaxed text-ivory/45 md:flex-row md:items-start md:justify-between">
          <p className="max-w-xl">
            Prototype · All outfit, product and fabric information is sample content. No brands, prices or shopping links are used until real product data is connected.
          </p>
          <p>
            Photography via{' '}
            <a href="https://unsplash.com/?utm_source=forme&utm_medium=referral" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ivory">
              Unsplash
            </a>{' '}
            · © FORME. {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
