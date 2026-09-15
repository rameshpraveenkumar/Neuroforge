import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../utils/testUtils';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { authApi } from '../../api/authApi';

vi.mock('../../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    demoSwitch: vi.fn(),
    getDemoPersonas: vi.fn().mockResolvedValue({ success: true, data: [] }),
    getMe: vi.fn(),
  },
}));

describe('Area B: Authentication & Login', () => {
  it('renders login form with inputs and submit button', () => {
    renderWithProviders(<LoginPage />, {
      authValue: { token: null, user: null, isAuthenticated: false, loading: false },
    });

    expect(screen.getByText(/Email Address \/ Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/dev@neuroforge.io/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('allows user to type credentials and submit login form', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      authValue: {
        login: mockLogin,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      },
    });

    const usernameInput = screen.getByPlaceholderText(/dev@neuroforge.io/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    await user.clear(usernameInput);
    await user.type(usernameInput, 'admin@neuroforge.io');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'secret123');

    await user.click(submitBtn);

    expect(mockLogin).toHaveBeenCalledWith('admin@neuroforge.io', 'secret123');
  });

  it('displays error message when login fails', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: false, message: 'Invalid credentials provided' });
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      authValue: {
        login: mockLogin,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    });

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials provided/i)).toBeInTheDocument();
    });
  });

  it('renders all quick login persona buttons', () => {
    renderWithProviders(<LoginPage />, {
      authValue: { token: null, user: null, isAuthenticated: false, loading: false },
    });

    expect(screen.getByText(/System Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/QA\/Test Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/DevOps Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Client/i)).toBeInTheDocument();
  });
});
