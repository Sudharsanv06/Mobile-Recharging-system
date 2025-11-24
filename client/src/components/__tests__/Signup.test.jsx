import React from 'react';
import { renderWithProviders, screen } from '../../test-utils/test-utils';
import Signup from '../Signup';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => () => {}),
  Link: ({ children }) => children,
  BrowserRouter: ({ children }) => children,
}));

describe('Signup component', () => {
  it('renders signup form and fields', () => {
    renderWithProviders(<Signup onSignup={() => {}} />);

    expect(screen.getByText(/Join Top It Up!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    // there may be two password fields (password + confirm); assert at least one exists
    expect(screen.getAllByLabelText(/Password/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });
});
