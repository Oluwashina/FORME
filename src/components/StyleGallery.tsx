import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import type { FilterGroup } from '../data/filters'
import { SEARCH_SUGGESTIONS } from '../data/filters'
import { OUTFITS } from '../data/outfits'
import { EMPTY_FILTERS, filterOutfits, type Filters } from '../lib/search'
import type { Outfit } from '../types'
import { FilterBar } from './FilterBar'
import { MasonryGallery } from './MasonryGallery'

interface Props {
  /** keep filters in the URL (shareable, back-button friendly) */
  syncUrl?: boolean
  /** restrict the pool of outfits (e.g. a single occasion) */
  source?: Outfit[]
  hideGroups?: FilterGroup['key'][]
  pageSize?: number
  /** forces a filter reset when this changes (e.g. switching occasion) */
  resetKey?: string
}

const LIST_KEYS = ['aesthetic', 'occasion', 'clothing', 'palette', 'formality'] as const

const fromParams = (p: URLSearchParams): Filters => ({
  q: p.get('q') ?? '',
  aesthetic: p.get('aesthetic')?.split(',').filter(Boolean) ?? [],
  occasion: p.get('occasion')?.split(',').filter(Boolean) ?? [],
  clothing: p.get('clothing')?.split(',').filter(Boolean) ?? [],
  palette: p.get('palette')?.split(',').filter(Boolean) ?? [],
  formality: p.get('formality')?.split(',').filter(Boolean) ?? [],
})

export function StyleGallery({ syncUrl, source = OUTFITS, hideGroups, pageSize = 12, resetKey }: Props) {
  const [params, setParams] = useSearchParams()
  const [localFilters, setLocalFilters] = useState<Filters>(EMPTY_FILTERS)
  const [visible, setVisible] = useState(pageSize)
  const [loading, setLoading] = useState(false)
  const prevShown = useRef(pageSize)

  const filters = syncUrl ? fromParams(params) : localFilters

  const setFilters = useCallback(
    (next: Filters) => {
      if (!syncUrl) return setLocalFilters(next)
      const p = new URLSearchParams(params)
      if (next.q) p.set('q', next.q)
      else p.delete('q')
      for (const k of LIST_KEYS) {
        if (next[k].length) p.set(k, next[k].join(','))
        else p.delete(k)
      }
      setParams(p, { replace: true })
    },
    [params, setParams, syncUrl],
  )

  const results = useMemo(() => filterOutfits(filters, source), [filters.q, filters.aesthetic.join(), filters.occasion.join(), filters.clothing.join(), filters.palette.join(), filters.formality.join(), source]) // eslint-disable-line react-hooks/exhaustive-deps

  // reset pagination whenever the result set changes
  const signature = results.map((r) => r.id).join('|')
  useEffect(() => {
    setVisible(pageSize)
    prevShown.current = pageSize
  }, [signature, pageSize])

  useEffect(() => {
    if (resetKey !== undefined) setLocalFilters(EMPTY_FILTERS)
  }, [resetKey])

  const shown = results.slice(0, visible)
  const remaining = results.length - shown.length

  const loadMore = () => {
    setLoading(true)
    prevShown.current = visible
    // a short, deliberate beat so appended looks feel curated rather than dumped
    window.setTimeout(() => {
      setVisible((v) => v + pageSize)
      setLoading(false)
    }, 450)
  }

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} resultCount={results.length} total={source.length} hideGroups={hideGroups} />

      <div className="mt-10 min-h-[40vh]">
        {results.length === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="display text-4xl">Nothing quite matches.</p>
            <p className="mt-4 text-ink/70">Try fewer filters, or search for a colour, a piece or an occasion.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SEARCH_SUGGESTIONS.slice(0, 5).map((s) => (
                <button key={s} type="button" className="chip" onClick={() => setFilters({ ...EMPTY_FILTERS, q: s })}>
                  {s}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="btn btn-dark mt-8">
              Clear all filters
            </button>
          </div>
        ) : (
          <MasonryGallery outfits={shown} animateFrom={prevShown.current} />
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="h-px w-48 overflow-hidden bg-charcoal/12" aria-hidden>
            <div className="h-full bg-charcoal transition-[width] duration-700 ease-[var(--ease-editorial)]" style={{ width: `${(shown.length / results.length) * 100}%` }} />
          </div>
          <p className="text-[13px] text-ink/60">
            Showing {shown.length} of {results.length}
          </p>
          {remaining > 0 && (
            <button type="button" onClick={loadMore} disabled={loading} className="btn btn-line min-w-48">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-charcoal/25 border-t-charcoal" /> Loading
                </span>
              ) : (
                <>
                  Load more looks <ArrowDown size={15} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
