import { useSearchParams } from 'react-router-dom'
import { Photo } from '../components/Photo'
import { OUTFITS } from '../data/outfits'

export function QaPage() {
  const [params] = useSearchParams()
  const ids = params.get('ids')?.split(',')
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {ids
        ? ids.map((id) => (
            <div key={id} className="text-[10px] leading-tight">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <Photo id={id} alt="" focus="center 30%" priority />
              </div>
              <b>{id}</b>
            </div>
          ))
        : OUTFITS.map((o) => (
            <div key={o.id} className="text-[10px] leading-tight">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <Photo id={o.image.id} alt="" focus={o.image.focus} priority />
              </div>
              <b>#{o.number} {o.id}</b>
              <div>{o.items.map((i) => i.name).join(' · ')}</div>
            </div>
          ))}
    </div>
  )
}
