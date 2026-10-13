import type { AestheticId } from '../types'
import { AESTHETICS, OCCASIONS } from './aesthetics'

export interface QuizOption {
  id: string
  label: string
  hint?: string
  outfitId?: string
  swatches?: string[]
}

export interface QuizQuestion {
  id: 'aesthetics' | 'occasions' | 'colors' | 'fit' | 'budget' | 'climate' | 'lifestyle'
  eyebrow: string
  title: string
  subtitle: string
  kind: 'visual' | 'swatch' | 'text'
  multi: boolean
  max?: number
  options: QuizOption[]
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'aesthetics',
    eyebrow: 'Aesthetic',
    title: 'Which of these looks feels most like you?',
    subtitle: 'Choose up to three. Go with your first instinct.',
    kind: 'visual',
    multi: true,
    max: 3,
    options: AESTHETICS.map((a) => ({ id: a.id, label: a.name, hint: a.tagline, outfitId: a.outfitId })),
  },
  {
    id: 'occasions',
    eyebrow: 'Occasions',
    title: 'Where do you need to dress well most often?',
    subtitle: 'Pick up to three.',
    kind: 'text',
    multi: true,
    max: 3,
    options: OCCASIONS.map((o) => ({ id: o.id, label: o.name, hint: o.blurb })),
  },
  {
    id: 'colors',
    eyebrow: 'Colour',
    title: 'Which colours do you find yourself reaching for?',
    subtitle: 'Choose up to three palettes.',
    kind: 'swatch',
    multi: true,
    max: 3,
    options: [
      { id: 'neutrals', label: 'Soft neutrals', hint: 'Cream, ivory, stone', swatches: ['#F2EFE9', '#D8CFBE', '#B9AE9B', '#8C8376'] },
      { id: 'earth', label: 'Earth tones', hint: 'Camel, tan, chocolate', swatches: ['#D6C6A5', '#B07F4F', '#6B4A33', '#4A3226'] },
      { id: 'blue', label: 'Navy & blues', hint: 'Navy, denim, sky', swatches: ['#1F2A44', '#3F6CA8', '#7E9BBE', '#B4C8DC'] },
      { id: 'black-grey', label: 'Black & grey', hint: 'Charcoal, graphite', swatches: ['#161616', '#36373A', '#8B8E91', '#C8C9C9'] },
      { id: 'green', label: 'Olive & green', hint: 'Olive, forest, sage', swatches: ['#2F4A3A', '#585C3A', '#69715D', '#A3AC95'] },
      { id: 'wine', label: 'Burgundy & wine', hint: 'Burgundy, plum', swatches: ['#4F1822', '#6D1F2B', '#4B2B47', '#A0522D'] },
      { id: 'bold', label: 'A bold accent', hint: 'Mustard, rust, cobalt', swatches: ['#C4A03D', '#A0522D', '#3F6CA8', '#2F5D62'] },
    ],
  },
  {
    id: 'fit',
    eyebrow: 'Fit',
    title: 'Comfort or tailoring — where do you sit?',
    subtitle: 'Think about how you like clothes to feel.',
    kind: 'text',
    multi: false,
    options: [
      { id: 'relaxed', label: 'Relaxed & roomy', hint: 'Comfort first, volume is fine' },
      { id: 'easy', label: 'Easy & soft', hint: 'Soft fabrics, straight cuts' },
      { id: 'balanced', label: 'Balanced', hint: 'Some structure, never stiff' },
      { id: 'tailored', label: 'Tailored', hint: 'I like a defined, fitted line' },
      { id: 'sharp', label: 'Sharp', hint: 'Precisely cut, always pressed' },
    ],
  },
  {
    id: 'budget',
    eyebrow: 'Budget',
    title: 'How do you prefer to build a wardrobe?',
    subtitle: 'No numbers — just an approach.',
    kind: 'text',
    multi: false,
    options: [
      { id: 'lean', label: 'Keep it lean', hint: 'Essentials first, affordable pieces' },
      { id: 'mid', label: 'Balanced', hint: 'Mix of everyday and a few better pieces' },
      { id: 'invest', label: 'Invest in fewer, better pieces', hint: 'Buy once, buy well' },
    ],
  },
  {
    id: 'climate',
    eyebrow: 'Climate',
    title: 'What is the weather like where you live?',
    subtitle: 'This shapes fabric and layering suggestions.',
    kind: 'text',
    multi: false,
    options: [
      { id: 'warm', label: 'Warm most of the year', hint: 'Light fabrics, breathable layers' },
      { id: 'mild', label: 'Mild & changeable', hint: 'Layers that adapt' },
      { id: 'cold', label: 'Cold for long stretches', hint: 'Coats, knits, heavier fabrics' },
      { id: 'mixed', label: 'Hot summers, cold winters', hint: 'A full seasonal rotation' },
    ],
  },
  {
    id: 'lifestyle',
    eyebrow: 'Lifestyle',
    title: 'Which best describes your week?',
    subtitle: 'Choose the closest match.',
    kind: 'text',
    multi: false,
    options: [
      { id: 'student', label: 'Student', hint: 'Campus, society events, late nights' },
      { id: 'office', label: 'Office or client-facing', hint: 'Meetings, presentations, business dress' },
      { id: 'creative', label: 'Creative or flexible', hint: 'Studio days, freelancing, no dress code' },
      { id: 'hybrid', label: 'A bit of everything', hint: 'Work, social and weekends' },
      { id: 'active', label: 'On the move', hint: 'Travel, errands and being outdoors' },
    ],
  },
]

