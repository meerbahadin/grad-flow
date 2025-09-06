export type RGB = {
  r: number
  g: number
  b: number
}

export type GradientConfig = {
  color1: RGB
  color2: RGB
  color3: RGB
  speed: number
  scale: number
  type: GradientType
  noise: number
}

export type GradientType = 'linear' | 'radial' | 'diagonal' | 'animated'

export type GradFlowProps = {
  config?: Partial<GradientConfig>
  className?: string
}
