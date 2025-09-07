'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mesh, Program, Renderer, Transform, Plane } from 'ogl'
import {
  IconBrandGithub,
  IconCode,
  IconDownload,
  IconScreenshot,
  IconSettings,
  IconWand,
} from '@tabler/icons-react'

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
import { GradFlowProps, GradientConfig, GradientType, RGB } from './grad-flow'

import { fragmentShader, vertexShader } from './grad-flow'

const DEFAULT_CONFIG: GradientConfig = {
  color1: { r: 107, g: 85, b: 216 },
  color2: { r: 241, g: 96, b: 59 },
  color3: { r: 255, g: 255, b: 255 },
  speed: 0.6,
  scale: 1.2,
  type: 'animated',
  noise: 0.15,
}

const PRESETS = {
  purple: {
    color1: { r: 102, g: 126, b: 234 },
    color2: { r: 118, g: 75, b: 162 },
    color3: { r: 240, g: 147, b: 251 },
    noise: 0.1,
  },
  sunset: {
    color1: { r: 255, g: 236, b: 210 },
    color2: { r: 252, g: 182, b: 159 },
    color3: { r: 255, g: 138, b: 128 },
    noise: 0.05,
  },
  pastel: {
    color1: { r: 168, g: 237, b: 234 },
    color2: { r: 254, g: 214, b: 227 },
    color3: { r: 210, g: 153, b: 194 },
    noise: 0.02,
  },
  modern: {
    color1: { r: 255, g: 255, b: 255 },
    color2: { r: 241, g: 96, b: 59 },
    color3: { r: 22, g: 87, b: 218 },
    speed: 0.6,
    scale: 1,
    type: 'conic',
    noise: 0.1,
  },
} as const

const normalizeRgb = (rgb: RGB): [number, number, number] => [
  rgb.r / 255,
  rgb.g / 255,
  rgb.b / 255,
]

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

const gradientTypeNumber = {
  linear: 0,
  radial: 1,
  diagonal: 2,
  conic: 3,
  animated: 4,
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
      console.log('Code copied to clipboard!')
      alert('Code copied to clipboard!')
    })
    .catch((err) => {
      console.error('Failed to copy: ', err)
      alert('Failed to copy code. Please try again.')
    })
}

export default function GradFlowDemo({
  config: initialConfig,
  className = '',
}: GradFlowProps) {
  const [showControls, setShowControls] = useState(false)
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
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry: plane, program })
    meshRef.current = mesh

    const scene = new Transform()
    sceneRef.current = scene
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

      // Clean up refs
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
      alert('canvas not found. please try again.')
      return
    }

    if (!renderer) {
      alert('renderer not initialized. please try again.')
      return
    }

    captureImage(canvas, renderer, mesh)
  }, [])

  return (
    <div className='h-screen w-full flex flex-col items-center justify-between relative py-2 rounded-3xl'>
      <div className='flex w-full max-w-md z-50 container'>
        <div className='flex justify-between items-center w-full p-3 bg-gradient-to-tr from-background to-transparent outline-1 outline-offset-2 outline-white/15 rounded-lg backdrop-blur-lg'>
          <IconWand />
          <div className='relative'>
            <Button
              className='capitalize cursor-pointer'
              onClick={() => setShowControls(!showControls)}
            >
              <IconSettings />
              playground
            </Button>

            {showControls && (
              <div className='bg-background absolute top-14 right-0 text-foreground backdrop-blur-sm rounded-lg p-4 space-y-4 overflow-y-auto z-[60] w-80 shadow-lg border'>
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
                      <SelectItem value='radial'>Radial</SelectItem>
                      <SelectItem value='diagonal'>Diagonal</SelectItem>
                      <SelectItem value='conic'>Conic</SelectItem>
                      <SelectItem value='animated'>Animated</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className='space-y-2'>
                  {(['color1', 'color2', 'color3'] as const).map(
                    (colorKey, idx) => (
                      <div
                        key={colorKey}
                        className='flex items-center space-x-3'
                      >
                        <label className='text-xs w-12'>Color {idx + 1}</label>
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
                    )
                  )}
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
                    <IconCode />
                    copy config
                  </Button>
                  <Button
                    variant='outline'
                    className='cursor-pointer'
                    onClick={handleCaptureImage}
                    title='Capture Image'
                  >
                    <IconScreenshot />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='gap-4 flex flex-col items-center max-w-4xl'>
        <div className='space-y-2 text-white text-center'>
          <h1 className='bg-gradient-to-tr from-white via-white to-transparent bg-clip-text text-transparent text-4xl md:text-7xl font-bold leading-tight text-balance'>
            Create Amazing Gradients Using WebGL
          </h1>
          <p className='md:text-xl leading-relaxed text-balance'>
            High-performance React component for animated WebGL gradient
            backgrounds with real-time customization.
          </p>
        </div>

        <Link href='/#installation'>
          <Button className='capitalize cursor-pointer'>
            <IconDownload />
            installation
          </Button>
        </Link>
      </div>

      <div className='flex w-full items-center justify-between gap-2 container'>
        <Link href='https://www.meera.dev/' target='_blank'>
          <Image
            src='https://www.meera.dev/logo.svg'
            width={28}
            height={28}
            alt='Meera Dev Logo'
            className='w-8 h-8 mask-t-from-40%'
          />
        </Link>

        <div className='flex gap-2'>
          <Link target='_blank' href='https://github.com/meerbahadin/grad-flow'>
            <Button size='icon' className='cursor-pointer'>
              <IconBrandGithub />
            </Button>
          </Link>
        </div>
      </div>

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
