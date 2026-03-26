import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "basinlike-hermila-nonmeditative.ngrok-free.dev"
    ],
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/webhook-test': {
        target: 'https://basinlike-hermila-nonmeditative.ngrok-free.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
