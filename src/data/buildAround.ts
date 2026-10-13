import type { Formality } from '../types'

export type BuildCategory = 'Tops' | 'Bottoms' | 'Footwear' | 'Layers'

export interface Combo {
  title: string
  occasion: string
  formality: Formality
  /** item catalogue keys, in wearing order */
  pieces: string[]
  note: string
  /** optional gallery outfit that shows this item in the wild */
  outfitId?: string
}

export interface HeroItem {
  key: string
  category: BuildCategory
  headline: string
  blurb: string
  partners: { tops: string[]; bottoms: string[]; footwear: string[]; accessories: string[] }
  combos: Combo[]
}

export const BUILD_CATEGORIES: BuildCategory[] = ['Tops', 'Bottoms', 'Footwear', 'Layers']

export const HERO_ITEMS: HeroItem[] = [
  {
    key: 'white-tee',
    category: 'Tops',
    headline: 'One white T-shirt, three outfits.',
    blurb: 'The most useful piece you own. A heavyweight white tee works under a coat, beside a blazer or alone with chinos.',
    partners: {
      tops: ['grey-cardigan', 'olive-overshirt', 'sand-overshirt'],
      bottoms: ['black-trousers', 'dark-jeans', 'khaki-chinos', 'tan-chinos'],
      footwear: ['white-leather-sneakers', 'tan-suede-boots', 'black-chelsea-boots'],
      accessories: ['steel-watch', 'sunglasses', 'black-beanie'],
    },
    combos: [
      { title: 'Weekend errands', occasion: 'Everyday Casual', formality: 1, pieces: ['white-tee', 'khaki-chinos', 'white-leather-sneakers', 'steel-watch'], note: 'Straight chinos, clean sneakers, nothing else needed.', outfitId: 'departure-gate' },
      { title: 'Layered for evening', occasion: 'Date Night', formality: 2, pieces: ['black-leather-jacket', 'white-tee', 'dark-jeans', 'black-chelsea-boots'], note: 'The white tee is the bright break between two dark pieces.', outfitId: 'leather-and-denim' },
      { title: 'Under a coat', occasion: 'Smart Casual', formality: 3, pieces: ['camel-overcoat', 'white-tee', 'black-trousers', 'white-leather-sneakers'], note: 'A good coat makes a plain tee look chosen.', outfitId: 'camel-coat-season' },
    ],
  },
  {
    key: 'white-oxford',
    category: 'Tops',
    headline: 'One white oxford, five ways.',
    blurb: 'Buttoned, open, tucked, rolled or under a knit — the white oxford rarely appears the same way twice.',
    partners: {
      tops: ['navy-blazer', 'grey-wool-blazer', 'stone-trench'],
      bottoms: ['grey-trousers', 'charcoal-trousers', 'stone-chinos', 'black-trousers'],
      footwear: ['white-leather-sneakers', 'dark-brown-loafers', 'black-loafers'],
      accessories: ['steel-watch', 'brown-belt', 'navy-silk-tie'],
    },
    combos: [
      { title: 'Open collar, rolled sleeves', occasion: 'Office · Casual Friday', formality: 2, pieces: ['white-oxford', 'grey-trousers', 'white-leather-sneakers', 'steel-watch'], note: 'Sleeves pushed to the forearm keeps the shirt relaxed.', outfitId: 'white-shirt-grey-trousers' },
      { title: 'Under a blazer', occasion: 'Smart Casual · Dinner', formality: 3, pieces: ['navy-blazer', 'white-oxford', 'navy-trousers', 'dark-brown-loafers'], note: 'Drop the tie; leave the collar open.', outfitId: 'navy-unfussy' },
      { title: 'Beneath a trench', occasion: 'Commute', formality: 3, pieces: ['stone-trench', 'white-oxford', 'charcoal-trousers', 'dark-brown-loafers'], note: 'A white shirt brightens a neutral coat.', outfitId: 'the-stone-trench' },
    ],
  },
  {
    key: 'black-trousers',
    category: 'Bottoms',
    headline: 'One pair of black trousers, four occasions.',
    blurb: 'Tailored black trousers go from the office to an evening out without changing a thing — only the top half moves.',
    partners: {
      tops: ['white-polo', 'white-oxford', 'black-turtleneck', 'tan-knit-polo'],
      bottoms: [],
      footwear: ['black-chelsea-boots', 'black-loafers', 'white-leather-sneakers', 'black-leather-sneakers'],
      accessories: ['black-belt', 'steel-watch', 'black-blazer'],
    },
    combos: [
      { title: 'The office', occasion: 'Office & Business', formality: 3, pieces: ['white-oxford', 'black-trousers', 'black-loafers', 'black-belt'], note: 'Crisp shirt, black loafers; add a blazer for meetings.', outfitId: 'jacket-over-the-shoulder' },
      { title: 'Dinner', occasion: 'Date Night', formality: 3, pieces: ['black-turtleneck', 'black-trousers', 'black-chelsea-boots', 'steel-watch'], note: 'All black with texture — instant evening.', outfitId: 'black-turtleneck-evening' },
      { title: 'The weekend', occasion: 'Everyday Casual', formality: 2, pieces: ['white-polo', 'black-trousers', 'black-leather-sneakers', 'steel-watch'], note: 'Replace the shirt with a polo and wear sneakers.', outfitId: 'the-white-polo-standard' },
      { title: 'A summer evening', occasion: 'Weddings · Events', formality: 3, pieces: ['tan-knit-polo', 'black-trousers', 'black-loafers', 'steel-watch'], note: 'A warm knit against black looks richer than white.', outfitId: 'tan-polo-black-trousers' },
    ],
  },
  {
    key: 'dark-jeans',
    category: 'Bottoms',
    headline: 'One pair of dark jeans, four moods.',
    blurb: 'Unfaded dark indigo is the most versatile denim — dress it up with a jacket or down with a tee.',
    partners: {
      tops: ['white-tee', 'cream-knit-polo', 'light-blue-oxford', 'black-turtleneck'],
      bottoms: [],
      footwear: ['white-leather-sneakers', 'tan-suede-boots', 'black-chelsea-boots', 'dark-brown-loafers'],
      accessories: ['brown-belt', 'steel-watch', 'black-beanie'],
    },
    combos: [
      { title: 'Edge', occasion: 'Date Night', formality: 2, pieces: ['black-leather-jacket', 'white-tee', 'dark-jeans', 'black-chelsea-boots'], note: 'Leather and dark denim, softened by a white tee.', outfitId: 'leather-and-denim' },
      { title: 'Autumn utility', occasion: 'University', formality: 2, pieces: ['olive-overshirt', 'white-tee', 'dark-jeans', 'tan-suede-boots'], note: 'Olive and indigo are naturally in tune.', outfitId: 'olive-overshirt-weekend' },
      { title: 'Lectures', occasion: 'University', formality: 1, pieces: ['olive-field-jacket', 'grey-tee', 'dark-jeans', 'white-leather-sneakers'], note: 'Layer up or down as the day changes.', outfitId: 'campus-layers' },
      { title: 'Elevated casual', occasion: 'Smart Casual', formality: 2, pieces: ['navy-blazer', 'white-oxford', 'dark-jeans', 'dark-brown-loafers'], note: 'A blazer with dark jeans is the easiest smart-casual shortcut.' },
    ],
  },
  {
    key: 'dark-brown-loafers',
    category: 'Footwear',
    headline: 'One pair of brown loafers, multiple aesthetics.',
    blurb: 'Brown loafers sit in the gap between sneaker and dress shoe, so they adapt to whichever aesthetic you are dressing in.',
    partners: {
      tops: ['cream-knit-polo', 'light-blue-oxford', 'ivory-turtleneck', 'white-linen-shirt'],
      bottoms: ['olive-trousers', 'navy-trousers', 'stone-trousers', 'charcoal-trousers'],
      footwear: [],
      accessories: ['brown-belt', 'minimal-watch', 'sunglasses'],
    },
    combos: [
      { title: 'Old money', occasion: 'Weekend lunch', formality: 2, pieces: ['light-blue-oxford', 'charcoal-trousers', 'brown-belt', 'dark-brown-loafers'], note: 'Oxford shirt, pressed trousers, loafers: the old-money uniform.', outfitId: 'straw-hat-summer-lunch' },
      { title: 'Quiet luxury', occasion: 'Everyday', formality: 2, pieces: ['cream-knit-polo', 'olive-trousers', 'brown-belt', 'dark-brown-loafers'], note: 'A tonal palette and soft textures.', outfitId: 'the-modern-earth-tone-fit' },
      { title: 'Smart casual', occasion: 'Office', formality: 3, pieces: ['light-blue-oxford', 'navy-trousers', 'brown-belt', 'dark-brown-loafers'], note: 'The workwear default.', outfitId: 'the-modern-office-uniform' },
      { title: 'Classic', occasion: 'Commute', formality: 3, pieces: ['stone-trench', 'white-oxford', 'charcoal-trousers', 'dark-brown-loafers'], note: 'A trench coat and loafers belong together.', outfitId: 'the-stone-trench' },
    ],
  },
  {
    key: 'white-leather-sneakers',
    category: 'Footwear',
    headline: 'One pair of white sneakers, endless Fridays.',
    blurb: 'Clean white leather sneakers can finish a look from a tee to a blazer. They only fail when they are dirty.',
    partners: {
      tops: ['white-tee', 'white-polo', 'pale-blue-knit', 'grey-tee'],
      bottoms: ['stone-chinos', 'black-trousers', 'grey-trousers', 'white-trousers'],
      footwear: [],
      accessories: ['steel-watch', 'sunglasses', 'black-beanie'],
    },
    combos: [
      { title: 'Clean casual', occasion: 'Everyday', formality: 1, pieces: ['pale-blue-knit', 'stone-chinos', 'white-leather-sneakers', 'steel-watch'], note: 'Pale blue and stone: a calm palette with a white shoe.', outfitId: 'pale-blue-and-stone' },
      { title: 'Tailoring, relaxed', occasion: 'Smart Casual', formality: 2, pieces: ['grey-wool-blazer', 'black-tee', 'black-trousers', 'white-leather-sneakers'], note: 'A blazer made casual by a sneaker.', outfitId: 'relaxed-tailoring' },
      { title: 'Open collar', occasion: 'Office · Casual Friday', formality: 2, pieces: ['white-oxford', 'grey-trousers', 'white-leather-sneakers', 'steel-watch'], note: 'Roll the sleeves and keep the shoes spotless.', outfitId: 'white-shirt-grey-trousers' },
    ],
  },
  {
    key: 'navy-blazer',
    category: 'Layers',
    headline: 'One navy blazer, casual to formal.',
    blurb: 'A navy blazer is the closest thing menswear has to a skeleton key. Change what is underneath and it changes the whole outfit.',
    partners: {
      tops: ['white-tee', 'white-oxford', 'light-blue-oxford', 'ivory-turtleneck'],
      bottoms: ['dark-jeans', 'stone-chinos', 'grey-trousers', 'navy-trousers'],
      footwear: ['white-leather-sneakers', 'dark-brown-loafers', 'dark-brown-oxfords'],
      accessories: ['navy-silk-tie', 'steel-watch', 'brown-belt'],
    },
    combos: [
      { title: 'Casual', occasion: 'Everyday', formality: 2, pieces: ['navy-blazer', 'white-tee', 'dark-jeans', 'white-leather-sneakers'], note: 'A tee and denim beneath the blazer keeps it relaxed.' },
      { title: 'Smart casual', occasion: 'Dinner', formality: 2, pieces: ['navy-blazer', 'white-oxford', 'stone-chinos', 'dark-brown-loafers'], note: 'Oxford shirt, stone chinos, loafers.', outfitId: 'navy-unfussy' },
      { title: 'Business', occasion: 'Office', formality: 3, pieces: ['navy-blazer', 'light-blue-oxford', 'grey-trousers', 'dark-brown-oxfords'], note: 'Light blue shirt and grey trousers: the boardroom standard.', outfitId: 'the-navy-standard' },
      { title: 'Formal', occasion: 'Weddings · Events', formality: 4, pieces: ['navy-blazer', 'white-dress-shirt', 'navy-silk-tie', 'grey-suit-trousers', 'black-oxfords'], note: 'Add a tie and polished shoes for events.' },
    ],
  },
  {
    key: 'camel-overcoat',
    category: 'Layers',
    headline: 'One camel overcoat, three winters.',
    blurb: 'A camel coat lifts anything beneath it. Invest once and it will be the best-dressed thing in your wardrobe for years.',
    partners: {
      tops: ['white-tee', 'ivory-turtleneck', 'rust-turtleneck', 'burgundy-crewneck'],
      bottoms: ['black-trousers', 'charcoal-trousers', 'dark-jeans', 'navy-trousers'],
      footwear: ['black-chelsea-boots', 'dark-brown-loafers', 'white-leather-sneakers'],
      accessories: ['weekender', 'steel-watch', 'black-beanie'],
    },
    combos: [
      { title: 'Understated', occasion: 'Commute', formality: 3, pieces: ['camel-overcoat', 'white-tee', 'black-trousers', 'white-leather-sneakers'], note: 'White tee and black trousers let the coat do the talking.', outfitId: 'camel-coat-season' },
      { title: 'Warm on warm', occasion: 'Autumn', formality: 3, pieces: ['camel-overcoat', 'rust-turtleneck', 'black-trousers', 'black-chelsea-boots'], note: 'Rust and camel are close relatives.' },
      { title: 'Evening', occasion: 'Date Night', formality: 3, pieces: ['camel-overcoat', 'burgundy-crewneck', 'charcoal-trousers', 'black-chelsea-boots'], note: 'Deep wine under camel looks rich and warm.' },
    ],
  },
]

export const HERO_ITEM_BY_KEY = Object.fromEntries(HERO_ITEMS.map((h) => [h.key, h]))
