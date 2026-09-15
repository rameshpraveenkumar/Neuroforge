import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { AuditLogsPage } from '../../pages/Admin/AuditLogsPage';
import { auditApi } from '../../api/auditApi';
import { mockAuditLogs } from '../fixtures/auditFixtures';

vi.mock('../../api/auditApi', () => ({
  auditApi: {
    getAll: vi.fn(),
  },
}));

describe('Area P: Audit Logs & Admin Access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auditApi.getAll.mockResolvedValue({ success: true, data: mockAuditLogs });
  });

  it('renders audit logs table with event types and actors', async () => {
    renderWithProviders(<AuditLogsPage />, {
      authValue: { role: 'SYSTEM_ADMIN', user: { fullName: 'Alexander Vance' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('AUTH_LOGIN_SUCCESS').length).toBeGreaterThan(0);
      expect(screen.getAllByText('AI_SYNTHESIS_OFFLINE').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PIPELINE_RUN_TRIGGER').length).toBeGreaterThan(0);
      expect(screen.getByText(/admin \(System Administrator\)/i)).toBeInTheDocument();
    });
  });

  it('displays export CSV and JSON triggers', async () => {
    renderWithProviders(<AuditLogsPage />, {
      authValue: { role: 'SYSTEM_ADMIN', user: { fullName: 'Alexander Vance' } },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export JSON/i })).toBeInTheDocument();
    });
  });
});
