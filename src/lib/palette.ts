import { COLORS, colorDistance, hexToHsl, hslToHex, isDark, nearestNamedColor } from '../data/colors'
import { OUTFITS } from '../data/outfits'
import type { GarmentKind, NamedColor, Outfit } from '../types'

/**
 * Color Lab engine — fully deterministic front-end logic.
 * Base colour × palette mode (× season) → a complete wearable recipe.
 */

export type PaletteMode = 'neutral' | 'earth' | 'mono' | 'contrast' | 'seasonal'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const BASE_COLORS = [
  'navy', 'olive', 'chocolate', 'black', 'burgundy', 'lightblue',
  'cream', 'stone', 'charcoal', 'camel', 'forest', 'rust',
] as const

export const MODES: { id: PaletteMode; label: string; blurb: string }[] = [
  { id: 'neutral', label: 'Neutral', blurb: 'Quiet, versatile pairings built on creams, greys and darks.' },
  { id: 'earth', label: 'Earth tone', blurb: 'Warm, natural colours drawn from soil, leather and leaf.' },
  { id: 'mono', label: 'Monochromatic', blurb: 'One hue worn in several depths for a long, elegant line.' },
  { id: 'contrast', label: 'Contrasting', blurb: 'A deliberate warm-versus-cool pairing with one bold note.' },
  { id: 'seasonal', label: 'Seasonal', blurb: 'The colours that feel right for the time of year.' },
]

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'spring', label: 'Spring' },
  { id: 'summer', label: 'Summer' },
  { id: 'autumn', label: 'Autumn' },
  { id: 'winter', label: 'Winter' },
]

type Role = 'top' | 'bottom' | 'shoes' | 'acc' | 'layer'

/** Which garment each base colour naturally occupies */
const BASE_ROLE: Record<string, Role> = {
  navy: 'bottom', olive: 'bottom', chocolate: 'bottom', black: 'bottom', stone: 'bottom', charcoal: 'bottom',
  burgundy: 'top', lightblue: 'top', cream: 'top', forest: 'top', rust: 'top',
  camel: 'layer',
}

type Recipe = [top: string, bottom: string, shoes: string, acc: string, layer: string]

/** Curated recipes: base → mode → [top, bottom, shoes, accessory (belt/watch), layer] */
const TABLE: Record<string, Partial<Record<'neutral' | 'earth' | 'contrast', Recipe>>> = {
  navy: {
    neutral: ['cream', 'navy', 'espresso', 'espresso', 'stone'],
    earth: ['sand', 'navy', 'brown', 'brown', 'camel'],
    contrast: ['cream', 'navy', 'tan', 'tan', 'rust'],
  },
  olive: {
    neutral: ['ivory', 'olive', 'espresso', 'espresso', 'stone'],
    earth: ['beige', 'olive', 'chocolate', 'chocolate', 'camel'],
    contrast: ['cream', 'olive', 'brown', 'brown', 'burgundy'],
  },
  chocolate: {
    neutral: ['ivory', 'chocolate', 'espresso', 'espresso', 'stone'],
    earth: ['cream', 'chocolate', 'brown', 'brown', 'camel'],
    contrast: ['lightblue', 'chocolate', 'espresso', 'espresso', 'navy'],
  },
  black: {
    neutral: ['white', 'black', 'black', 'black', 'charcoal'],
    earth: ['cream', 'black', 'espresso', 'espresso', 'camel'],
    contrast: ['lightblue', 'black', 'black', 'black', 'rust'],
  },
  burgundy: {
    neutral: ['burgundy', 'charcoal', 'black', 'black', 'grey'],
    earth: ['burgundy', 'khaki', 'brown', 'brown', 'camel'],
    contrast: ['burgundy', 'olive', 'espresso', 'espresso', 'forest'],
  },
  lightblue: {
    neutral: ['lightblue', 'stone', 'brown', 'brown', 'grey'],
    earth: ['lightblue', 'khaki', 'brown', 'brown', 'camel'],
    contrast: ['lightblue', 'tan', 'chocolate', 'chocolate', 'rust'],
  },
  cream: {
    neutral: ['cream', 'charcoal', 'espresso', 'espresso', 'stone'],
    earth: ['cream', 'olive', 'espresso', 'espresso', 'camel'],
    contrast: ['cream', 'navy', 'brown', 'brown', 'burgundy'],
  },
  stone: {
    neutral: ['white', 'stone', 'tan', 'tan', 'charcoal'],
    earth: ['rust', 'stone', 'brown', 'brown', 'olive'],
    contrast: ['navy', 'stone', 'espresso', 'espresso', 'forest'],
  },
  charcoal: {
    neutral: ['ivory', 'charcoal', 'black', 'black', 'lightgrey'],
    earth: ['oatmeal', 'charcoal', 'espresso', 'espresso', 'camel'],
    contrast: ['lightblue', 'charcoal', 'espresso', 'espresso', 'rust'],
  },
  camel: {
    neutral: ['white', 'black', 'black', 'black', 'camel'],
    earth: ['cream', 'chocolate', 'espresso', 'espresso', 'camel'],
    contrast: ['lightblue', 'navy', 'brown', 'brown', 'camel'],
  },
  forest: {
    neutral: ['forest', 'stone', 'espresso', 'espresso', 'charcoal'],
    earth: ['forest', 'khaki', 'brown', 'brown', 'camel'],
    contrast: ['forest', 'tan', 'espresso', 'espresso', 'burgundy'],
  },
  rust: {
    neutral: ['rust', 'charcoal', 'espresso', 'espresso', 'stone'],
    earth: ['rust', 'olive', 'brown', 'brown', 'camel'],
    contrast: ['rust', 'navy', 'espresso', 'espresso', 'lightblue'],
  },
}

