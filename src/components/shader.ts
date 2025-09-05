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

float noise(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 linearGradient(vec2 uv, float time) {
  float t = uv.y + sin(uv.x * 3.14159 + time) * 0.1;
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
  float t = (uv.x + uv.y) * 0.5 + sin(time) * 0.05;
  return t < 0.5
    ? mix(u_color1, u_color2, t * 2.0) 
    : mix(u_color2, u_color3, (t - 0.5) * 2.0);
}

vec3 animatedGradient(vec2 uv, float time) {
  vec2 pos = uv * u_scale + vec2(sin(time), cos(time * 0.7)) * 0.2;
  
  float n1 = sin(pos.x * 3.0 + time) * sin(pos.y * 2.5 + time * 1.1);
  float n2 = cos(pos.x * 2.0 + time * 0.8) * cos(pos.y * 3.5 + time * 0.6);
  float blend = (n1 + n2) * 0.5 + 0.5;
  
  vec3 col1 = mix(u_color1, u_color2, blend);
  vec3 col2 = mix(u_color2, u_color3, sin(blend * 3.14159 + time) * 0.5 + 0.5);
  
  return mix(col1, col2, uv.y);
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
  } else {
    color = animatedGradient(uv, time);
  }
  
  if (u_noise > 0.001) {
    float grain = noise(uv * 200.0 + time * 0.1);
    color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`
