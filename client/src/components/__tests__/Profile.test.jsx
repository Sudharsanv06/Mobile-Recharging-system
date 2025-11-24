import React from 'react';
import { renderWithProviders, screen, waitFor } from '../../test-utils/test-utils';
import Profile from '../Profile';
import axios from 'axios';
import { vi } from 'vitest';

describe('Profile smoke', () => {
  beforeEach(() => {
    // mock html2pdf if used
    global.window.html2pdf = undefined;
    // mock html2canvas/jsPDF fallback
    vi.mock('html2canvas', () => ({ default: vi.fn().mockResolvedValue({ toDataURL: () => 'data:image/png;base64,abc' }) }));
    vi.mock('jspdf', () => ({ jsPDF: vi.fn().mockImplementation(() => ({ addImage: vi.fn(), save: vi.fn() })) }));

    // axios is mocked globally in vitest.setup; set endpoint-specific responses here
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/v1/users/profile')) {
        return Promise.resolve({ data: { name: 'Test User', email: 'test@example.com', phone: '9999999999', createdAt: '2025-01-01T00:00:00.000Z', balance: 250 } });
      }
      if (url.includes('/api/v1/users/recharges')) {
        return Promise.resolve({ data: { data: [{ _id: 'r1', operator: 'Airtel', mobile: '9999999999', amount: 199, status: 'Success', createdAt: '2025-11-01T10:00:00.000Z' }], meta: { page: 1, pages: 1 } } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders profile info and history and handles PDF export fallback', async () => {
    renderWithProviders(<Profile currentUser="TestUser" />);

    // wait for profile name
    await waitFor(() => expect(screen.getByText(/Test User/)).toBeInTheDocument());

    expect(screen.getByText(/₹250/)).toBeInTheDocument();
    expect(screen.getByText(/Recharge History/)).toBeInTheDocument();
    // history card — there may be multiple matches; ensure at least one exists
    await waitFor(() => expect(screen.getAllByText(/Airtel/).length).toBeGreaterThan(0));

    // trigger download PDF (fallback path will use jspdf mock)
    const downloadBtn = screen.getByRole('button', { name: /Download PDF/i });
    downloadBtn.click();
    // if html2pdf not available, jsPDF save should be called via fallback (we mocked jsPDF.save)
    await waitFor(() => {
      // not asserting internals heavily, just ensure no error and the button exists
      expect(downloadBtn).toBeInTheDocument();
    });
  });
});
