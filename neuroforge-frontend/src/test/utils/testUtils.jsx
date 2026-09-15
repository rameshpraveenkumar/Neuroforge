import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import { DEMO_PERSONAS } from '../../utils/demoData';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

export const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@neuroforge.io',
  fullName: 'Alexander Vance',
  role: 'SYSTEM_ADMIN',
  roleDisplayName: 'System Administrator',
  avatarUrl: null,
};

export const defaultAuthContextValue = {
  token: 'mock-test-jwt-token',
  user: mockUser,
  role: 'SYSTEM_ADMIN',
  isAuthenticated: true,
  loading: false,
  error: null,
  demoPersonas: DEMO_PERSONAS,
  login: vi.fn().mockResolvedValue({ success: true }),
  demoSwitch: vi.fn().mockResolvedValue({ success: true }),
  logout: vi.fn(),
};

export function renderWithProviders(
  ui,
  {
    route = '/',
    authValue = null,
    includeRouter = true,
    ...renderOptions
  } = {}
) {
  if (route && typeof window !== 'undefined') {
    window.history.pushState({}, 'Test', route);
  }

  const resolvedAuthValue = authValue
    ? { ...defaultAuthContextValue, ...authValue }
    : defaultAuthContextValue;

  if (resolvedAuthValue && resolvedAuthValue.isAuthenticated !== false && resolvedAuthValue.user) {
    localStorage.setItem('neuroforge_token', resolvedAuthValue.token || 'mock-test-jwt-token');
    localStorage.setItem('neuroforge_user', JSON.stringify(resolvedAuthValue.user));
  } else if (authValue && authValue.isAuthenticated === false) {
    localStorage.removeItem('neuroforge_token');
    localStorage.removeItem('neuroforge_user');
  }

  function Wrapper({ children }) {
    if (!includeRouter) {
      return children;
    }

    return (
      <AuthContext.Provider value={resolvedAuthValue}>
        <ToastProvider>
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </ToastProvider>
      </AuthContext.Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { userEvent };