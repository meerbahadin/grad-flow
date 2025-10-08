import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, './src'),
    }
  },
})
