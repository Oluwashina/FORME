import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bookmark, Menu, Search, X } from 'lucide-react'
import { cn } from '../lib/cn'
import { useSaved } from '../lib/saved'
import { SearchOverlay } from './SearchOverlay'

export const NAV_LINKS = [
  { to: '/discover', label: 'Discover' },
  { to: '/guides', label: 'Style Guides' },
  { to: '/color-lab', label: 'Color Lab' },
  { to: '/occasions', label: 'Occasions' },
]

const SECONDARY_LINKS = [
  { to: '/build', label: 'Build Around One Item' },
  { to: '/quiz', label: 'Find Your Aesthetic' },
]

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-serif text-[1.65rem] leading-none tracking-[-0.02em]', className)}>
      FORME<span className="text-olive">.</span>
    </span>
  )
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { count } = useSaved()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenu(false)
    setSearch(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  // "/" opens search (when not typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled || menu ? 'bg-ivory/85 backdrop-blur-xl' : 'bg-ivory',
          scrolled && !menu && 'shadow-[0_1px_0_rgba(37,37,34,0.08)]',
        )}
      >
        <nav className="container-x flex h-[4.25rem] items-center justify-between md:h-[4.75rem]" aria-label="Primary">
          <Link to="/" aria-label="FORME. home" className="relative z-[60]" onClick={() => setMenu(false)}>
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn('link-underline text-[0.9rem] tracking-[0.005em] transition-colors', isActive ? 'text-charcoal' : 'text-ink/70 hover:text-charcoal')
                  }
                  data-active={location.pathname.startsWith(l.to)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="relative z-[60] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearch(true)}
              aria-label="Search looks (press /)"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-charcoal/6"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/saved')}
              aria-label={`Saved looks (${count})`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-charcoal/6"
            >
              <Bookmark size={19} strokeWidth={1.6} fill={count > 0 ? 'currentColor' : 'none'} />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[9px] font-semibold text-ivory">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-charcoal/6 md:hidden"
            >
              {menu ? <X size={21} strokeWidth={1.6} /> : <Menu size={21} strokeWidth={1.6} />}
            </button>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      {menu && (
        <div className="fixed inset-0 z-40 flex animate-fade-in flex-col bg-ivory px-5 pb-10 pt-28 md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.to} className="animate-fade-up" style={{ animationDelay: `${i * 70 + 60}ms` }}>
                <Link
                  to={l.to}
                  className="flex items-baseline justify-between border-b border-charcoal/10 py-4 font-serif text-[2.6rem] leading-none tracking-[-0.02em]"
                >
                  {l.label}
                  <span className="font-sans text-xs tracking-widest text-taupe">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {SECONDARY_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="flex items-center justify-between text-[0.95rem] text-ink/80">
                {l.label} <span aria-hidden>→</span>
              </Link>
            ))}
            <Link to="/saved" className="btn btn-dark mt-4 w-full">
              Saved looks{count > 0 && ` (${count})`}
            </Link>
          </div>
        </div>
      )}

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  )
}
