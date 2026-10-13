import type { GarmentKind } from '../types'
import { isDark } from '../data/colors'

interface Props {
  kind: GarmentKind
  color: string
  size?: number | string
  className?: string
  title?: string
}

/**
 * Flat, tintable garment silhouettes used as clean "visual product placeholders"
 * until real product photography is available.
 */
export function GarmentIcon({ kind, color, size = 96, className, title }: Props) {
  const dark = isDark(color)
  const line = dark ? 'rgba(255,255,255,0.28)' : 'rgba(37,37,34,0.3)'
  const hi = dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.42)'
  const common = { fill: color, stroke: line, strokeWidth: 1.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  const thin = { fill: 'none', stroke: line, strokeWidth: 1.1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  const shirtBody = 'M33 18 L43 13 L50 20 L57 13 L67 18 L86 30 L92 80 L80 82 L70 46 L70 90 L30 90 L30 46 L20 82 L8 80 L14 30 Z'
  const teeBody = 'M31 20 L42 14 Q50 22 58 14 L69 20 L88 36 L78 49 L68 42 L68 86 Q68 88 66 88 L34 88 Q32 88 32 86 L32 42 L22 49 L12 36 Z'
  const trousersBody = 'M33 8 L67 8 L72 92 L55 92 L50 36 L45 92 L28 92 Z'

  let content: React.ReactNode
  switch (kind) {
    case 'tee':
      content = (
        <>
          <path d={teeBody} {...common} />
          <path d="M42 14 Q50 24 58 14" {...thin} />
          <path d="M32 42 L22 49 M68 42 L78 49" {...thin} />
        </>
      )
      break
    case 'polo':
      content = (
        <>
          <path d={teeBody} {...common} />
          <path d="M40 13 L47 24 L42 30 L34 19 Z M60 13 L53 24 L58 30 L66 19 Z" fill={hi} stroke={line} strokeWidth={1.1} strokeLinejoin="round" />
          <path d="M50 26 L50 48" {...thin} />
          <circle cx="50" cy="33" r="1.2" fill={line} />
          <circle cx="50" cy="40" r="1.2" fill={line} />
        </>
      )
      break
    case 'shirt':
    case 'overshirt':
      content = (
        <>
          <path d={shirtBody} {...common} />
          <path d="M43 13 L50 25 L57 13" {...thin} />
          <path d="M50 25 L50 90" {...thin} />
          <path d="M43 13 L36 21 L44 28 L50 25 Z M57 13 L64 21 L56 28 L50 25 Z" fill={hi} stroke={line} strokeWidth={1.1} strokeLinejoin="round" />
          {kind === 'overshirt' ? (
            <>
              <rect x="34" y="46" width="11" height="11" rx="1.5" {...thin} />
              <rect x="55" y="46" width="11" height="11" rx="1.5" {...thin} />
            </>
          ) : (
            [38, 50, 62, 74].map((y) => <circle key={y} cx="50" cy={y} r="1.1" fill={line} />)
          )}
          <path d="M20 82 L8 80 M80 82 L92 80" {...thin} />
        </>
      )
      break
    case 'knit':
      content = (
        <>
          <path d={shirtBody} {...common} />
          <path d="M42 13 Q50 23 58 13" {...thin} />
          <path d="M30 82 L70 82" {...thin} />
          <path d="M9 72 L21 75 M91 72 L79 75" {...thin} />
          {[38, 50, 62].map((x) => (
            <path key={x} d={`M${x} 84 L${x} 90`} {...thin} />
          ))}
        </>
      )
      break
    case 'turtleneck':
      content = (
        <>
          <path d="M40 6 L60 6 L61 20 L39 20 Z" {...common} />
          <path d={shirtBody.replace('M33 18 L43 13 L50 20 L57 13 L67 18', 'M33 20 L41 17 L50 22 L59 17 L67 20')} {...common} />
          <path d="M40 12 L60 12" {...thin} />
          <path d="M30 82 L70 82" {...thin} />
        </>
      )
      break
    case 'tunic':
      content = (
        <>
          <path d="M34 14 L44 10 Q50 22 56 10 L66 14 L88 30 L92 78 L80 80 L70 40 L72 98 L28 98 L30 40 L20 80 L8 78 L12 30 Z" {...common} />
          <path d="M44 10 L50 34 L56 10" {...thin} />
          <path d="M50 34 L50 56" {...thin} />
          {[40, 46, 52].map((y) => (
            <circle key={y} cx="50" cy={y + 8} r="1" fill={line} />
          ))}
          <path d="M30 90 L70 90" {...thin} />
        </>
      )
      break
    case 'blazer':
      content = (
        <>
          <path d="M32 16 L42 12 L50 34 L58 12 L68 16 L88 34 L92 84 L80 86 L70 50 L70 92 L30 92 L30 50 L20 86 L8 84 L12 34 Z" {...common} />
          <path d="M42 12 L50 34 L41 46 L33 30 Z M58 12 L50 34 L59 46 L67 30 Z" fill={hi} stroke={line} strokeWidth={1.1} strokeLinejoin="round" />
          <path d="M50 34 L50 92" {...thin} />
          <circle cx="46" cy="62" r="1.3" fill={line} />
          <circle cx="46" cy="72" r="1.3" fill={line} />
          <path d="M60 70 L68 70" {...thin} />
        </>
      )
      break
    case 'coat':
      content = (
        <>
          <path d="M32 12 L42 8 L50 32 L58 8 L68 12 L88 30 L92 92 L80 94 L70 52 L70 98 L30 98 L30 52 L20 94 L8 92 L12 30 Z" {...common} />
          <path d="M42 8 L50 32 L40 46 L32 28 Z M58 8 L50 32 L60 46 L68 28 Z" fill={hi} stroke={line} strokeWidth={1.1} strokeLinejoin="round" />
          <path d="M50 32 L50 98" {...thin} />
          <circle cx="45" cy="60" r="1.3" fill={line} />
          <circle cx="45" cy="72" r="1.3" fill={line} />
          <path d="M60 76 L68 76" {...thin} />
        </>
      )
      break
    case 'trousers':
      content = (
        <>
          <path d={trousersBody} {...common} />
          <path d="M33 14 L67 14" {...thin} />
          <path d="M50 14 L50 36" {...thin} />
          <path d="M38 14 Q38 24 42 26 M62 14 Q62 24 58 26" {...thin} />
        </>
      )
      break
    case 'jeans':
      content = (
        <>
          <path d={trousersBody} {...common} />
          <path d="M33 14 L67 14" {...thin} />
          <path d="M50 14 L50 38" {...thin} />
          <path d="M37 15 Q37 28 44 30 M63 15 Q63 28 56 30" {...thin} strokeDasharray="2 2" />
          <path d="M29 86 L45 86 M55 86 L71 86" {...thin} strokeDasharray="2 2" />
        </>
      )
      break
    case 'loafers':
      content = (
        <>
          <path d="M8 66 Q8 52 22 50 L40 52 Q54 54 64 60 L86 64 Q94 66 94 74 L94 78 Q94 80 92 80 L10 80 Q8 80 8 78 Z" {...common} />
          <path d="M8 78 L94 78" stroke={line} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M38 53 L50 62 L64 62" {...thin} />
          <path d="M26 52 Q34 58 40 56" {...thin} />
          <path d="M8 72 L18 72" {...thin} />
        </>
      )
      break
    case 'boots':
      content = (
        <>
          <path d="M22 12 L50 12 L52 52 Q70 56 86 62 Q94 64 94 74 L94 80 L18 80 L18 58 Z" {...common} />
          <path d="M18 78 L94 78" stroke={line} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M24 12 L50 12" {...thin} />
          {[22, 30, 38, 46].map((y) => (
            <path key={y} d={`M30 ${y} L44 ${y}`} {...thin} />
          ))}
          <path d="M18 66 L30 66" {...thin} />
        </>
      )
      break
    case 'sneakers':
      content = (
        <>
          <path d="M8 66 Q8 54 20 52 L38 52 Q44 60 56 60 L84 64 Q94 66 94 74 L94 80 L8 80 Z" {...common} />
          <path d="M8 72 L94 72 L94 80 L8 80 Z" fill={hi} stroke={line} strokeWidth={1.1} />
          {[40, 48, 56].map((x) => (
            <path key={x} d={`M${x} 58 L${x + 6} 62`} {...thin} />
          ))}
        </>
      )
      break
    case 'belt':
      content = (
        <>
          <rect x="8" y="42" width="84" height="15" rx="7.5" {...common} />
          <rect x="60" y="36" width="17" height="27" rx="3" fill="none" stroke={dark ? 'rgba(255,255,255,0.55)' : 'rgba(37,37,34,0.55)'} strokeWidth={2.2} />
          <circle cx="24" cy="49.5" r="1.1" fill={line} />
          <circle cx="32" cy="49.5" r="1.1" fill={line} />
          <circle cx="40" cy="49.5" r="1.1" fill={line} />
        </>
      )
      break
    case 'watch':
      content = (
        <>
          <rect x="39" y="4" width="22" height="92" rx="5" {...common} />
          <circle cx="50" cy="50" r="19" fill="#f4f2ec" stroke={dark ? 'rgba(255,255,255,0.55)' : 'rgba(37,37,34,0.5)'} strokeWidth={3} />
          <path d="M50 50 L50 38 M50 50 L58 54" stroke="rgba(37,37,34,0.7)" strokeWidth={1.6} strokeLinecap="round" />
        </>
      )
      break
    case 'sunglasses':
      content = (
        <>
          <ellipse cx="30" cy="52" rx="19" ry="14" {...common} />
          <ellipse cx="70" cy="52" rx="19" ry="14" {...common} />
          <path d="M49 50 Q50 46 51 50" {...thin} />
          <path d="M11 48 L4 42 M89 48 L96 42" {...thin} />
        </>
      )
      break
    case 'hat':
      content = (
        <>
          <path d="M30 56 Q30 24 50 24 Q70 24 70 56 Z" {...common} />
          <path d="M6 66 Q50 82 94 66 Q80 52 50 56 Q20 52 6 66 Z" {...common} />
          <path d="M30 54 Q50 60 70 54" {...thin} />
        </>
      )
      break
    case 'cap':
      content = (
        <>
          <path d="M22 62 Q22 22 50 22 Q78 22 78 62 Z" {...common} />
          <rect x="22" y="58" width="56" height="16" rx="3" fill={hi} stroke={line} strokeWidth={1.1} />
          {[30, 38, 46, 54, 62, 70].map((x) => (
            <path key={x} d={`M${x} 60 L${x} 72`} {...thin} />
          ))}
        </>
      )
      break
    case 'tie':
      content = (
        <>
          <path d="M42 6 L58 6 L56 22 L44 22 Z" {...common} />
          <path d="M44 22 L56 22 L63 86 L50 95 L37 86 Z" {...common} />
          <path d="M50 26 L50 88" {...thin} />
        </>
      )
      break
    case 'bag':
      content = (
        <>
          <path d="M36 44 Q36 20 50 20 Q64 20 64 44" fill="none" stroke={line} strokeWidth={3} strokeLinecap="round" />
          <path d="M20 42 L80 42 L88 90 L12 90 Z" {...common} />
          <path d="M20 42 L50 56 L80 42" {...thin} />
          <rect x="45" y="54" width="10" height="7" rx="1.5" fill={hi} stroke={line} strokeWidth={1} />
        </>
      )
      break
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {content}
    </svg>
  )
}
