import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  // ✅ Vitest Configuration
  test: {
    globals: true, // enables describe/it/expect
    environment: 'jsdom', // required for React component testing
    setupFiles: './src/setupTests.js', // load setupTests before running tests
  },
});
