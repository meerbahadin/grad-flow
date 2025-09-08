'use client'

import { useEffect, useRef, useMemo } from 'react'
import { Mesh, Program, Renderer, Transform, Plane } from 'ogl'

import { cn } from '@/lib/utils'

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

export type GradientType =
  | 'linear'
  | 'radial'
  | 'diagonal'
  | 'animated'
  | 'conic'
  | 'wave'

export type GradFlowProps = {
  config?: Partial<GradientConfig>
  className?: string
}

export const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

export const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;  
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_scale;
  uniform int u_type;
  uniform float u_noise;
  varying vec2 vUv;

  #define PI 3.14159265359

  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 linearGradient(vec2 uv, float time) {
    float t = (uv.y * u_scale) + sin(uv.x * PI + time) * 0.1;
    t = clamp(t, 0.0, 1.0);
    
    return t < 0.5 
      ? mix(u_color1, u_color2, t * 2.0)
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 radialGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    float dist = length(uv - center) * u_scale + sin(time) * 0.1;
    
    return dist < 0.5
      ? mix(u_color1, u_color2, dist * 2.0)
      : mix(u_color2, u_color3, clamp((dist - 0.5) * 2.0, 0.0, 1.0));
  }

  vec3 diagonalGradient(vec2 uv, float time) {
    float t = ((uv.x + uv.y) * 0.5 * u_scale) + sin(time) * 0.05;
    t = clamp(t, 0.0, 1.0);
    
    return t < 0.5
      ? mix(u_color1, u_color2, t * 2.0) 
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 conicGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;
    
    float angle = atan(pos.y, pos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI);
    float t = fract(normalizedAngle * u_scale + time * 0.3);
    
    vec3 color;
    if (t < 0.33) {
      color = mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
    } else if (t < 0.66) {
      color = mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
    } else {
      color = mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
    }
    
    float dist = length(pos);
    color += sin(dist * 8.0 + time * 1.5) * 0.03;
    
    return color;
  }

  vec3 animatedGradient(vec2 uv, float time) {
    vec2 pos = uv * u_scale + vec2(sin(time), cos(time * 0.7)) * 0.2;
    
    float n1 = sin(pos.x * 3.0 + time) * sin(pos.y * 2.5 + time * 1.1);
    float n2 = cos(pos.x * 2.0 + time * 0.8) * cos(pos.y * 3.5 + time * 0.6);
    float blend = (n1 + n2) * 0.5 + 0.5;
    
    vec3 col1 = mix(u_color1, u_color2, blend);
    vec3 col2 = mix(u_color2, u_color3, sin(blend * PI + time) * 0.5 + 0.5);
    
    return mix(col1, col2, uv.y);
  }

  vec3 waveGradient(vec2 uv, float time) {
    float y = uv.y;
    
    float wave1 = sin(uv.x * PI * u_scale * 0.8 + time * u_speed * 0.5) * 0.1;
    float wave2 = sin(uv.x * PI * u_scale * 0.5 + time * u_speed * 0.3) * 0.15;  
    float wave3 = sin(uv.x * PI * u_scale * 1.2 + time * u_speed * 0.8) * 0.2; 
    
    float flowingY = y + wave1 + wave2 + wave3;
    float pattern = clamp(flowingY, 0.0, 1.0);
    pattern = smoothstep(0.0, 1.0, pattern);
    
    vec3 color;
    if (pattern < 0.33) {
      float t = smoothstep(0.0, 0.33, pattern);
      color = mix(u_color1, u_color2, t);
    } else if (pattern < 0.66) {
      float t = smoothstep(0.33, 0.66, pattern);
      color = mix(u_color2, u_color3, t);
    } else {
      float t = smoothstep(0.66, 1.0, pattern);
      color = mix(u_color3, u_color1, t);
    }
    
    float variation = sin(uv.x * PI * 2.0 + time * u_speed) * 
    color += variation;
    
    return clamp(color, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float time = u_time * u_speed;
    
    vec3 color;
    
    if (u_type == 0) {
      color = linearGradient(uv, time);
    } else if (u_type == 1) {
      color = radialGradient(uv, time);
    } else if (u_type == 2) {
      color = diagonalGradient(uv, time);
    } else if (u_type == 3) {
      color = conicGradient(uv, time);
    } else if (u_type == 4) {
      color = animatedGradient(uv, time);
    } else {
      color = waveGradient(uv, time);
    }
    
    if (u_noise > 0.001) {
      float grain = noise(uv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const DEFAULT_CONFIG: GradientConfig = {
  color1: { r: 107, g: 85, b: 216 },
  color2: { r: 241, g: 96, b: 59 },
  color3: { r: 255, g: 255, b: 255 },
  speed: 0.6,
  scale: 1.2,
  type: 'animated',
  noise: 0.1,
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
  conic: 3,
  animated: 4,
  wave: 5,
}

export default function GradFlow({
  config: initialConfig,
  className = '',
}: GradFlowProps) {
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

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full block select-none touch-none', className)}
      aria-label='gradflow animated gradient background'
    />
  )
}
