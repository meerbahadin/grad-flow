# GradFlow

A powerful React component that creates stunning animated gradient backgrounds using WebGL shaders. Built with Next.js, TypeScript, and OGL for high-performance rendering.

## Features

- 🎨 **7 Gradient Types**: Linear, Conic, Animated, Wave, Silk, Smoke, and Stripe
- 🚀 **High Performance**: WebGL-powered rendering with optimized shaders
- 🎛️ **Fully Customizable**: Control colors, animation speed, scale, and noise
- 📱 **Responsive**: Automatically adapts to container size
- 🔧 **TypeScript Support**: Fully typed API with excellent developer experience
- 🎭 **Easy Integration**: Drop-in component for any React/Next.js project

## Demo

Visit the live demo to see GradFlow in action and experiment with different configurations.

## Installation

Install the required dependencies:

```bash
npm install ogl clsx tailwind-merge
```

## Quick Start

1. Copy the component code from `src/components/grad-flow.tsx`
2. Create a utility function for merging classes:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

3. Use the component:

```tsx
import GradFlow from '@/components/grad-flow'

export default function App() {
  return (
    <div className='min-h-screen w-full relative overflow-hidden isolate'>
      <GradFlow
        className='-z-10 absolute'
        config={{
          color1: { r: 40, g: 25, b: 118 },
          color2: { r: 241, g: 96, b: 59 },
          color3: { r: 255, g: 255, b: 255 },
          speed: 0.4,
          scale: 1.2,
          type: 'animated',
          noise: 0.1,
        }}
      />

      {/* Your content here */}
    </div>
  )
}
```

## API Reference

### Props

| Prop        | Type                      | Default            | Description                   |
| ----------- | ------------------------- | ------------------ | ----------------------------- |
| `config`    | `Partial<GradientConfig>` | See default config | Gradient configuration object |
| `className` | `string`                  | `''`               | Additional CSS classes        |

### GradientConfig

| Property | Type           | Default                      | Description                 |
| -------- | -------------- | ---------------------------- | --------------------------- |
| `color1` | `RGB`          | `{ r: 226, g: 98, b: 75 }`   | First gradient color        |
| `color2` | `RGB`          | `{ r: 255, g: 255, b: 255 }` | Second gradient color       |
| `color3` | `RGB`          | `{ r: 30, g: 34, b: 159 }`   | Third gradient color        |
| `speed`  | `number`       | `0.4`                        | Animation speed (0.1 - 2.0) |
| `scale`  | `number`       | `1`                          | Pattern scale (0.5 - 3.0)   |
| `type`   | `GradientType` | `'stripe'`                   | Gradient pattern type       |
| `noise`  | `number`       | `0.08`                       | Noise intensity (0 - 1)     |

### Gradient Types

- `'linear'` - Classic linear gradient with wave distortion
- `'animated'` - Dynamic flowing patterns with rotation
- `'conic'` - Circular/radial gradient patterns
- `'wave'` - Wave-based undulating patterns
- `'silk'` - Smooth silk-like flowing textures
- `'smoke'` - Organic smoke-like patterns
- `'stripe'` - Warped stripe patterns

### RGB Type

```typescript
type RGB = {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}
```

## Examples

### Full Screen Background

```tsx
<div className='min-h-screen w-full relative overflow-hidden isolate'>
  <GradFlow
    className='-z-10 absolute'
    config={{
      type: 'animated',
      speed: 0.3,
      scale: 1.5,
    }}
  />
  <YourContent />
</div>
```

### Card Background

```tsx
<div className='relative p-8 rounded-lg overflow-hidden'>
  <GradFlow
    className='absolute inset-0 opacity-20'
    config={{
      type: 'silk',
      color1: { r: 59, g: 130, b: 246 },
      color2: { r: 139, g: 92, b: 246 },
      color3: { r: 236, g: 72, b: 153 },
    }}
  />
  <div className='relative z-10'>
    <h1>Your Content</h1>
  </div>
</div>
```

### Hero Section

```tsx
<section className='relative h-screen flex items-center justify-center overflow-hidden'>
  <GradFlow
    className='absolute inset-0'
    config={{
      type: 'wave',
      speed: 0.2,
      scale: 0.8,
      noise: 0.15,
    }}
  />
  <div className='relative z-10 text-center text-white'>
    <h1 className='text-6xl font-bold'>Welcome</h1>
  </div>
</section>
```

## Performance Tips

- Use `scale` values between 0.5-2.0 for optimal performance
- Lower `noise` values (< 0.2) perform better
- Consider using `will-change: transform` CSS for smooth animations
- The component automatically limits device pixel ratio to 2 for performance

## Requirements

- React 18+
- Next.js 13+ (for the current implementation)
- Modern browser with WebGL support
- OGL library for WebGL operations

## Browser Support

GradFlow works in all modern browsers that support WebGL:

- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## License

MIT License - feel free to use in your projects!

## Credits

Created by [Meer](https://www.meera.dev/)

---

**Note**: This component requires WebGL support. It gracefully handles unsupported environments but won't render gradients in very old browsers.
