import { RGB } from '@/types/gradient'

export const normalizeRgb = (rgb: RGB): [number, number, number] => [
  rgb.r / 255,
  rgb.g / 255,
  rgb.b / 255,
]

export const rgbToHex = (rgb: RGB): string =>
  '#' +
  [rgb.r, rgb.g, rgb.b]
    .map((c) =>
      Math.round(Math.max(0, Math.min(255, c)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')

export const hexToRgb = (hex: string): RGB => {
  const h = hex.replace('#', '')
  if (h.length !== 6) return { r: 255, g: 255, b: 255 }

  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
