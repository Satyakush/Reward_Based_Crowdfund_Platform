// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Inside frontend/vite.config.js
         // Inside frontend/vite.config.js
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});