import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '^/(?!src|@vite|node_modules|assets).*': {
        target: 'http://backend:8000',
        changeOrigin: true,
        rewrite: path => path,
      },
    },
  },
});