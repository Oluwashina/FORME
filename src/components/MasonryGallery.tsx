import { useEffect, useMemo, useState } from 'react'
import type { Outfit } from '../types'
import { OutfitCard } from './OutfitCard'

const useColumnCount = () => {
  const get = () => {
    if (typeof window === 'undefined') return 3
    const w = window.innerWidth
    return w >= 1280 ? 4 : w >= 768 ? 3 : 2
  }
  const [cols, setCols] = useState(get)
  useEffect(() => {
    const onResize = () => setCols(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

interface Props {
  outfits: Outfit[]
  /** how many items have already been shown — only newer ones animate in */
  animateFrom?: number
}

/**
 * Pinterest-style masonry. Items are assigned to the shortest column using each
 * photograph's known aspect ratio, so appending ("Load more") never reshuffles
 * what is already on screen — unlike CSS multi-column layouts.
 */
export function MasonryGallery({ outfits, animateFrom = 0 }: Props) {
  const colCount = useColumnCount()

  const columns = useMemo(() => {
    const cols: { height: number; items: { outfit: Outfit; index: number }[] }[] = Array.from({ length: colCount }, () => ({
      height: 0,
      items: [],
    }))
    const CAPTION = 0.42 // caption height relative to column width
    outfits.forEach((outfit, index) => {
      let target = cols[0]
      for (const c of cols) if (c.height < target.height - 0.001) target = c
      target.items.push({ outfit, index })
      target.height += 1 / outfit.image.ratio + CAPTION
    })
    return cols
  }, [outfits, colCount])

  return (
    <div className="flex items-start gap-4 md:gap-6 xl:gap-7">
      {columns.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-1 flex-col gap-8 md:gap-10">
          {col.items.map(({ outfit, index }) => (
            <div
              key={outfit.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(Math.max(0, index - animateFrom), 11) * 70}ms` }}
            >
              <OutfitCard outfit={outfit} priority={index < 4} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
