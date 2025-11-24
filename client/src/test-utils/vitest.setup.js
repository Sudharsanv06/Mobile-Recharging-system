import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Provide a safe global `apiBase` used by some components to avoid ReferenceError in tests
globalThis.apiBase = globalThis.apiBase ?? '';

// Create a mock axios object that matches axios.create() shape including interceptors
const mockAxios = {
  get: vi.fn(() => Promise.resolve({ data: {} })),
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} })),
  patch: vi.fn(() => Promise.resolve({ data: {} })),
  create: () => mockAxios,
  defaults: { headers: { common: {} } },
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() },
  },
};

// Mock axios so `import axios from 'axios'` returns our mock
vi.mock('axios', () => ({ default: mockAxios }));

// Any other global test setup can go here
// e.g., global.fetch polyfills, global mocks, etc.
