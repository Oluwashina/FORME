import { AESTHETIC_BY_ID } from '../data/aesthetics'
import { color } from '../data/colors'
import { OUTFITS } from '../data/outfits'
import {
  CLIMATE_WEIGHTS,
  COLOR_FAMILIES,
  COLOR_WEIGHTS,
  FIT_WEIGHTS,
  LIFESTYLE_WEIGHTS,
  OCCASION_WEIGHTS,
  type Weights,
} from '../data/quiz'
import type { AestheticId, NamedColor, Outfit } from '../types'

export type QuizAnswers = Partial<Record<'aesthetics' | 'occasions' | 'colors' | 'fit' | 'budget' | 'climate' | 'lifestyle', string[]>>

export interface QuizResult {
  answers: QuizAnswers
  aesthetics: { id: AestheticId; score: number; share: number }[]
  palettes: { name: string; swatches: NamedColor[] }[]
  outfitIds: string[]
  starterKeys: string[]
  fitLabel: string
  budgetTip: string
  climateTip: string
}

const add = (target: Record<string, number>, weights: Weights | undefined, multiplier = 1) => {
  if (!weights) return
  for (const [k, v] of Object.entries(weights)) target[k] = (target[k] ?? 0) + (v ?? 0) * multiplier
}

const FIT_LABELS: Record<string, string> = {
  relaxed: 'Relaxed and roomy: look for drape, volume with intent, and soft fabrics.',
  easy: 'Easy and soft: straight cuts, natural fabrics and nothing that pinches.',
  balanced: 'Balanced: a structured piece on top, a relaxed one below (or vice versa).',
  tailored: 'Tailored: a defined shoulder, a clean taper and a tailor on speed dial.',
  sharp: 'Sharp: precise cuts, pressed finishes and well-kept leather.',
}

const BUDGET_TIPS: Record<string, string> = {
  lean: 'Start with the essentials and spend the most on fit: a tailor costs less than a new wardrobe and improves every piece you own.',
  mid: 'Keep tees and trousers affordable, and put your budget into the pieces you wear most: shoes, a coat and one good knit.',
  invest: 'Buy fewer, better pieces: natural fibres, solid construction, timeless cuts. A coat and loafers you keep for years beat five you replace.',
}

const CLIMATE_TIPS: Record<string, string> = {
  warm: 'Prioritise linen, cotton–linen blends and open collars. Light colours reflect heat and look fresh.',
  mild: 'Build around layers you can remove: an overshirt, a light knit and a versatile jacket.',
  cold: 'Invest in a proper coat and a few merino knits. Dark neutrals and rich browns carry winter beautifully.',
  mixed: 'Think in two wardrobes: light and breathable for summer, textured and layered for winter, with shared colours so they work together.',
}