const SEASON_SETS: Record<Season, Record<Role, string[]>> = {
  spring: { top: ['cream', 'lightblue'], bottom: ['stone', 'khaki'], shoes: ['tan', 'brown'], acc: ['tan'], layer: ['sage', 'skyblue'] },
  summer: { top: ['white', 'skyblue'], bottom: ['sand', 'white'], shoes: ['tan', 'white'], acc: ['tan'], layer: ['stone', 'lightblue'] },
  autumn: { top: ['oatmeal', 'rust'], bottom: ['chocolate', 'olive'], shoes: ['brown', 'espresso'], acc: ['brown'], layer: ['camel', 'moss'] },
  winter: { top: ['ivory', 'grey'], bottom: ['charcoal', 'navy'], shoes: ['espresso', 'black'], acc: ['espresso'], layer: ['burgundy', 'stone'] },
}

export interface CuratedCombo {
  id: string
  name: string
  base: string
  mode: PaletteMode
  recipe: Recipe
  note: string
}

export const CURATED_COMBOS: CuratedCombo[] = [
  { id: 'navy-cream', name: 'Navy + Cream', base: 'navy', mode: 'neutral', recipe: ['cream', 'navy', 'espresso', 'espresso', 'stone'], note: 'A deep cool against a soft warm. The most flattering pairing in menswear.' },
  { id: 'olive-beige', name: 'Olive + Beige', base: 'olive', mode: 'earth', recipe: ['beige', 'olive', 'chocolate', 'chocolate', 'camel'], note: 'Earthy and grown-up: olive trousers, beige knit, brown leather.' },
  { id: 'chocolate-offwhite', name: 'Chocolate Brown + Off-White', base: 'chocolate', mode: 'neutral', recipe: ['ivory', 'chocolate', 'espresso', 'espresso', 'stone'], note: 'Richer than black and white. Ideal for autumn tailoring.' },
  { id: 'black-charcoal', name: 'Black + Charcoal', base: 'black', mode: 'mono', recipe: ['charcoal', 'black', 'black', 'black', 'grey'], note: 'Tonal darks for evenings. Vary texture, not colour.' },
  { id: 'burgundy-grey', name: 'Burgundy + Grey', base: 'burgundy', mode: 'neutral', recipe: ['burgundy', 'charcoal', 'black', 'black', 'grey'], note: 'A single rich colour on a quiet grey ground.' },
  { id: 'lightblue-stone', name: 'Light Blue + Stone', base: 'lightblue', mode: 'neutral', recipe: ['lightblue', 'stone', 'brown', 'brown', 'grey'], note: 'Cool pastel, warm neutral. The calm summer pairing.' },
]

