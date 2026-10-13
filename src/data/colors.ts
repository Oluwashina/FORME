import type { NamedColor } from '../types'

const defs: [string, string, string][] = [
  // key, name, hex
  ['white', 'White', '#F7F6F2'],
  ['ivory', 'Ivory', '#F2EFE9'],
  ['cream', 'Cream', '#EBE2CF'],
  ['oatmeal', 'Oatmeal', '#D9CDB8'],
  ['stone', 'Stone', '#CFC7B8'],
  ['sand', 'Sand', '#D6C6A5'],
  ['beige', 'Beige', '#D8C8AE'],
  ['khaki', 'Khaki', '#B5A585'],
  ['tan', 'Tan', '#BF9A6E'],
  ['camel', 'Camel', '#B07F4F'],
  ['taupe', 'Taupe', '#8C8376'],
  ['brown', 'Brown', '#6B4A33'],
  ['chocolate', 'Chocolate Brown', '#4A3226'],
  ['espresso', 'Espresso', '#32231B'],
  ['rust', 'Rust', '#A0522D'],
  ['mustard', 'Mustard', '#C4A03D'],
  ['sage', 'Sage', '#A3AC95'],
  ['olive', 'Olive', '#69715D'],
  ['moss', 'Moss', '#585C3A'],
  ['forest', 'Forest', '#2F4A3A'],
  ['teal', 'Deep Teal', '#2F5D62'],
  ['skyblue', 'Sky Blue', '#A8C0D8'],
  ['lightblue', 'Light Blue', '#B4C8DC'],
  ['blue', 'French Blue', '#3F6CA8'],
  ['denim', 'Mid Indigo', '#4B6584'],
  ['indigo', 'Dark Indigo', '#2E3E5C'],
  ['navy', 'Navy', '#1F2A44'],
  ['midnight', 'Midnight', '#141B2D'],
  ['lilac', 'Lilac', '#C9BFD6'],
  ['plum', 'Plum', '#4B2B47'],
  ['burgundy', 'Burgundy', '#6D1F2B'],
  ['wine', 'Deep Wine', '#4F1822'],
  ['lightgrey', 'Light Grey', '#C8C9C9'],
  ['grey', 'Grey', '#8B8E91'],
  ['charcoal', 'Charcoal', '#36373A'],
  ['black', 'Black', '#161616'],
]

export const COLORS: Record<string, NamedColor> = Object.fromEntries(
  defs.map(([key, name, hex]) => [key, { key, name, hex }]),
)

export const color = (key: string): NamedColor => {
  const c = COLORS[key]
  if (!c) throw new Error(`Unknown color key: ${key}`)
  return c
}

/* ---------- color math ---------- */

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const rgbToHex = (r: number, g: number, b: number) =>
  '#' +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

export const hexToHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l * 100]
  const s = d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [(h * 60 + 360) % 360, s * 100, l * 100]
}

export const hslToHex = (h: number, s: number, l: number) => {
  const S = Math.max(0, Math.min(100, s)) / 100
  const L = Math.max(0, Math.min(100, l)) / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = S * Math.min(L, 1 - L)
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255)
}

/** sRGB -> CIE Lab (D65) for perceptual distance */
const toLab = (hex: string): [number, number, number] => {
  const lin = (v: number) => {
    v /= 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = hexToRgb(hex).map(lin)
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]
}

export const colorDistance = (a: string, b: string) => {
  const [l1, a1, b1] = toLab(a)
  const [l2, a2, b2] = toLab(b)
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)
}

export const nearestNamedColor = (hex: string): NamedColor => {
  let best = Object.values(COLORS)[0]
  let bestD = Infinity
  for (const c of Object.values(COLORS)) {
    const d = colorDistance(hex, c.hex)
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best
}

export const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const isDark = (hex: string) => luminance(hex) < 0.32

/** A readable foreground for text placed on this color */
export const onColor = (hex: string) => (luminance(hex) > 0.45 ? '#252522' : '#F2EFE9')
