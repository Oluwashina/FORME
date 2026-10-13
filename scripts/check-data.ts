import { OUTFITS, OUTFIT_BY_ID } from '../src/data/outfits'
import { AESTHETICS, OCCASIONS } from '../src/data/aesthetics'
import { GUIDES } from '../src/data/guides'
import { HERO_ITEMS } from '../src/data/buildAround'
import { ITEM_CATALOG } from '../src/data/items'
import { BASE_COLORS, buildLab, CURATED_COMBOS, MODES, SEASONS } from '../src/lib/palette'
import { computeResult } from '../src/lib/quiz'
import { photoUrl } from '../src/lib/photo'

const problems: string[] = []
const need = (id: string, where: string) => { if (!OUTFIT_BY_ID[id]) problems.push(`missing outfit ${id} (${where})`) }
AESTHETICS.forEach((a) => need(a.outfitId, 'aesthetic ' + a.id))
OCCASIONS.forEach((o) => need(o.outfitId, 'occasion ' + o.id))
GUIDES.forEach((g) => g.relatedOutfitIds.forEach((i) => need(i, 'guide ' + g.id)))
HERO_ITEMS.forEach((h) => {
  if (!ITEM_CATALOG[h.key]) problems.push('hero item ' + h.key)
  Object.values(h.partners).flat().forEach((k) => !ITEM_CATALOG[k] && problems.push(`partner ${k} in ${h.key}`))
  h.combos.forEach((c) => { c.pieces.forEach((k) => !ITEM_CATALOG[k] && problems.push(`combo piece ${k} in ${h.key}`)); if (c.outfitId) need(c.outfitId, 'combo ' + c.title) })
})
const dup = OUTFITS.map((o) => o.image.id).filter((x, i, a) => a.indexOf(x) !== i)
if (dup.length) problems.push('dup images ' + dup.join())
for (const b of BASE_COLORS) for (const m of MODES) for (const s of SEASONS) { try { buildLab(b, m.id, s.id) } catch (e) { problems.push(`lab ${b}/${m.id}: ${e}`) } }
CURATED_COMBOS.forEach((c) => { try { buildLab(c.base, c.mode, 'autumn', c) } catch (e) { problems.push('combo ' + c.id + e) } })
const r = computeResult({ aesthetics: ['minimalist'], occasions: ['office'], colors: ['neutrals'], fit: ['tailored'], budget: ['mid'], climate: ['mild'], lifestyle: ['office'] })
r.outfitIds.forEach((i) => need(i, 'quiz'))
console.log('outfits', OUTFITS.length, 'quiz top', r.aesthetics.map((a) => a.id).join())

const urls = [...new Set([...OUTFITS.map((o) => o.image.id), ...GUIDES.map((g) => g.image.id), '1557342892-93950a8caa84'])]
let bad = 0
await Promise.all(urls.map(async (id) => { const res = await fetch(photoUrl(id, 400), { method: 'HEAD' }); if (!res.ok) { bad++; problems.push(`image ${id} ${res.status}`) } }))
console.log('images checked', urls.length, 'bad', bad)
console.log(problems.length ? problems.join('\n') : 'ALL OK')
