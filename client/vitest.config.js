import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}', 'src/**/__tests__/**/*.test.{js,jsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: ['src/test-utils/vitest.setup.js'],
    globals: true,
  },
});
