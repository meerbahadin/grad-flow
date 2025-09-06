import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/code/code-block'
import GradFlowDemo from '@/components/grad-flow-demo'

import { IconBrandGithub } from '@tabler/icons-react'

export default function Home() {
  return (
    <main>
      <GradFlowDemo />

      <section
        id='installation'
        className='container max-w-3xl py-12 space-y-8'
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-2xl capitalize'>Installation</h1>
            <p className='text-zinc-600'>
              Install the required dependencies first, then copy the component
              code below. GradFlow requires the OGL library.
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Install Dependencies</h3>
            <CodeBlock code={`npm install ogl clsx tailwind-merge`} />
          </div>

          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Component</h3>
            <CodeBlock filePath='src/components/grad-flow.tsx' />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-lg'>Utils</h1>
            <p className='text-zinc-600 text-sm'>
              Create a utility function for merging Tailwind CSS classes.
            </p>
          </div>
          <CodeBlock
            code={`// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
          />
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-lg'>Usage</h1>
            <p className='text-zinc-600 text-sm'>
              Configure your gradient background with custom colors, animation
              speed, scale, and noise settings. The component offers full
              control over the visual appearance and behavior of your animated
              gradients.
            </p>
            <p className='text-zinc-600 text-sm mt-2'>
              Example as a full screen background:
            </p>
          </div>
          <CodeBlock
            code={`<div className='min-h-screen w-full relative overflow-hidden isolate'>
  <GradFlow
    className='-z-10 absolute'
    config={{
      color1: { r: 107, g: 85, b: 216 },
      color2: { r: 241, g: 96, b: 59 },
      color3: { r: 255, g: 255, b: 255 },
      speed: 0.6,
      scale: 1.2,
      type: 'animated',
      noise: 0.15
    }}
  />

  {/* your component goes here */}
</div>`}
          />
        </div>

        <div className='flex w-full items-center justify-between gap-2'>
          <Link href='https://www.meera.dev/' target='_blank'>
            <Image
              src='https://www.meera.dev/logo.svg'
              width={28}
              height={28}
              alt='Meera Dev Logo'
              className='w-8 h-8 mask-t-from-40% invert-100'
            />
          </Link>

          <div className='flex gap-2'>
            <Link
              target='_blank'
              href='https://github.com/meerbahadin/grad-flow'
            >
              <Button
                variant='secondary'
                size='icon'
                className='cursor-pointer'
              >
                <IconBrandGithub />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
