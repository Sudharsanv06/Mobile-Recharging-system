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

// Some libraries (e.g. html2canvas) call window.getComputedStyle with
// pseudo-element arguments or in ways that older jsdom versions don't
// implement. Provide a forgiving fallback so tests don't throw.
if (typeof window !== 'undefined') {
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt, pseudoElt) => {
    try {
      if (typeof originalGetComputedStyle === 'function') {
        return originalGetComputedStyle.call(window, elt, pseudoElt);
      }
    } catch (e) {
      // fall through to return a minimal stub below
    }
    return {
      getPropertyValue: () => '',
    };
  };
  // Some code calls `window.computedStyle` (not a standard) — mirror it.
  // This prevents jsdom from throwing "Not implemented: window.computedStyle"
  // when libraries use that non-standard name.
  // eslint-disable-next-line no-undef
  window.computedStyle = window.getComputedStyle;
}
