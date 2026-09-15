import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { App } from '../../App';
import { auditApi } from '../../api/auditApi';
import { authApi } from '../../api/authApi';
import { mockAuditLogs } from '../fixtures/auditFixtures';

vi.mock('../../api/auditApi', () => ({
  auditApi: {
    getAll: vi.fn(),
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

describe('Area Q: Role-Based Access Control (RBAC)', () => {
  it('allows SYSTEM_ADMIN to access /admin/audit-logs', async () => {
    authApi.getMe.mockResolvedValue({
      success: true,
      data: { id: 1, role: 'SYSTEM_ADMIN', fullName: 'Alexander Vance', username: 'admin' },
    });
    auditApi.getAll.mockResolvedValue({ success: true, data: mockAuditLogs });

    renderWithProviders(<App />, {
      route: '/admin/audit-logs',
      includeRouter: false,
      authValue: {
        role: 'SYSTEM_ADMIN',
        user: { id: 1, role: 'SYSTEM_ADMIN', fullName: 'Alexander Vance' },
        isAuthenticated: true,
        loading: false,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Security Audit Logs & Governance/i)).toBeInTheDocument();
    });
  });

  it('denies DEVELOPER access to /admin/audit-logs and displays AccessDenied', async () => {
    authApi.getMe.mockResolvedValue({
      success: true,
      data: { id: 2, role: 'DEVELOPER', fullName: 'Lucas Thorne', username: 'dev' },
    });

    renderWithProviders(<App />, {
      route: '/admin/audit-logs',
      includeRouter: false,
      authValue: {
        role: 'DEVELOPER',
        user: { id: 2, role: 'DEVELOPER', fullName: 'Lucas Thorne' },
        isAuthenticated: true,
        loading: false,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Access Restricted/i)).toBeInTheDocument();
    });
  });

  it('denies CLIENT access to /devops/pipelines and displays AccessDenied', async () => {
    authApi.getMe.mockResolvedValue({
      success: true,
      data: { id: 3, role: 'CLIENT', fullName: 'Victoria Sterling', username: 'client' },
    });

    renderWithProviders(<App />, {
      route: '/devops/pipelines',
      includeRouter: false,
      authValue: {
        role: 'CLIENT',
        user: { id: 3, role: 'CLIENT', fullName: 'Victoria Sterling' },
        isAuthenticated: true,
        loading: false,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Access Restricted/i)).toBeInTheDocument();
    });
  });
});
