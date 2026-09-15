import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { App } from '../../App';
import { analyticsApi } from '../../api/analyticsApi';
import { authApi } from '../../api/authApi';
import { mockAnalyticsOverview, mockDoraMetrics } from '../fixtures/analyticsFixtures';
import { mockUser } from '../utils/testUtils';

vi.mock('../../api/analyticsApi', () => ({
  analyticsApi: {
    getOverview: vi.fn(),
    getDoraMetrics: vi.fn(),
  },
}));

vi.mock('../../api/authApi', () => ({
  authApi: {
    getMe: vi.fn(),
    getDemoPersonas: vi.fn().mockResolvedValue({ success: true, data: [] }),
    login: vi.fn(),
    demoSwitch: vi.fn(),
  },
}));

describe('Area A: Application Routing', () => {
  it('redirects unauthenticated users to /login', async () => {
    localStorage.clear();
    renderWithProviders(<App />, {
      route: '/dashboard',
      includeRouter: false,
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In to NeuroForge/i })).toBeInTheDocument();
    });
  });

  it('renders login page on /login route', async () => {
    localStorage.clear();
    renderWithProviders(<App />, {
      route: '/login',
      includeRouter: false,
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In to NeuroForge/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/dev@neuroforge.io/i)).toBeInTheDocument();
    });
  });

  it('allows authenticated users to access /dashboard', async () => {
    localStorage.setItem('neuroforge_token', 'mock-jwt-token');
    localStorage.setItem('neuroforge_user', JSON.stringify(mockUser));
    authApi.getMe.mockResolvedValue({ success: true, data: mockUser });
    analyticsApi.getOverview.mockResolvedValue({ success: true, data: mockAnalyticsOverview });
    analyticsApi.getDoraMetrics.mockResolvedValue({ success: true, data: mockDoraMetrics });

    renderWithProviders(<App />, {
      route: '/dashboard',
      includeRouter: false,
    });

    await waitFor(() => {
      expect(screen.getByText(/NEUROFORGE/i)).toBeInTheDocument();
    });
  });

  it('redirects unknown routes to /dashboard for authenticated users', async () => {
    localStorage.setItem('neuroforge_token', 'mock-jwt-token');
    localStorage.setItem('neuroforge_user', JSON.stringify(mockUser));
    authApi.getMe.mockResolvedValue({ success: true, data: mockUser });
    analyticsApi.getOverview.mockResolvedValue({ success: true, data: mockAnalyticsOverview });
    analyticsApi.getDoraMetrics.mockResolvedValue({ success: true, data: mockDoraMetrics });

    renderWithProviders(<App />, {
      route: '/unknown-system-route',
      includeRouter: false,
    });

    await waitFor(() => {
      expect(screen.getByText(/NEUROFORGE/i)).toBeInTheDocument();
    });
  });
});
