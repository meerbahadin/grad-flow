import { RGB, GradientConfig } from '@/types/gradient'

export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

export function generateRandomColors(): Partial<GradientConfig> {
  return {
    color1: randomRGB(),
    color2: randomRGB(),
    color3: randomRGB(),
  }
}
