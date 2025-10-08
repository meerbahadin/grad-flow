import { RGB, GradientConfig, GradientType } from '@/types/gradient'

export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

const gradientTypes: GradientType[] = ['linear', 'animated', 'conic', 'wave', 'silk', 'smoke', 'stripe']

export function randomGradientType(): GradientType {
  return gradientTypes[Math.floor(Math.random() * gradientTypes.length)]
}

export function generateRandomColors(): Partial<GradientConfig> {
  return {
    color1: randomRGB(),
    color2: randomRGB(),
    color3: randomRGB(),
  }
}

export function generateRandomConfig(includeSize = false): Partial<GradientConfig> {
  const config: Partial<GradientConfig> = {
    color1: randomRGB(),
    color2: randomRGB(),
    color3: randomRGB(),
    type: randomGradientType(),
  }

  if (includeSize) {
    config.scale = Number((Math.random() * 2.5 + 0.5).toFixed(1)) // Random scale between 0.5 and 3.0
  }

  return config
}
