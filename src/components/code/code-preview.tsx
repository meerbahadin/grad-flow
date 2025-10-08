'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type CodePreviewProps = {
  code: string
  children: React.ReactNode
}

export default function CodePreview({ code, children }: CodePreviewProps) {
  const [hasCheckIcon, setHasCheckIcon] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setHasCheckIcon(true)

    setTimeout(() => {
      setHasCheckIcon(false)
    }, 1000)
  }

  return (
    <div className='relative group rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden'>
      <button
        className='absolute top-3 right-3 z-10 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 opacity-0 group-hover:opacity-100'
        onClick={onCopy}
        aria-label='Copy code'
      >
        <div
          className={`transform transition-all duration-200 ${
            hasCheckIcon ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <Copy className='h-4 w-4 text-zinc-300' />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transform transition-all duration-200 ${
            hasCheckIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <Check className='h-4 w-4 text-emerald-400' />
        </div>
      </button>
      <div className='max-h-[650px] overflow-auto'>
        <div className='p-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
