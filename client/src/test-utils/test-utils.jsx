import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from '../contexts/authContext';

// A lightweight Test Auth Provider to avoid network calls and side-effects in tests
export const TestAuthProvider = ({ children, user = { name: 'Test User', id: 'test-user' }, token = 'test-token' }) => {
  const value = {
    user,
    token,
    login: async () => ({ ok: true, user }),
    register: async () => ({ ok: true, user }),
    logout: () => {},
    refreshProfile: async () => {},
    loading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function renderWithProviders(ui, { route = '/', user = null, token = null, ...options } = {}) {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <TestAuthProvider user={user || { name: 'Test User', id: 'test-user' }} token={token || 'test-token'}>
      <BrowserRouter>{children}</BrowserRouter>
    </TestAuthProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
