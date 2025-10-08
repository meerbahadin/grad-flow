'use client'

import { Button } from '@/components/ui/button'
import { PRESETS } from '@/constants/gradients'

interface PresetButtonsProps {
  onApplyPreset: (presetName: keyof typeof PRESETS) => void
}

export function PresetButtons({ onApplyPreset }: PresetButtonsProps) {
  return (
    <div>
      <p className='text-sm mb-2'>Presets:</p>
      <div className='grid grid-cols-2 gap-1'>
        {Object.keys(PRESETS).map((preset) => (
          <Button
            key={preset}
            onClick={() => onApplyPreset(preset as keyof typeof PRESETS)}
            variant='outline'
            size='sm'
            className='text-xs capitalize'
          >
            {preset}
          </Button>
        ))}
      </div>
    </div>
  )
}
