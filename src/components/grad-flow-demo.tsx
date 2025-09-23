'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { Mesh, Program, Renderer, Transform, Plane } from 'ogl'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

import { Button } from './ui/button'
import { Slider } from './ui/slider'

import { cn } from '@/lib/utils'
import {
  DEFAULT_CONFIG,
  fragmentShader,
  GradFlowProps,
  GradientConfig,
  GradientType,
  gradientTypeNumber,
  normalizeRgb,
  RGB,
  vertexShader,
} from './grad-flow'

import ContentDemo from './content-demo'
import { Code, ImageDown, Settings } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Image from 'next/image'

const PRESETS = {
  cosmic: {
    color1: { r: 85, g: 4, b: 129 },
    color2: { r: 0, g: 145, b: 255 },
    color3: { r: 0, g: 4, b: 5 },
    speed: 0.4,
    scale: 1.2,
    type: 'silk',
    noise: 0.1,
  },
  matrix: {
    color1: { r: 34, g: 54, b: 145 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 147, g: 251, b: 173 },
    speed: 0.8,
    scale: 1,
    type: 'silk',
    noise: 0.1,
  },
  electric: {
    color1: { r: 5, g: 65, b: 245 },
    color2: { r: 178, g: 224, b: 209 },
    color3: { r: 87, g: 229, b: 149 },
    speed: 0.9,
    scale: 2,
    type: 'animated',
    noise: 0.18,
  },
  inferno: {
    color1: { r: 77, g: 0, b: 0 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 255, g: 187, b: 0 },
    speed: 0.9,
    scale: 1.1,
    type: 'wave',
    noise: 0.18,
  },
  mystic: {
    color1: { r: 192, g: 155, b: 197 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 53, g: 0, b: 97 },
    speed: 0.9,
    scale: 2,
    type: 'smoke',
    noise: 0.18,
  },
  cyber: {
    color1: { r: 102, g: 237, b: 255 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 0, g: 255, b: 110 },
    speed: 0.9,
    scale: 2,
    type: 'silk',
    noise: 0.18,
  },
  neon: {
    color1: { r: 102, g: 237, b: 255 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 0, g: 255, b: 110 },
    speed: 0.6,
    scale: 2,
    type: 'animated',
    noise: 0.18,
  },
  plasma: {
    color1: { r: 163, g: 106, b: 242 },
    color2: { r: 0, g: 0, b: 0 },
    color3: { r: 234, g: 130, b: 106 },
    speed: 0.6,
    scale: 1.2,
    type: 'silk',
    noise: 0.18,
  },
} as const

