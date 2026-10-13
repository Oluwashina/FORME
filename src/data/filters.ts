import type { ClothingType, Formality, PaletteFamily } from '../types'
import { FORMALITY_LABELS } from '../types'
import { AESTHETICS, OCCASIONS } from './aesthetics'

export interface FilterOption {
  value: string
  label: string
  swatch?: string
}

export interface FilterGroup {
  key: 'aesthetic' | 'occasion' | 'clothing' | 'palette' | 'formality'
  label: string
  options: FilterOption[]
}

export const CLOTHING_TYPES: ClothingType[] = ['Tailoring', 'Knitwear', 'Outerwear', 'Denim', 'Tees & Polos', 'Shirts', 'Trousers', 'Traditional']

export const PALETTE_FAMILIES: { value: PaletteFamily; swatch: string }[] = [
  { value: 'Neutrals', swatch: '#D6CFC1' },
  { value: 'Earth tones', swatch: '#A07E58' },
  { value: 'Monochrome', swatch: '#252522' },
  { value: 'Blues', swatch: '#3F5F8A' },
  { value: 'Black & grey', swatch: '#6B6C6E' },
  { value: 'Wine & burgundy', swatch: '#6D1F2B' },
  { value: 'Statement', swatch: '#C4A03D' },
]

export const FILTER_GROUPS: FilterGroup[] = [
  { key: 'aesthetic', label: 'Aesthetic', options: AESTHETICS.map((a) => ({ value: a.id, label: a.name })) },
  { key: 'occasion', label: 'Occasion', options: OCCASIONS.map((o) => ({ value: o.id, label: o.name })) },
  { key: 'clothing', label: 'Clothing', options: CLOTHING_TYPES.map((c) => ({ value: c, label: c })) },
  { key: 'palette', label: 'Palette', options: PALETTE_FAMILIES.map((p) => ({ value: p.value, label: p.value, swatch: p.swatch })) },
  {
    key: 'formality',
    label: 'Formality',
    options: ([1, 2, 3, 4] as Formality[]).map((f) => ({ value: String(f), label: FORMALITY_LABELS[f] })),
  },
]

export const SEARCH_SUGGESTIONS = ['Navy', 'Wedding', 'Coffee', 'Earth tones', 'Linen', 'Burgundy', 'Date night', 'Turtleneck']
