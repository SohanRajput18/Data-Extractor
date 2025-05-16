import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/serp': {
        target: 'https://serpapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/serp/, ''),
        secure: false
      },
      '/api/hunter': {
        target: 'https://api.hunter.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hunter/, ''),
        secure: false
      }
    }
  }
});
