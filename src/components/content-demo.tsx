import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Download, Github } from 'lucide-react'

const ContentDemo = () => {
  return (
    <>
      {' '}
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
            <Download />
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
            <Button
              size='icon'
              className='cursor-pointer dark text-foreground bg-background/30 hover:bg-background/50'
            >
              <Github />
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default ContentDemo
