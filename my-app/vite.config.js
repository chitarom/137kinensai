import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '192.168.1.19', // ← ここがポイント
    port: 5173,
    strictPort: true
  }
})

