// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove proxy — only needed in local dev
  // server: { ... } ← DELETE ENTIRE BLOCK
})