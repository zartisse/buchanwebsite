import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Local dev: `/`  |  GitHub Pages CI sets VITE_BASE_PATH=/buchanwebsite/
  base: process.env.VITE_BASE_PATH || '/',
})