export interface RecipePiece {
  slot: 'Shirt' | 'Trousers' | 'Shoes' | 'Accessories' | 'Layer'
  icon: GarmentKind
  color: NamedColor
}

export interface Variation {
  name: string
  occasion: string
  pieces: RecipePiece[]
}

export interface LabResult {
  base: NamedColor
  mode: PaletteMode
  title: string
  explanation: string
  swatches: (NamedColor & { role: string })[]
  recipe: RecipePiece[]
  variations: Variation[]
  matchingOutfits: Outfit[]
}

const c = (key: string): NamedColor => {
  const found = COLORS[key]
  if (!found) throw new Error(`Unknown colour ${key}`)
  return found
}

/** generated tonal shades for the monochromatic mode */
const tone = (baseHex: string, lightnessShift: number, satFactor = 1): NamedColor => {
  const [h, s, l] = hexToHsl(baseHex)
  const hex = hslToHex(h, Math.min(100, s * satFactor), Math.max(6, Math.min(94, l + lightnessShift)))
  const near = nearestNamedColor(hex)
  return { key: `gen-${hex}`, name: near.name, hex }
}

/** Generated tonal shades can resolve to the same library name; keep names unique per distinct hex. */
const dedupeNames = (list: NamedColor[]): NamedColor[] => {
  const seen = new Map<string, string[]>() // name -> distinct hexes
  return list.map((col) => {
    const hexes = seen.get(col.name) ?? []
    let idx = hexes.indexOf(col.hex)
    if (idx === -1) {
      hexes.push(col.hex)
      idx = hexes.length - 1
    }
    seen.set(col.name, hexes)
    return idx === 0 ? col : { ...col, name: `${col.name} ${idx === 1 ? 'tone' : 'shade'}` }
  })
}

const recipeFor = (baseKey: string, mode: PaletteMode, season: Season): NamedColor[] => {
  const base = c(baseKey)
  if (mode === 'mono') {
    const dark = isDark(base.hex)
    const [, , l] = hexToHsl(base.hex)
    const top = dark ? tone(base.hex, 40, 0.55) : base
    const bottom = dark ? base : tone(base.hex, -(l > 70 ? 38 : 28), 0.85)
    const shoes = dark ? tone(base.hex, -10, 0.75) : tone(base.hex, -(l > 70 ? 52 : 40), 0.9)
    const layer = dark ? tone(base.hex, 15, 0.8) : tone(base.hex, -20, 0.9)
    return [top, bottom, shoes, shoes, layer]
  }
  if (mode === 'seasonal') {
    const role = BASE_ROLE[baseKey] ?? 'bottom'
    const set = SEASON_SETS[season]
    const pick = (r: Role): string => {
      if (r === role) return baseKey
      const options = set[r]
      return options.find((k) => colorDistance(c(k).hex, base.hex) > 16) ?? options[options.length - 1]
    }
    return [pick('top'), pick('bottom'), pick('shoes'), pick('acc'), pick('layer')].map(c)
  }
  return (TABLE[baseKey]?.[mode] ?? TABLE.navy.neutral!).map(c)
}

const MODE_COPY: Record<PaletteMode, (base: string) => string> = {
  neutral: (b) => `${b} is paired with quiet neutrals so the colour reads as a deliberate choice rather than a statement. Keep the lightest piece near the face and the darkest at the feet.`,
  earth: (b) => `${b} is warmed with natural tones — sand, tan, brown and camel — that all share a yellow-red undertone, which is why they never clash.`,
  mono: (b) => `Stay inside the ${b} family and change only the depth: lighter near the face, deeper toward the shoes. The eye reads one long, confident line.`,
  contrast: (b) => `${b} is balanced with a warmer or cooler opposite for energy. Use the contrasting colour once — on a layer or a single accessory — and keep the rest quiet.`,
  seasonal: (b) => `${b} is blended with colours that suit the time of year: lighter and fresher in warm months, deeper and richer when it gets cold.`,
}

