import { AESTHETIC_BY_ID, OCCASION_BY_ID } from '../data/aesthetics'
import { OUTFITS } from '../data/outfits'
import { colorDistance } from '../data/colors'
import type { Outfit } from '../types'
import { FORMALITY_LABELS } from '../types'

export interface Filters {
  q: string
  aesthetic: string[]
  occasion: string[]
  clothing: string[]
  palette: string[]
  formality: string[]
}

export const EMPTY_FILTERS: Filters = { q: '', aesthetic: [], occasion: [], clothing: [], palette: [], formality: [] }

export const activeFilterCount = (f: Filters) =>
  f.aesthetic.length + f.occasion.length + f.clothing.length + f.palette.length + f.formality.length

const SYNONYMS: Record<string, string[]> = {
  work: ['office', 'business'],
  job: ['office', 'business'],
  interview: ['office', 'business'],
  wedding: ['weddings'],
  date: ['date night'],
  dinner: ['date night', 'evening'],
  holiday: ['travel'],
  vacation: ['travel'],
  uni: ['university'],
  campus: ['university'],
  school: ['university'],
  suit: ['tailoring'],
  jacket: ['outerwear', 'blazer'],
  coat: ['outerwear'],
  sweater: ['knitwear'],
  jumper: ['knitwear'],
  brown: ['chocolate', 'espresso', 'camel', 'tan'],
  green: ['olive', 'forest', 'sage', 'moss'],
  blue: ['navy', 'denim', 'indigo'],
  beige: ['sand', 'stone', 'khaki', 'cream', 'oatmeal'],
  neutral: ['neutrals', 'stone', 'cream', 'ivory'],
  earth: ['earth tones'],
  grey: ['gray', 'charcoal'],
  gray: ['grey', 'charcoal'],
}

const haystackCache = new Map<string, string>()

const haystack = (o: Outfit) => {
  const cached = haystackCache.get(o.id)
  if (cached) return cached
  const text = [
    o.title,
    o.summary,
    o.aestheticTags.map((a) => AESTHETIC_BY_ID[a].name).join(' '),
    o.occasions.map((x) => OCCASION_BY_ID[x].name).join(' '),
    o.moods.join(' '),
    o.clothingTypes.join(' '),
    o.paletteFamilies.join(' '),
    o.palette.map((p) => p.name).join(' '),
    o.items.map((i) => `${i.name} ${i.color.name} ${i.fabric}`).join(' '),
    FORMALITY_LABELS[o.formality],
  ]
    .join(' ')
    .toLowerCase()
  haystackCache.set(o.id, text)
  return text
}

const tokenMatches = (hay: string, token: string) => {
  if (hay.includes(token)) return true
  // light stemming: "weddings" ~ "wedding"
  if (token.endsWith('s') && hay.includes(token.slice(0, -1))) return true
  const syn = SYNONYMS[token]
  return !!syn && syn.some((s) => hay.includes(s))
}

export const matchesQuery = (o: Outfit, q: string) => {
  const tokens = q
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)
  if (!tokens.length) return true
  const hay = haystack(o)
  return tokens.every((t) => tokenMatches(hay, t))
}

export const filterOutfits = (f: Filters, source: Outfit[] = OUTFITS) =>
  source.filter(
    (o) =>
      matchesQuery(o, f.q) &&
      (!f.aesthetic.length || f.aesthetic.some((a) => o.aestheticTags.includes(a as Outfit['aesthetic']))) &&
      (!f.occasion.length || f.occasion.some((a) => o.occasions.includes(a as Outfit['occasion']))) &&
      (!f.clothing.length || f.clothing.some((a) => o.clothingTypes.includes(a as Outfit['clothingTypes'][number]))) &&
      (!f.palette.length || f.palette.some((a) => o.paletteFamilies.includes(a as Outfit['paletteFamilies'][number]))) &&
      (!f.formality.length || f.formality.includes(String(o.formality))),
  )

/* ---------- related outfits ---------- */

export const relatedOutfits = (outfit: Outfit, count = 3): Outfit[] => {
  const myKeys = new Set(outfit.items.map((i) => i.key))
  const scored = OUTFITS.filter((o) => o.id !== outfit.id).map((o) => {
    let score = 0
    if (o.aesthetic === outfit.aesthetic) score += 3
    score += o.aestheticTags.filter((t) => outfit.aestheticTags.includes(t)).length
    score += o.items.filter((i) => myKeys.has(i.key)).length * 1.6
    if (o.occasion === outfit.occasion) score += 1.5
    score += o.paletteFamilies.filter((p) => outfit.paletteFamilies.includes(p)).length
    // palette similarity (closer = higher)
    const dist =
      outfit.palette.reduce((sum, p) => sum + Math.min(...o.palette.map((q) => colorDistance(p.hex, q.hex))), 0) /
      outfit.palette.length
    score += Math.max(0, 3 - dist / 12)
    if (Math.abs(o.formality - outfit.formality) === 0) score += 0.8
    return { o, score }
  })
  scored.sort((a, b) => b.score - a.score)
  // avoid three identical aesthetics: prefer variety after the first
  const picked: Outfit[] = []
  for (const { o } of scored) {
    if (picked.length >= count) break
    if (picked.length >= 2 && picked.every((p) => p.aesthetic === o.aesthetic)) continue
    picked.push(o)
  }
  return picked
}
