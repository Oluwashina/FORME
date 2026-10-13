import type { Aesthetic, AestheticId, Occasion, OccasionId } from '../types'

export const AESTHETICS: Aesthetic[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Fewer pieces. Better edits.',
    description:
      'Clean lines, a restrained palette and nothing that shouts. Minimalism is about choosing carefully, then wearing it with confidence.',
    outfitId: 'black-turtleneck-evening',
    signature: ['Merino roll-necks', 'Crisp white tees', 'Black tailored trousers', 'Low-profile leather shoes'],
    palette: ['black', 'white', 'charcoal', 'stone'],
  },
  {
    id: 'old-money',
    name: 'Old Money',
    tagline: 'Understated, inherited, lived-in.',
    description:
      'Soft tailoring, natural fibres and heritage colours. The look of a man who has never needed to prove anything.',
    outfitId: 'the-stone-trench',
    signature: ['Camel overcoats', 'Knitted polos', 'Oxford shirts', 'Loafers'],
    palette: ['camel', 'cream', 'navy', 'chocolate'],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    tagline: 'Dressed up without a suit.',
    description:
      'The practical middle ground — tailored enough for work and dinner, relaxed enough for a Saturday.',
    outfitId: 'relaxed-tailoring',
    signature: ['Unstructured blazers', 'Oxford shirts', 'Chinos', 'Leather sneakers'],
    palette: ['navy', 'lightblue', 'stone', 'brown'],
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    tagline: 'Texture, volume and attitude.',
    description:
      'Heavyweight fabrics, relaxed proportions and a confident point of view — built from layers rather than logos.',
    outfitId: 'shearling-streets',
    signature: ['Heavyweight sweatshirts', 'Trucker jackets', 'Cargo trousers', 'Chunky sneakers'],
    palette: ['black', 'taupe', 'cream', 'denim'],
  },
  {
    id: 'quiet-luxury',
    name: 'Quiet Luxury',
    tagline: 'No logos. Obvious quality.',
    description:
      'Tonal neutrals, fine knits and perfect fit. The expense is in the fabric and the cut — never the branding.',
    outfitId: 'the-modern-earth-tone-fit',
    signature: ['Fine-gauge knitwear', 'Pleated trousers', 'Suede loafers', 'Tonal layering'],
    palette: ['ivory', 'olive', 'stone', 'espresso'],
  },
  {
    id: 'gen-z',
    name: 'Contemporary Gen Z',
    tagline: 'Relaxed, wide and unbothered.',
    description:
      'Volume with intention: wider legs, softer fabrics, bright accents and sneakers that do the talking.',
    outfitId: 'wide-denim-beanie',
    signature: ['Baggy denim', 'Boxy tees', 'Beanies', 'Chunky sneakers'],
    palette: ['lightblue', 'black', 'mustard', 'cream'],
  },
  {
    id: 'classic-formal',
    name: 'Classic Formal',
    tagline: 'The suit, done properly.',
    description:
      'Tailoring that fits, shoes that are polished, details that are correct. A timeless uniform for the moments that matter.',
    outfitId: 'the-navy-standard',
    signature: ['Navy and grey suits', 'White dress shirts', 'Silk ties', 'Oxford shoes'],
    palette: ['navy', 'grey', 'white', 'burgundy'],
  },
  {
    id: 'afro-modern',
    name: 'Afro-Modern',
    tagline: 'Heritage, cut for now.',
    description:
      'Traditional silhouettes and embroidery reinterpreted with clean tailoring, considered colour and modern ease.',
    outfitId: 'sky-blue-embroidered-tunic',
    signature: ['Embroidered tunics', 'Agbada', 'Tonal palettes', 'Tailored trousers'],
    palette: ['skyblue', 'white', 'tan', 'rust'],
  },
  {
    id: 'casual-essentials',
    name: 'Casual Essentials',
    tagline: 'The basics, worn well.',
    description:
      'A small set of tees, trousers and layers that work together — dependable, comfortable and always right.',
    outfitId: 'ease-in-white',
    signature: ['White tees', 'Chinos', 'Overshirts', 'Clean sneakers'],
    palette: ['white', 'khaki', 'olive', 'indigo'],
  },
]

export const AESTHETIC_BY_ID = Object.fromEntries(AESTHETICS.map((a) => [a.id, a])) as Record<AestheticId, Aesthetic>

export const OCCASIONS: Occasion[] = [
  { id: 'everyday', name: 'Everyday Casual', blurb: 'Errands, coffee, weekends. Easy but never careless.', outfitId: 'the-effortless-sunday-fit', formality: [1, 2], dressCode: 'Relaxed' },
  { id: 'university', name: 'University', blurb: 'Lectures to late nights — layers, comfort and a clean sneaker.', outfitId: 'campus-layers', formality: [1, 2], dressCode: 'Practical' },
  { id: 'office', name: 'Office & Business', blurb: 'From smart-casual offices to the boardroom.', outfitId: 'the-modern-office-uniform', formality: [2, 3, 4], dressCode: 'Polished' },
  { id: 'church', name: 'Church', blurb: 'Respectful, composed, and well fitted.', outfitId: 'sunday-best-in-grey', formality: [3, 4], dressCode: 'Respectful' },
  { id: 'date-night', name: 'Date Night', blurb: 'Texture, warmth and a little confidence.', outfitId: 'dinner-after-dark', formality: [2, 3], dressCode: 'Evening' },
  { id: 'weddings', name: 'Weddings', blurb: 'Celebratory and suitably dressed, whether guest or groomsman.', outfitId: 'wedding-guest-in-blue', formality: [3, 4], dressCode: 'Celebration' },
  { id: 'parties', name: 'Parties & Events', blurb: 'Colour, cut and character for the night.', outfitId: 'rust-and-red', formality: [2, 3, 4], dressCode: 'Statement' },
  { id: 'travel', name: 'Travel & Holidays', blurb: 'Breathable, packable and still sharp on arrival.', outfitId: 'linen-on-the-coast', formality: [1, 2], dressCode: 'Easy' },
  { id: 'formal', name: 'Formal Occasions', blurb: 'Black tie, galas and moments that call for the full effect.', outfitId: 'black-tie-clarity', formality: [4], dressCode: 'Black tie' },
]

export const OCCASION_BY_ID = Object.fromEntries(OCCASIONS.map((o) => [o.id, o])) as Record<OccasionId, Occasion>
