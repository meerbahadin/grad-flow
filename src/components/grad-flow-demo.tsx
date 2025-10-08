'use client'

import { useCallback, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { GradFlowProps, GradientConfig } from '@/types/gradient'
import { DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer'
import { captureImage } from '@/lib/image-capture'
import { copyCodeToClipboard } from '@/lib/clipboard'
import { generateRandomColors as generateRandomGradient } from '@/lib/random-colors'
import { normalizeColor } from '@/lib/color-conversion'
import ContentDemo from './content-demo'
import { Code, ImageDown, Settings, Shuffle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Image from 'next/image'
import { GradientControls } from './demo/gradient-controls'
import { PresetButtons } from './demo/preset-buttons'

export default function GradFlowDemo({
  config: initialConfig,
  className = '',
}: GradFlowProps) {
  const [config, setConfig] = useState<GradientConfig>(() => {
    const normalized: GradientConfig = { ...DEFAULT_CONFIG }

    if (initialConfig) {
      if (initialConfig.color1) normalized.color1 = normalizeColor(initialConfig.color1)
      if (initialConfig.color2) normalized.color2 = normalizeColor(initialConfig.color2)
      if (initialConfig.color3) normalized.color3 = normalizeColor(initialConfig.color3)
      if (initialConfig.speed !== undefined) normalized.speed = initialConfig.speed
      if (initialConfig.scale !== undefined) normalized.scale = initialConfig.scale
      if (initialConfig.type) normalized.type = initialConfig.type
      if (initialConfig.noise !== undefined) normalized.noise = initialConfig.noise
    }

    return normalized
  })

  const { canvasRef, rendererRef, meshRef } = useWebGLRenderer(config)

  const updateConfig = useCallback(
    (updates: Partial<GradientConfig>) => {
      const newConfig = { ...config, ...updates }
      setConfig(newConfig)
    },
    [config]
  )

  const applyPreset = useCallback((presetName: keyof typeof PRESETS) => {
    setConfig((prev) => ({ ...prev, ...PRESETS[presetName] }))
  }, [])

  const handleRandomize = useCallback(() => {
    setConfig((prev) => ({ ...prev, ...generateRandomGradient() }))
  }, [])

  const handleCaptureImage = useCallback(() => {
    const canvas = canvasRef.current
    const renderer = rendererRef.current
    const mesh = meshRef.current

    if (!canvas || !renderer) {
      console.log('Canvas or renderer not ready. Please try again.')
      return
    }

    captureImage(canvas, renderer, mesh)
  }, [canvasRef, rendererRef, meshRef])

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
                <GradientControls
                  config={config}
                  onConfigChange={updateConfig}
                />
                <PresetButtons onApplyPreset={applyPreset} />

                <div className='flex gap-2'>
                  <Button
                    className='flex-1 capitalize cursor-pointer'
                    onClick={() => copyCodeToClipboard(config)}
                    size='icon'
                  >
                    <Code />
                    copy
                  </Button>
                  <Button
                    variant='outline'
                    className='cursor-pointer'
                    onClick={handleRandomize}
                    title='Random Gradient'
                  >
                    <Shuffle />
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
