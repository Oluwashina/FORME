import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { AESTHETIC_BY_ID, OCCASION_BY_ID } from '../data/aesthetics'
import { SEARCH_SUGGESTIONS } from '../data/filters'
import { OUTFITS } from '../data/outfits'
import { EMPTY_FILTERS, filterOutfits } from '../lib/search'
import { Photo } from './Photo'

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => (q.trim() ? filterOutfits({ ...EMPTY_FILTERS, q }, OUTFITS) : []), [q])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const submit = (term: string) => {
    onClose()
    navigate(`/discover?q=${encodeURIComponent(term.trim())}`)
  }

  return (
    <div className="fixed inset-0 z-[70] animate-fade-in overflow-y-auto bg-ivory/[0.98] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search">
      <div className="container-x pb-20 pt-5 md:pt-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Search</p>
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-charcoal/6">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <form
          className="mx-auto mt-8 max-w-3xl md:mt-14"
          onSubmit={(e) => {
            e.preventDefault()
            if (q.trim()) submit(q)
          }}
        >
          <div className="flex items-center gap-4 border-b border-charcoal/30 pb-4">
            <Search size={26} strokeWidth={1.3} className="shrink-0 text-ink/55" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a look, color, or occasion…"
              aria-label="Search"
              className="w-full bg-transparent font-serif text-[1.9rem] tracking-[-0.01em] outline-none placeholder:text-ink/35 md:text-5xl"
            />
          </div>
        </form>

        <div className="mx-auto mt-8 max-w-3xl">
          {!q.trim() ? (
            <div>
              <p className="eyebrow mb-4">Try</p>
              <div className="flex flex-wrap gap-2.5">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chip !h-10 !px-5" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="py-10 text-ink/65">No looks match “{q}”. Try a colour, a piece of clothing or an occasion.</p>
          ) : (
            <div>
              <p className="eyebrow mb-3">
                {results.length} {results.length === 1 ? 'look' : 'looks'}
              </p>
              <ul className="divide-y divide-charcoal/10">
                {results.slice(0, 6).map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        navigate(`/look/${o.id}`)
                      }}
                      className="group flex w-full items-center gap-5 py-3.5 text-left"
                    >
                      <span className="block h-[4.5rem] w-14 shrink-0 overflow-hidden rounded-md">
                        <Photo id={o.image.id} alt="" focus={o.image.focus} widths={[160, 320]} sizes="56px" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-2xl leading-tight transition-colors group-hover:text-olive">{o.title}</span>
                        <span className="mt-0.5 block text-[13px] text-ink/60">
                          {AESTHETIC_BY_ID[o.aesthetic].name} · {OCCASION_BY_ID[o.occasion].name}
                        </span>
                      </span>
                      <ArrowRight size={18} className="shrink-0 text-ink/40 transition-all group-hover:translate-x-1 group-hover:text-charcoal" />
                    </button>
                  </li>
                ))}
              </ul>
              {results.length > 6 && (
                <button type="button" onClick={() => submit(q)} className="btn btn-dark mt-6">
                  See all {results.length} results <ArrowRight size={15} className="btn-arrow" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