export const buildLab = (baseKey: string, mode: PaletteMode, season: Season, combo?: CuratedCombo | null): LabResult => {
  const base = c(baseKey)
  const colors = combo ? combo.recipe.map(c) : recipeFor(baseKey, mode, season)
  const [top, bottom, shoes, acc, layer] = dedupeNames(colors)

  const recipe: RecipePiece[] = [
    { slot: 'Shirt', icon: mode === 'mono' || /burgundy|forest|rust/.test(baseKey) ? 'knit' : 'shirt', color: top },
    { slot: 'Trousers', icon: 'trousers', color: bottom },
    { slot: 'Shoes', icon: isDark(shoes.hex) ? 'loafers' : 'sneakers', color: shoes },
    { slot: 'Accessories', icon: 'belt', color: acc },
    { slot: 'Layer', icon: 'blazer', color: layer },
  ]

  // swatches: unique colours in the recipe, ordered light -> dark with roles
  const unique: NamedColor[] = []
  for (const col of [top, bottom, layer, shoes, acc]) {
    if (!unique.some((u) => colorDistance(u.hex, col.hex) < 8)) unique.push(col)
  }
  const baseHex = base.hex
  const swatches = unique.slice(0, 5).map((col, i) => ({
    ...col,
    role:
      colorDistance(col.hex, baseHex) < 14 ? 'Base' : i === unique.length - 1 && isDark(col.hex) ? 'Anchor' : i === 1 ? 'Support' : 'Accent',
  }))

  const variations: Variation[] = [
    {
      name: 'The Everyday',
      occasion: 'Casual · Weekend',
      pieces: [
        { slot: 'Shirt', icon: 'polo', color: top },
        { slot: 'Trousers', icon: 'trousers', color: bottom },
        { slot: 'Shoes', icon: isDark(shoes.hex) ? 'loafers' : 'sneakers', color: shoes },
        { slot: 'Accessories', icon: 'belt', color: acc },
      ],
    },
    {
      name: 'The Layered',
      occasion: 'Smart casual · Dinner',
      pieces: [
        { slot: 'Layer', icon: 'overshirt', color: layer },
        { slot: 'Shirt', icon: 'tee', color: top },
        { slot: 'Trousers', icon: 'trousers', color: bottom },
        { slot: 'Shoes', icon: 'boots', color: shoes },
      ],
    },
    {
      name: 'The Considered',
      occasion: 'Business · Event',
      pieces: [
        { slot: 'Layer', icon: 'blazer', color: isDark(bottom.hex) ? bottom : layer },
        { slot: 'Shirt', icon: 'shirt', color: isDark(top.hex) ? layer : top },
        { slot: 'Trousers', icon: 'trousers', color: isDark(bottom.hex) ? bottom : layer },
        { slot: 'Shoes', icon: 'loafers', color: shoes },
      ],
    },
  ]

  // real gallery looks whose palette is closest to this one
  const matches = OUTFITS.map((o) => ({
    o,
    d:
      unique.reduce((sum, u) => sum + Math.min(...o.palette.map((p) => colorDistance(u.hex, p.hex))), 0) / unique.length,
  }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 4)
    .map((m) => m.o)

  const title = combo ? combo.name : `${base.name} · ${MODES.find((m) => m.id === mode)!.label}${mode === 'seasonal' ? ` · ${SEASONS.find((s) => s.id === season)!.label}` : ''}`

  return {
    base,
    mode,
    title,
    explanation: combo ? combo.note : MODE_COPY[mode](base.name),
    swatches,
    recipe,
    variations,
    matchingOutfits: matches,
  }
}
