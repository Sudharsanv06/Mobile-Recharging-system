import React from 'react';
import { renderWithProviders, screen } from '../../test-utils/test-utils';
import Payment from '../Payment';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => () => {}),
  useLocation: vi.fn(() => ({})),
  BrowserRouter: ({ children }) => children,
}));

describe('Payment component', () => {
  it('renders payment order summary', () => {
    renderWithProviders(<Payment isAuthenticated={true} currentUser={{}} rechargeDetails={{ amount: '199', operator: 'Jio' }} />);

    expect(screen.getByText(/Complete Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
    // multiple occurrences of the amount may be rendered; assert at least one exists
    expect(screen.getAllByText(/₹199/).length).toBeGreaterThan(0);
  });
});
