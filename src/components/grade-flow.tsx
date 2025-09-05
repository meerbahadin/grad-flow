'use client'

import { useEffect, useRef, useMemo } from 'react'
import { Mesh, Program, Renderer, Transform, Plane } from 'ogl'
import { GradientBackgroundProps, GradientConfig, RGB } from '@/types'

import { cn } from '@/lib/utils'
import { fragmentShader, vertexShader } from './shader'

const DEFAULT_CONFIG: GradientConfig = {
  color1: { r: 107, g: 85, b: 216 },
  color2: { r: 241, g: 96, b: 59 },
  color3: { r: 255, g: 255, b: 255 },
  speed: 0.6,
  scale: 1.2,
  type: 'animated',
  noise: 0.15,
}

const normalizeRgb = (rgb: RGB): [number, number, number] => [
  rgb.r / 255,
  rgb.g / 255,
  rgb.b / 255,
]

const gradientTypeNumber = {
  linear: 0,
  radial: 1,
  diagonal: 2,
  animated: 3,
}

export default function GradientBackground({
  config: initialConfig,
  className = '',
}: GradientBackgroundProps) {
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...initialConfig }),
    [initialConfig]
  )

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const rafRef = useRef<number>(0)

  const normalizedColors = useMemo(
    () => ({
      color1: normalizeRgb(config.color1 as RGB),
      color2: normalizeRgb(config.color2 as RGB),
      color3: normalizeRgb(config.color3 as RGB),
    }),
    [config.color1, config.color2, config.color3]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    rendererRef.current = renderer

    const gl = renderer.gl
    const plane = new Plane(gl, { width: 2, height: 2 })

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: normalizedColors.color1 },
        u_color2: { value: normalizedColors.color2 },
        u_color3: { value: normalizedColors.color3 },
        u_speed: { value: config.speed },
        u_scale: { value: config.scale },
        u_type: { value: gradientTypeNumber[config.type ?? 'animated'] },
        u_noise: { value: config.noise },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry: plane, program })
    const scene = new Transform()
    mesh.setParent(scene)

    const handleResize = () => {
      if (!canvas.parentElement) return

      const parent = canvas.parentElement
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      renderer.setSize(w, h)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000
      program.uniforms.u_time.value = elapsed

      renderer.render({ scene: mesh })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)

      const loseContext = gl.getExtension('WEBGL_lose_context')
      loseContext?.loseContext()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const program = programRef.current
    if (!program) return

    program.uniforms.u_color1.value = normalizedColors.color1
    program.uniforms.u_color2.value = normalizedColors.color2
    program.uniforms.u_color3.value = normalizedColors.color3
    program.uniforms.u_speed.value = config.speed
    program.uniforms.u_scale.value = config.scale
    program.uniforms.u_type.value =
      gradientTypeNumber[config.type ?? 'animated']
    program.uniforms.u_noise.value = config.noise
  }, [config, normalizedColors])

  return <canvas ref={canvasRef} className={cn('w-full h-full', className)} />
}
