import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [reactPlugin()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/dolarvzla': {
        target: 'https://rates.dolarvzla.com',
        changeOrigin: true,
        rewrite: (targetPath) => targetPath.replace(/^\/api\/dolarvzla/, '')
      }
    }
  }
});
