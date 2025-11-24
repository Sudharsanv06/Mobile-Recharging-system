import React from 'react';
import { renderWithProviders, screen } from '../../test-utils/test-utils';
import Login from '../Login';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => () => {}),
  Link: ({ children }) => children,
  BrowserRouter: ({ children }) => children,
}));

describe('Login component', () => {
  it('renders login form and fields', () => {
    renderWithProviders(<Login onLogin={() => {}} />);

    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
});