export type Weights = Partial<Record<AestheticId, number>>

export const OCCASION_WEIGHTS: Record<string, Weights> = {
  everyday: { 'casual-essentials': 2, 'smart-casual': 1, streetwear: 1, minimalist: 1 },
  university: { 'casual-essentials': 2, 'gen-z': 2, streetwear: 1, 'smart-casual': 1 },
  office: { 'smart-casual': 2, 'classic-formal': 2, 'quiet-luxury': 1, 'old-money': 1 },
  church: { 'classic-formal': 2, 'afro-modern': 1.5, 'old-money': 1 },
  'date-night': { 'quiet-luxury': 2, minimalist: 1, 'smart-casual': 1, 'old-money': 1 },
  weddings: { 'classic-formal': 2, 'afro-modern': 1.5, 'old-money': 1 },
  parties: { 'afro-modern': 1.5, streetwear: 1, 'classic-formal': 1, 'gen-z': 1 },
  travel: { 'casual-essentials': 2, minimalist: 1, 'old-money': 1 },
  formal: { 'classic-formal': 3 },
}

export const COLOR_WEIGHTS: Record<string, Weights> = {
  neutrals: { minimalist: 2, 'quiet-luxury': 2, 'old-money': 1, 'casual-essentials': 1 },
  earth: { 'old-money': 2, 'quiet-luxury': 1, 'casual-essentials': 1, 'afro-modern': 1 },
  blue: { 'classic-formal': 1.5, 'smart-casual': 2, 'old-money': 1 },
  'black-grey': { minimalist: 2, streetwear: 2, 'classic-formal': 1, 'gen-z': 1 },
  green: { 'quiet-luxury': 1.5, 'casual-essentials': 1.5, 'old-money': 1 },
  wine: { 'classic-formal': 1, 'smart-casual': 1, 'afro-modern': 1, 'quiet-luxury': 1 },
  bold: { 'afro-modern': 2, 'gen-z': 2, streetwear: 1 },
}

/** colour answer → outfit palette families & starter colours */
export const COLOR_FAMILIES: Record<string, { families: string[]; keys: string[] }> = {
  neutrals: { families: ['Neutrals'], keys: ['ivory', 'stone', 'taupe', 'charcoal'] },
  earth: { families: ['Earth tones'], keys: ['sand', 'camel', 'brown', 'chocolate'] },
  blue: { families: ['Blues'], keys: ['navy', 'denim', 'lightblue', 'cream'] },
  'black-grey': { families: ['Black & grey', 'Monochrome'], keys: ['black', 'charcoal', 'grey', 'white'] },
  green: { families: ['Earth tones'], keys: ['olive', 'forest', 'sage', 'cream'] },
  wine: { families: ['Wine & burgundy'], keys: ['burgundy', 'charcoal', 'stone', 'espresso'] },
  bold: { families: ['Statement'], keys: ['mustard', 'rust', 'blue', 'cream'] },
}

export const FIT_WEIGHTS: Record<string, { weights: Weights; formality: number }> = {
  relaxed: { weights: { 'gen-z': 2, streetwear: 2, 'casual-essentials': 1, minimalist: 0.5 }, formality: 1 },
  easy: { weights: { 'casual-essentials': 2, minimalist: 1, 'quiet-luxury': 1, 'smart-casual': 1 }, formality: 1.5 },
  balanced: { weights: { 'smart-casual': 2, 'quiet-luxury': 1, 'old-money': 1 }, formality: 2 },
  tailored: { weights: { 'classic-formal': 2, 'old-money': 1.5, 'smart-casual': 1 }, formality: 3 },
  sharp: { weights: { 'classic-formal': 3, 'afro-modern': 0.5 }, formality: 4 },
}

export const CLIMATE_WEIGHTS: Record<string, Weights> = {
  warm: { 'casual-essentials': 1, 'afro-modern': 1, minimalist: 0.5 },
  mild: { 'smart-casual': 1 },
  cold: { 'old-money': 1, 'quiet-luxury': 1, 'classic-formal': 0.5 },
  mixed: { 'smart-casual': 0.5, 'casual-essentials': 0.5 },
}

export const LIFESTYLE_WEIGHTS: Record<string, Weights> = {
  student: { 'gen-z': 2, 'casual-essentials': 1.5, streetwear: 1 },
  office: { 'smart-casual': 2, 'classic-formal': 1.5, 'quiet-luxury': 1 },
  creative: { minimalist: 1.5, streetwear: 1.5, 'afro-modern': 1, 'quiet-luxury': 1 },
  hybrid: { 'smart-casual': 1.5, 'quiet-luxury': 1, minimalist: 1 },
  active: { 'casual-essentials': 2, minimalist: 1 },
}
