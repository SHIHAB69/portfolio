import { defineConfig } from 'vite'

export default {
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
} 