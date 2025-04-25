import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend server
      '/api': {
        target: 'http://localhost:5001', // Your backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        // secure: false, // Uncomment if backend is not using HTTPS (dev only)
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: if you don't want /api prefix sent to backend
      }
    }
  }
})