export const computeResult = (answers: QuizAnswers): QuizResult => {
  const scores: Record<string, number> = {}
  for (const id of answers.aesthetics ?? []) scores[id] = (scores[id] ?? 0) + 3
  for (const id of answers.occasions ?? []) add(scores, OCCASION_WEIGHTS[id])
  for (const id of answers.colors ?? []) add(scores, COLOR_WEIGHTS[id])
  const fit = answers.fit?.[0]
  if (fit) add(scores, FIT_WEIGHTS[fit]?.weights)
  const climate = answers.climate?.[0]
  if (climate) add(scores, CLIMATE_WEIGHTS[climate])
  const lifestyle = answers.lifestyle?.[0]
  if (lifestyle) add(scores, LIFESTYLE_WEIGHTS[lifestyle])

  const ranked = (Object.keys(AESTHETIC_BY_ID) as AestheticId[])
    .map((id) => ({ id, score: scores[id] ?? 0 }))
    // stable tie-break: earlier selections first, then catalogue order
    .sort((a, b) => b.score - a.score || (answers.aesthetics ?? []).indexOf(a.id) - (answers.aesthetics ?? []).indexOf(b.id))
  const top = ranked.slice(0, 3)
  const total = top.reduce((s, t) => s + t.score, 0) || 1
  const aesthetics = top.map((t) => ({ ...t, share: Math.round((t.score / total) * 100) }))

  /* palettes: aesthetic palettes + answers */
  const palettes = aesthetics.map((a) => ({
    name: AESTHETIC_BY_ID[a.id].name,
    swatches: AESTHETIC_BY_ID[a.id].palette.map(color),
  }))
  const chosenColors = answers.colors ?? []
  if (chosenColors.length) {
    const keys = [...new Set(chosenColors.flatMap((c) => COLOR_FAMILIES[c]?.keys.slice(0, 2) ?? []))].slice(0, 5)
    if (keys.length >= 3) palettes.unshift({ name: 'Your colours', swatches: keys.map(color) })
  }

  /* outfits */
  const targetFormality = fit ? FIT_WEIGHTS[fit].formality : 2
  const wantedFamilies = new Set(chosenColors.flatMap((c) => COLOR_FAMILIES[c]?.families ?? []))
  const occasions = new Set(answers.occasions ?? [])

  const scoreOutfit = (o: Outfit) => {
    let s = 0
    aesthetics.forEach((a, i) => {
      const w = [5, 3, 2][i]
      if (o.aesthetic === a.id) s += w
      else if (o.aestheticTags.includes(a.id)) s += w * 0.5
    })
    for (const occ of o.occasions) if (occasions.has(occ)) s += occ === o.occasion ? 2 : 1
    for (const f of o.paletteFamilies) if (wantedFamilies.has(f)) s += 1.5
    s -= Math.abs(o.formality - targetFormality) * 0.9
    const text = `${o.moods.join(' ')} ${o.clothingTypes.join(' ')}`.toLowerCase()
    if (climate === 'cold' && (text.includes('cold') || text.includes('outerwear') || text.includes('knitwear'))) s += 1.2
    if (climate === 'warm' && (text.includes('warm-weather') || text.includes('sunlit') || text.includes('breezy'))) s += 1.2
    if (climate === 'warm' && text.includes('cold-weather')) s -= 1.5
    if (climate === 'cold' && text.includes('warm-weather')) s -= 1.5
    return s
  }

  const sorted = [...OUTFITS].sort((a, b) => scoreOutfit(b) - scoreOutfit(a))
  const picked: Outfit[] = []
  const perAesthetic: Record<string, number> = {}
  for (const o of sorted) {
    if (picked.length >= 6) break
    if ((perAesthetic[o.aesthetic] ?? 0) >= 3) continue
    picked.push(o)
    perAesthetic[o.aesthetic] = (perAesthetic[o.aesthetic] ?? 0) + 1
  }

  /* starter pieces: the most re-used item archetypes among picked outfits (excluding accessories & suits) */
  const tally = new Map<string, number>()
  for (const o of picked)
    for (const i of o.items) {
      if (i.slot === 'accessory') continue
      tally.set(i.key, (tally.get(i.key) ?? 0) + 1)
    }
  const starterKeys = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k)

  return {
    answers,
    aesthetics,
    palettes: palettes.slice(0, 4),
    outfitIds: picked.map((o) => o.id),
    starterKeys,
    fitLabel: fit ? FIT_LABELS[fit] : FIT_LABELS.balanced,
    budgetTip: BUDGET_TIPS[answers.budget?.[0] ?? 'mid'],
    climateTip: CLIMATE_TIPS[climate ?? 'mild'],
  }
}

const KEY = 'forme.quiz.v1'

export const loadQuizResult = (): QuizResult | null => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { answers: QuizAnswers }
    return parsed?.answers ? computeResult(parsed.answers) : null
  } catch {
    return null
  }
}

export const saveQuizAnswers = (answers: QuizAnswers) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ answers, at: Date.now() }))
  } catch {
    /* ignore */
  }
}

export const clearQuiz = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
