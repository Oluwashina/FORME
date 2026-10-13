import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { FILTER_GROUPS, type FilterGroup } from '../data/filters'
import { cn } from '../lib/cn'
import { activeFilterCount, EMPTY_FILTERS, type Filters } from '../lib/search'
import { ColorDot } from './ColorSwatch'

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
  resultCount: number
  total: number
  hideGroups?: FilterGroup['key'][]
}

type ListKey = Exclude<keyof Filters, 'q'>

const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

export function FilterBar({ filters, onChange, resultCount, total, hideGroups = [] }: Props) {
  const [openKey, setOpenKey] = useState<FilterGroup['key'] | null>(null)
  const [sheet, setSheet] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const groups = FILTER_GROUPS.filter((g) => !hideGroups.includes(g.key))
  const count = activeFilterCount(filters)

  useEffect(() => {
    if (!openKey) return
    const onDown = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenKey(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openKey])

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheet])

  const set = (key: ListKey, value: string) => onChange({ ...filters, [key]: toggle(filters[key], value) })

  const labelFor = (key: ListKey, value: string) =>
    FILTER_GROUPS.find((g) => g.key === key)?.options.find((o) => o.value === value)?.label ?? value

  const chips: { key: ListKey; value: string }[] = groups.flatMap((g) => filters[g.key as ListKey].map((value) => ({ key: g.key as ListKey, value })))

  return (
    <div ref={barRef} className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* search */}
        <label className="relative block flex-1 md:max-w-md">
          <span className="sr-only">Search looks</span>
          <Search size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink/50" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onChange({ ...filters, q: e.target.value })}
            placeholder="Find a look, color, or occasion…"
            className="h-12 w-full rounded-full border border-charcoal/15 bg-paper/60 pl-12 pr-11 text-[15px] outline-none transition-colors placeholder:text-ink/45 focus:border-charcoal/55 focus:bg-paper [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, q: '' })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink/55 hover:bg-charcoal/8 hover:text-charcoal"
            >
              <X size={15} />
            </button>
          )}
        </label>

        {/* desktop dropdowns */}
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {groups.map((g) => {
            const selected = filters[g.key as ListKey]
            const isOpen = openKey === g.key
            return (
              <div key={g.key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : g.key)}
                  aria-expanded={isOpen}
                  data-active={selected.length > 0}
                  className="chip"
                >
                  {g.label}
                  {selected.length > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ivory px-1 text-[10px] font-semibold text-charcoal">
                      {selected.length}
                    </span>
                  )}
                  <ChevronDown size={14} className={cn('transition-transform duration-300', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div className="animate-sheet-in absolute left-0 top-[calc(100%+8px)] z-40 w-64 rounded-xl border border-charcoal/10 bg-paper p-2 shadow-[0_30px_70px_-24px_rgba(37,37,34,0.45)]">
                    <ul className="max-h-80 overflow-y-auto">
                      {g.options.map((o) => {
                        const on = selected.includes(o.value)
                        return (
                          <li key={o.value}>
                            <button
                              type="button"
                              onClick={() => set(g.key as ListKey, o.value)}
                              role="checkbox"
                              aria-checked={on}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-charcoal/5"
                            >
                              <span
                                className={cn(
                                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors',
                                  on ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/30',
                                )}
                              >
                                {on && <Check size={12} strokeWidth={2.6} />}
                              </span>
                              {o.swatch && <ColorDot hex={o.swatch} size={13} />}
                              <span className="flex-1">{o.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* mobile trigger */}
        <button type="button" onClick={() => setSheet(true)} className="chip h-12 justify-center md:hidden" data-active={count > 0}>
          <SlidersHorizontal size={15} /> Filters{count > 0 && ` · ${count}`}
        </button>
      </div>

      {/* status + active chips */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <p className="text-[13px] text-ink/60" aria-live="polite">
          {resultCount === total ? `${total} looks` : `${resultCount} of ${total} looks`}
        </p>
        {chips.map((c) => (
          <button
            key={`${c.key}-${c.value}`}
            type="button"
            onClick={() => set(c.key, c.value)}
            className="group inline-flex h-7 items-center gap-1.5 rounded-full bg-charcoal/[0.07] pl-3 pr-2 text-xs transition-colors hover:bg-charcoal/12"
          >
            {labelFor(c.key, c.value)}
            <X size={12} className="text-ink/50 group-hover:text-charcoal" />
          </button>
        ))}
        {(count > 0 || filters.q) && (
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS })}
            className="text-xs text-ink/60 underline underline-offset-4 transition-colors hover:text-charcoal"
          >
            Clear all
          </button>
        )}
      </div>

      {/* mobile sheet */}
      {sheet &&
        createPortal(
          <div className="fixed inset-0 z-[80] md:hidden">
            <div className="absolute inset-0 animate-fade-in bg-charcoal/45" onClick={() => setSheet(false)} aria-hidden />
            <div className="animate-sheet-in absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-paper">
              <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
                <p className="font-serif text-2xl">Filters</p>
                <button type="button" onClick={() => setSheet(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-charcoal/5">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
                {groups.map((g) => (
                  <div key={g.key}>
                    <p className="eyebrow mb-3">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.options.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          className="chip"
                          data-active={filters[g.key as ListKey].includes(o.value)}
                          onClick={() => set(g.key as ListKey, o.value)}
                        >
                          {o.swatch && <ColorDot hex={o.swatch} size={11} />}
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 border-t border-charcoal/10 px-5 py-4">
                <button type="button" onClick={() => onChange({ ...EMPTY_FILTERS, q: filters.q })} className="btn btn-line flex-1 !h-12">
                  Clear
                </button>
                <button type="button" onClick={() => setSheet(false)} className="btn btn-dark flex-[2] !h-12">
                  Show {resultCount} looks
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
