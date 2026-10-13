import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, Check, Plus, X } from 'lucide-react'
import { cn } from '../lib/cn'
import { useSaved } from '../lib/saved'
import { useToast } from '../lib/toast'

interface Props {
  outfitId: string
  variant?: 'overlay' | 'inline'
  className?: string
}

const POPOVER_W = 296

/**
 * Bookmark control. First click saves the look instantly and opens a small popover
 * to file it into one or more collections (or remove it).
 */
export function SaveButton({ outfitId, variant = 'overlay', className }: Props) {
  const { isSaved, collectionsFor, saveOutfit, removeOutfit, toggleCollection, createCollection, state } = useSaved()
  const toast = useToast()
  const saved = isSaved(outfitId)
  const inCollections = collectionsFor(outfitId)

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; sheet: boolean }>({ top: 0, left: 0, sheet: false })
  const [newName, setNewName] = useState('')
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)

  const place = () => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const sheet = window.innerWidth < 640
    const left = Math.max(12, Math.min(window.innerWidth - POPOVER_W - 12, rect.right - POPOVER_W))
    const estimatedH = Math.min(420, 150 + state.collections.length * 44)
    const below = rect.bottom + 10
    const top = below + estimatedH > window.innerHeight - 12 ? Math.max(12, rect.top - estimatedH - 10) : below
    setPos({ top, left, sheet })
  }

  useLayoutEffect(() => {
    if (open) place()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.collections.length])

  useEffect(() => {
    if (!open) return
    const onDown = (e: Event) => {
      const t = e.target as Node
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => {
      if (window.innerWidth >= 640) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!saved) {
      saveOutfit(outfitId)
      toast.show('Saved to your looks')
      setOpen(true)
    } else setOpen((o) => !o)
  }

  const addCollection = () => {
    const id = createCollection(newName)
    if (id) {
      toggleCollection(outfitId, id)
      setNewName('')
    }
  }

  const label = saved ? 'Saved look — manage collections' : 'Save look'

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-expanded={open}
        title={label}
        className={cn(
          variant === 'overlay'
            ? 'flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-[0_2px_14px_-4px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-ivory'
            : 'inline-flex h-12 items-center gap-2.5 rounded-full border border-charcoal/25 px-6 text-sm font-medium transition-colors duration-300 hover:bg-charcoal hover:text-ivory',
          variant === 'inline' && saved && 'border-charcoal bg-charcoal text-ivory hover:bg-olive hover:border-olive',
          className,
        )}
      >
        <Bookmark
          key={String(saved)}
          size={variant === 'overlay' ? 17 : 17}
          className={cn(saved && 'animate-pop')}
          fill={saved ? 'currentColor' : 'none'}
          strokeWidth={1.7}
        />
        {variant === 'inline' && <span>{saved ? 'Saved' : 'Save look'}</span>}
      </button>

      {open &&
        createPortal(
          <>
            {pos.sheet && <div className="fixed inset-0 z-[80] bg-charcoal/40 animate-fade-in" onClick={() => setOpen(false)} aria-hidden />}
            <div
              ref={popRef}
              role="dialog"
              aria-label="Save to collection"
              onClick={(e) => e.stopPropagation()}
              style={pos.sheet ? undefined : { top: pos.top, left: pos.left, width: POPOVER_W }}
              className={cn(
                'fixed z-[85] border border-charcoal/10 bg-paper p-5 text-charcoal shadow-[0_30px_80px_-20px_rgba(37,37,34,0.45)] animate-sheet-in',
                pos.sheet ? 'inset-x-0 bottom-0 rounded-t-2xl pb-8' : 'rounded-xl',
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-serif text-xl">Save to collection</p>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1 text-ink/60 hover:text-charcoal">
                  <X size={16} />
                </button>
              </div>
              <ul className="max-h-60 space-y-0.5 overflow-y-auto pr-1">
                {state.collections.map((c) => {
                  const on = inCollections.includes(c.id)
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => toggleCollection(outfitId, c.id)}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-charcoal/5"
                      >
                        <span>{c.name}</span>
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                            on ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/25',
                          )}
                        >
                          {on && <Check size={12} strokeWidth={2.5} />}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <form
                className="mt-3 flex items-center gap-2 border-t border-charcoal/10 pt-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  addCollection()
                }}
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New collection"
                  maxLength={40}
                  aria-label="New collection name"
                  className="h-10 min-w-0 flex-1 rounded-full border border-charcoal/15 bg-transparent px-4 text-sm outline-none placeholder:text-ink/40 focus:border-charcoal/50"
                />
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  aria-label="Create collection"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-ivory transition-opacity disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  removeOutfit(outfitId)
                  setOpen(false)
                  toast.show('Removed from saved looks')
                }}
                className="mt-3 w-full rounded-full py-2 text-xs text-ink/55 underline-offset-4 transition-colors hover:text-charcoal hover:underline"
              >
                Remove from saved looks
              </button>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
