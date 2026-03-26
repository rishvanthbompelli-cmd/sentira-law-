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
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log('[Proxy] Forwarding request:', req.method, req.url)
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log('[Proxy] Response:', proxyRes.statusCode, req.url)
        },
        onError: (err, req, res) => {
          console.error('[Proxy Error]', err.message)
        }
      },
      '/webhook-test': {
        target: 'https://basinlike-hermila-nonmeditative.ngrok-free.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
