/**
 * Core domain model for FORME.
 *
 * Everything the UI renders is described by these shapes. All sample content lives in
 * `src/data/*`, so a backend (REST, CMS, Supabase…) can later replace those modules
 * without touching any component.
 */

export type Formality = 1 | 2 | 3 | 4 // Casual · Smart Casual · Business · Formal

export type AestheticId =
  | 'minimalist'
  | 'old-money'
  | 'smart-casual'
  | 'streetwear'
  | 'quiet-luxury'
  | 'gen-z'
  | 'classic-formal'
  | 'afro-modern'
  | 'casual-essentials'

export type OccasionId =
  | 'everyday'
  | 'university'
  | 'office'
  | 'church'
  | 'date-night'
  | 'weddings'
  | 'parties'
  | 'travel'
  | 'formal'

export type ClothingType =
  | 'Tailoring'
  | 'Knitwear'
  | 'Outerwear'
  | 'Denim'
  | 'Tees & Polos'
  | 'Shirts'
  | 'Traditional'
  | 'Trousers'

export type PaletteFamily =
  | 'Neutrals'
  | 'Earth tones'
  | 'Monochrome'
  | 'Blues'
  | 'Black & grey'
  | 'Wine & burgundy'
  | 'Statement'

export type Slot = 'top' | 'layer' | 'bottom' | 'shoes' | 'accessory'

export type GarmentKind =
  | 'tee'
  | 'polo'
  | 'shirt'
  | 'knit'
  | 'turtleneck'
  | 'blazer'
  | 'coat'
  | 'overshirt'
  | 'tunic'
  | 'trousers'
  | 'jeans'
  | 'loafers'
  | 'boots'
  | 'sneakers'
  | 'belt'
  | 'watch'
  | 'sunglasses'
  | 'hat'
  | 'tie'
  | 'bag'
  | 'cap'

export interface NamedColor {
  key: string
  name: string
  hex: string
}

export interface PaletteSwatch extends NamedColor {
  role: 'Base' | 'Support' | 'Accent' | 'Anchor'
}

/** A reusable piece of clothing, e.g. “Cream knitted polo”. */
export interface ItemTemplate {
  key: string
  name: string
  slot: Slot
  icon: GarmentKind
  color: NamedColor
  fabric: string
  fit: string
  note: string
  alternatives: string[]
}

/** A resolved piece inside a specific outfit. */
export interface OutfitItem extends ItemTemplate {
  outfitNote: string
}

export interface Outfit {
  id: string
  number: number
  title: string
  summary: string
  aesthetic: AestheticId
  aestheticTags: AestheticId[]
  occasion: OccasionId
  occasions: OccasionId[]
  formality: Formality
  moods: string[]
  clothingTypes: ClothingType[]
  paletteFamilies: PaletteFamily[]
  image: { id: string; ratio: number; focus: string; alt: string }
  palette: PaletteSwatch[]
  paletteRelation: string
  paletteNote: string
  items: OutfitItem[]
  logic: string
  why: { silhouette: string; proportions: string; colorBalance: string; formality: string; accessories: string }
}

export interface Aesthetic {
  id: AestheticId
  name: string
  tagline: string
  description: string
  outfitId: string
  signature: string[]
  palette: string[]
}

export interface Occasion {
  id: OccasionId
  name: string
  blurb: string
  outfitId: string
  formality: Formality[]
  dressCode: string
}

export interface GuideSection {
  heading: string
  body: string
}

export interface Guide {
  id: string
  title: string
  dek: string
  category: string
  readTime: string
  image: { id: string; focus: string; alt: string }
  intro: string
  sections: GuideSection[]
  takeaway: string
  relatedOutfitIds: string[]
}

export const FORMALITY_LABELS: Record<Formality, string> = {
  1: 'Casual',
  2: 'Smart Casual',
  3: 'Business',
  4: 'Formal',
}
