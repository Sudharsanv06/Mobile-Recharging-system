import { vi } from 'vitest';

const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  create: () => mockAxios,
  defaults: { headers: {} },
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
};

export default mockAxios;
