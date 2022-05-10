import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
const target: string = process.env.PROXY_TARGET ?? 'http://localhost:3000'

export default defineConfig({
  server: {
    proxy: {
      '/api': { target },
    },
  },
  plugins: [react()],
})