const rgbToHex = (rgb: RGB): string =>
  '#' +
  [rgb.r, rgb.g, rgb.b]
    .map((c) =>
      Math.round(Math.max(0, Math.min(255, c)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')

const hexToRgb = (hex: string): RGB => {
  const h = hex.replace('#', '')
  if (h.length !== 6) return { r: 255, g: 255, b: 255 }

  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

const captureImage = (
  canvas: HTMLCanvasElement,
  renderer: Renderer,
  mesh: Mesh | null
) => {
  try {
    if (mesh && renderer) {
      renderer.render({ scene: mesh })
    }

    requestAnimationFrame(() => {
      try {
        let dataUrl: string

        try {
          dataUrl = canvas.toDataURL('image/webp', 0.95)
        } catch {
          console.warn('WebP not supported, falling back to PNG')
          dataUrl = canvas.toDataURL('image/png')
        }

        if (dataUrl === 'data:,' || dataUrl.length < 100) {
          console.error('Canvas appears to be empty')
          alert(
            'Failed to capture image. The canvas might be empty or the WebGL context is lost.'
          )
          return
        }

        const link = document.createElement('a')
        link.download = `gradflow-gradient-${Date.now()}.webp`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('Failed to capture image:', error)
      }
    })
  } catch (error) {
    console.error('Failed to initiate image capture:', error)
  }
}

const copyCodeToClipboard = (config: GradientConfig) => {
  const codeString = `config={{
        color1: { r: ${config.color1.r}, g: ${config.color1.g}, b: ${config.color1.b} },
        color2: { r: ${config.color2.r}, g: ${config.color2.g}, b: ${config.color2.b} },
        color3: { r: ${config.color3.r}, g: ${config.color3.g}, b: ${config.color3.b} },
        speed: ${config.speed},
        scale: ${config.scale},
        type: '${config.type}',
        noise: ${config.noise}
      }}`
  navigator.clipboard
    .writeText(codeString)
    .then(() => {
      alert('Code copied to clipboard!')
    })
    .catch(() => {
      alert('Failed to copy code. Please try again.')
    })
}

export default function GradFlowDemo({
  config: initialConfig,
  className = '',
}: GradFlowProps) {
  const [config, setConfig] = useState<GradientConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const sceneRef = useRef<Transform | null>(null)
  const rafRef = useRef<number>(0)

  const normalizedColors = useMemo(
    () => ({
      color1: normalizeRgb(config.color1),
      color2: normalizeRgb(config.color2),
      color3: normalizeRgb(config.color3),
    }),
    [config.color1, config.color2, config.color3]
  )

  const updateConfig = useCallback(
    (updates: Partial<GradientConfig>) => {
      const newConfig = { ...config, ...updates }
      setConfig(newConfig)
    },
    [config]
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

      // Update resolution uniform if program exists
      if (programRef.current) {
        programRef.current.uniforms.u_resolution.value = [w, h]
      }
    }

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
        u_type: { value: gradientTypeNumber[config.type] },
        u_noise: { value: config.noise },
        u_resolution: { value: [canvas.clientWidth, canvas.clientHeight] },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry: plane, program })
    meshRef.current = mesh

    const scene = new Transform()
    sceneRef.current = scene
    mesh.setParent(scene)

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

      meshRef.current = null
      sceneRef.current = null
      programRef.current = null
      rendererRef.current = null

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
    program.uniforms.u_type.value = gradientTypeNumber[config.type]
    program.uniforms.u_noise.value = config.noise
  }, [config, normalizedColors])

  const applyPreset = useCallback(
    (presetName: keyof typeof PRESETS) => {
      updateConfig({ ...config, ...PRESETS[presetName] })
    },
    [config, updateConfig]
  )

  const handleCaptureImage = useCallback(() => {
    const canvas = canvasRef.current
    const renderer = rendererRef.current
    const mesh = meshRef.current

    if (!canvas) {
      console.log('canvas not found. please try again.')
      return
    }

    if (!renderer) {
      console.log('renderer not initialized. please try again.')
      return
    }

    captureImage(canvas, renderer, mesh)
  }, [])

  return (
    <div className='h-screen w-full flex flex-col items-center justify-between relative py-2 rounded-3xl'>
      <div className='flex w-full max-w-md z-50 container'>
        <div className='dark flex justify-between items-center w-full p-3 bg-white/20  outline-1 outline-offset-2 outline-white/25 rounded-lg backdrop-blur-lg'>
          <Image width={30} height={30} src='/logo.svg' alt='logo' />
          <div className='relative'>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='capitalize cursor-pointer'>
                  <Settings />
                  playground
                </Button>
              </PopoverTrigger>
              <PopoverContent className='space-y-4'>
                <h3 className='font-semibold mb-3'>Gradient Controls</h3>

                <Select
                  value={config.type}
                  onValueChange={(e) =>
                    updateConfig({ type: e as GradientType })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value='linear'>Linear</SelectItem>
                      <SelectItem value='conic'>Conic</SelectItem>
                      <SelectItem value='animated'>Animated</SelectItem>
                      <SelectItem value='wave'>Wave</SelectItem>
                      <SelectItem value='silk'>Silk</SelectItem>
                      <SelectItem value='smoke'>Smoke</SelectItem>
                      <SelectItem value='stripe'>Stripe</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className='space-y-2'>
                  {(['color1', 'color2', 'color3'] as const).map((colorKey) => (
                    <div key={colorKey} className='flex items-center space-x-3'>
                      <input
                        type='color'
                        value={rgbToHex(config[colorKey])}
                        onChange={(e) =>
                          updateConfig({
                            [colorKey]: hexToRgb(e.target.value),
                          })
                        }
                        className='w-10 h-6 rounded border cursor-pointer'
                      />
                      <input
                        type='text'
                        value={rgbToHex(config[colorKey])}
                        onChange={(e) =>
                          updateConfig({
                            [colorKey]: hexToRgb(e.target.value),
                          })
                        }
                        className='flex-1 border rounded px-2 py-1 text-xs'
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className='block text-sm mb-1'>
                    Speed: {config.speed.toFixed(1)}
                  </label>
                  <Slider
                    min={0}
                    onValueChange={(e) => updateConfig({ speed: Number(e) })}
                    value={[config.speed]}
                    max={3}
                    step={0.1}
                    aria-label='speed'
                  />
                </div>

                <div>
                  <label className='block text-sm mb-1'>
                    Scale: {config.scale.toFixed(1)}
                  </label>
                  <Slider
                    min={0.5}
                    onValueChange={(e) => updateConfig({ scale: Number(e) })}
                    value={[config.scale]}
                    max={3}
                    step={0.1}
                    aria-label='scale'
                  />
                </div>

                <div>
                  <label className='block text-sm mb-1'>
                    Noise: {config.noise.toFixed(2)}
                  </label>
                  <Slider
                    min={0}
                    onValueChange={(e) => updateConfig({ noise: Number(e) })}
                    value={[config.noise]}
                    max={0.5}
                    step={0.01}
                    aria-label='noise'
                  />
                </div>

                <div>
                  <p className='text-sm mb-2'>Presets:</p>
                  <div className='grid grid-cols-2 gap-1'>
                    {Object.keys(PRESETS).map((preset) => (
                      <Button
                        key={preset}
                        onClick={() =>
                          applyPreset(preset as keyof typeof PRESETS)
                        }
                        variant='outline'
                        size='sm'
                        className='text-xs capitalize'
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    className='flex-1 capitalize cursor-pointer'
                    onClick={() => copyCodeToClipboard(config)}
                    size='icon'
                  >
                    <Code />
                    copy config
                  </Button>
                  <Button
                    variant='outline'
                    className='cursor-pointer'
                    onClick={handleCaptureImage}
                    title='Capture Image'
                  >
                    <ImageDown />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <ContentDemo />

      <canvas
        ref={canvasRef}
        className={cn(
          'w-full h-full block absolute -z-10 top-0 touch-none select-none',
          className
        )}
      />
    </div>
  )
}
