import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // increase limit from 500 → 2000 KB
  }
})
