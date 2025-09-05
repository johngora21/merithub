import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isAdmin = process.env.VITE_ADMIN === 'true'
  
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          admin: resolve(__dirname, 'admin.html')
        }
      }
    },
    server: {
      port: isAdmin ? 3000 : 5174,
      open: isAdmin ? '/admin.html' : '/'
    },
    preview: {
      port: 3000
    }
  }
})