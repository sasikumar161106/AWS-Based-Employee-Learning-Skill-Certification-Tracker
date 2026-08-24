import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://ddkho7ox7a.execute-api.ap-south-1.amazonaws.com/Prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});
