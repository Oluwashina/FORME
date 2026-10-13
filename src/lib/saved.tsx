import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'

/**
 * Saved looks & collections.
 *
 * Data model (v1) is intentionally normalised and ID-based so it maps 1:1 to two backend tables:
 *   collections(id, name, created_at)        ↔  Collection
 *   saved_looks(outfit_id, collection_ids[]) ↔  SavedEntry   (user_id would be added server-side)
 *
 * Persistence is isolated behind `SavedStore`. Swap `localStorageStore` for an API-backed store
 * later without touching any component.
 */

export interface Collection {
  id: string
  name: string
  createdAt: string
}

export interface SavedEntry {
  outfitId: string
  collectionIds: string[]
  savedAt: string
}

export interface SavedState {
  version: 1
  collections: Collection[]
  entries: SavedEntry[]
}

export interface SavedStore {
  load(): SavedState
  save(state: SavedState): void
  subscribe?(onExternalChange: () => void): () => void
}

const KEY = 'forme.saved.v1'

const DEFAULT_COLLECTIONS = ['Everyday Fits', 'Workwear', 'Date Night', 'Wedding Inspiration', 'Future Purchases']

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const seedState = (): SavedState => ({
  version: 1,
  collections: DEFAULT_COLLECTIONS.map((name) => ({ id: slug(name), name, createdAt: new Date(0).toISOString() })),
  entries: [],
})

export const localStorageStore: SavedStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return seedState()
      const parsed = JSON.parse(raw) as SavedState
      if (parsed?.version !== 1 || !Array.isArray(parsed.collections) || !Array.isArray(parsed.entries)) return seedState()
      return parsed
    } catch {
      return seedState()
    }
  },
  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode / quota) — fail silently */
    }
  },
  subscribe(cb) {
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) cb()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  },
}

type Action =
  | { type: 'replace'; state: SavedState }
  | { type: 'save'; outfitId: string }
  | { type: 'remove'; outfitId: string }
  | { type: 'toggle-collection'; outfitId: string; collectionId: string }
  | { type: 'create-collection'; collection: Collection }
  | { type: 'rename-collection'; id: string; name: string }
  | { type: 'delete-collection'; id: string }

const reducer = (state: SavedState, action: Action): SavedState => {
  const now = new Date().toISOString()
  switch (action.type) {
    case 'replace':
      return action.state
    case 'save':
      if (state.entries.some((e) => e.outfitId === action.outfitId)) return state
      return { ...state, entries: [{ outfitId: action.outfitId, collectionIds: [], savedAt: now }, ...state.entries] }
    case 'remove':
      return { ...state, entries: state.entries.filter((e) => e.outfitId !== action.outfitId) }
    case 'toggle-collection': {
      const existing = state.entries.find((e) => e.outfitId === action.outfitId)
      if (!existing) {
        return {
          ...state,
          entries: [{ outfitId: action.outfitId, collectionIds: [action.collectionId], savedAt: now }, ...state.entries],
        }
      }
      const has = existing.collectionIds.includes(action.collectionId)
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.outfitId === action.outfitId
            ? {
                ...e,
                collectionIds: has
                  ? e.collectionIds.filter((c) => c !== action.collectionId)
                  : [...e.collectionIds, action.collectionId],
              }
            : e,
        ),
      }
    }
    case 'create-collection':
      return { ...state, collections: [...state.collections, action.collection] }
    case 'rename-collection':
      return {
        ...state,
        collections: state.collections.map((c) => (c.id === action.id ? { ...c, name: action.name } : c)),
      }
    case 'delete-collection':
      return {
        collections: state.collections.filter((c) => c.id !== action.id),
        version: 1,
        entries: state.entries.map((e) => ({ ...e, collectionIds: e.collectionIds.filter((c) => c !== action.id) })),
      }
    default:
      return state
  }
}

interface SavedApi {
  state: SavedState
  isSaved: (outfitId: string) => boolean
  collectionsFor: (outfitId: string) => string[]
  saveOutfit: (outfitId: string) => void
  removeOutfit: (outfitId: string) => void
  toggleCollection: (outfitId: string, collectionId: string) => void
  createCollection: (name: string) => string | null
  renameCollection: (id: string, name: string) => void
  deleteCollection: (id: string) => void
  count: number
}

const Ctx = createContext<SavedApi | null>(null)

export function SavedProvider({ children, store = localStorageStore }: { children: ReactNode; store?: SavedStore }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => store.load())

  useEffect(() => {
    store.save(state)
  }, [state, store])

  useEffect(() => store.subscribe?.(() => dispatch({ type: 'replace', state: store.load() })), [store])

  const isSaved = useCallback((id: string) => state.entries.some((e) => e.outfitId === id), [state.entries])
  const collectionsFor = useCallback(
    (id: string) => state.entries.find((e) => e.outfitId === id)?.collectionIds ?? [],
    [state.entries],
  )

  const api = useMemo<SavedApi>(
    () => ({
      state,
      isSaved,
      collectionsFor,
      saveOutfit: (outfitId) => dispatch({ type: 'save', outfitId }),
      removeOutfit: (outfitId) => dispatch({ type: 'remove', outfitId }),
      toggleCollection: (outfitId, collectionId) => dispatch({ type: 'toggle-collection', outfitId, collectionId }),
      createCollection: (name) => {
        const clean = name.trim().slice(0, 40)
        if (!clean) return null
        const existing = state.collections.find((c) => c.name.toLowerCase() === clean.toLowerCase())
        if (existing) return existing.id
        let id = slug(clean) || 'collection'
        if (state.collections.some((c) => c.id === id)) id = `${id}-${Date.now().toString(36)}`
        dispatch({ type: 'create-collection', collection: { id, name: clean, createdAt: new Date().toISOString() } })
        return id
      },
      renameCollection: (id, name) => {
        const clean = name.trim().slice(0, 40)
        if (clean) dispatch({ type: 'rename-collection', id, name: clean })
      },
      deleteCollection: (id) => dispatch({ type: 'delete-collection', id }),
      count: state.entries.length,
    }),
    [state, isSaved, collectionsFor],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSaved = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSaved must be used within SavedProvider')
  return ctx
}
