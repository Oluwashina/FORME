import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { OutfitCard } from '../components/OutfitCard'
import { OUTFIT_BY_ID } from '../data/outfits'
import { cn } from '../lib/cn'
import { useSaved } from '../lib/saved'
import { useToast } from '../lib/toast'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const ALL = 'all'

export function SavedPage() {
  useDocumentTitle('Saved Looks — FORME.')
  const { state, createCollection, renameCollection, deleteCollection, count } = useSaved()
  const toast = useToast()
  const [active, setActive] = useState<string>(ALL)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const current = state.collections.find((c) => c.id === active)
  const activeId = current ? active : ALL

  const entries = [...state.entries]
    .filter((e) => (activeId === ALL ? true : e.collectionIds.includes(activeId)))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  const outfits = entries.map((e) => OUTFIT_BY_ID[e.outfitId]).filter(Boolean)

  const countIn = (id: string) => state.entries.filter((e) => e.collectionIds.includes(id)).length

  const submitNew = (e: FormEvent) => {
    e.preventDefault()
    const id = createCollection(newName)
    if (id) {
      setActive(id)
      setNewName('')
      setAdding(false)
      toast.show('Collection created')
    }
  }

  const submitRename = (e: FormEvent) => {
    e.preventDefault()
    if (current && renameValue.trim()) {
      renameCollection(current.id, renameValue.trim())
      setRenaming(false)
    }
  }

  return (
    <div className="container-x pb-28 pt-12 md:pt-20">
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow mb-4">Saved looks</p>
        <h1 className="display text-[3rem] sm:text-6xl lg:text-7xl">
          Your <em className="italic text-olive">wardrobe plans.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          {count > 0
            ? `${count} saved ${count === 1 ? 'look' : 'looks'}, kept in this browser. Organise them into collections.`
            : 'Save looks you love, then sort them into collections like Workwear or Wedding Inspiration.'}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Collections">
        <button type="button" role="tab" aria-selected={activeId === ALL} className="chip" data-active={activeId === ALL} onClick={() => setActive(ALL)}>
          All saved <span className="ml-1 opacity-50">{count}</span>
        </button>
        {state.collections.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={activeId === c.id}
            className="chip"
            data-active={activeId === c.id}
            onClick={() => {
              setActive(c.id)
              setRenaming(false)
              setConfirmDelete(false)
            }}
          >
            {c.name} <span className="ml-1 opacity-50">{countIn(c.id)}</span>
          </button>
        ))}
        {adding ? (
          <form onSubmit={submitNew} className="flex items-center gap-1.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={32}
              placeholder="Collection name"
              aria-label="New collection name"
              className="h-10 w-44 rounded-full border border-charcoal/25 bg-paper px-4 text-sm outline-none focus:border-charcoal"
            />
            <button type="submit" aria-label="Create collection" disabled={!newName.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-ivory disabled:opacity-40">
              <Check size={16} />
            </button>
            <button type="button" aria-label="Cancel" onClick={() => setAdding(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20">
              <X size={16} />
            </button>
          </form>
        ) : (
          <button type="button" className="chip !border-dashed" onClick={() => setAdding(true)}>
            <Plus size={14} /> New collection
          </button>
        )}
      </div>

      {current && (
        <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-charcoal/10 py-4">
          {renaming ? (
            <form onSubmit={submitRename} className="flex items-center gap-1.5">
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                maxLength={32}
                aria-label="Collection name"
                className="h-10 w-56 rounded-full border border-charcoal/25 bg-paper px-4 text-sm outline-none focus:border-charcoal"
              />
              <button type="submit" aria-label="Save name" className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-ivory">
                <Check size={16} />
              </button>
              <button type="button" aria-label="Cancel" onClick={() => setRenaming(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20">
                <X size={16} />
              </button>
            </form>
          ) : (
            <>
              <h2 className="font-serif text-3xl">{current.name}</h2>
              <button
                type="button"
                onClick={() => {
                  setRenameValue(current.name)
                  setRenaming(true)
                }}
                className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-charcoal"
              >
                <Pencil size={14} /> Rename
              </button>
              {confirmDelete ? (
                <span className="ml-auto flex items-center gap-3 text-sm">
                  Delete this collection? Looks stay saved.
                  <button
                    type="button"
                    className="font-medium text-[#9b3b2f] underline underline-offset-4"
                    onClick={() => {
                      deleteCollection(current.id)
                      setActive(ALL)
                      setConfirmDelete(false)
                      toast.show('Collection deleted')
                    }}
                  >
                    Delete
                  </button>
                  <button type="button" className="underline underline-offset-4" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="ml-auto inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-[#9b3b2f]">
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className={cn(current ? 'mt-10' : 'mt-12')}>
        {outfits.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {outfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} ratio={4 / 5} compact sizes="(min-width:1024px) 25vw, 50vw" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[14px] border border-dashed border-charcoal/20 px-6 py-24 text-center">
            <Bookmark size={28} strokeWidth={1.2} className="text-ink/40" />
            <h2 className="mt-5 font-serif text-3xl">{current ? `Nothing in ${current.name} yet` : 'No saved looks yet'}</h2>
            <p className="mt-3 max-w-sm text-ink/65">Tap the bookmark on any look to save it, then choose a collection.</p>
            <Link to="/discover" className="btn btn-dark mt-8">
              Discover looks
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
