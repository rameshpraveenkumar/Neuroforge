import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { RoleDashboardPage } from '../../pages/Dashboard/RoleDashboardPage';
import { analyticsApi } from '../../api/analyticsApi';
import { mockAnalyticsOverview, mockDoraMetrics } from '../fixtures/analyticsFixtures';

vi.mock('../../api/analyticsApi', () => ({
  analyticsApi: {
    getOverview: vi.fn(),
    getDoraMetrics: vi.fn(),
  },
}));

describe('Area D & O: Dashboard & Analytics', () => {
  beforeEach(() => {
    analyticsApi.getOverview.mockResolvedValue({ success: true, data: mockAnalyticsOverview });
    analyticsApi.getDoraMetrics.mockResolvedValue({ success: true, data: mockDoraMetrics });
  });

  it('renders dashboard with KPI cards and DORA metrics', async () => {
    renderWithProviders(<RoleDashboardPage />, {
      authValue: {
        role: 'SYSTEM_ADMIN',
        user: { fullName: 'Alexander Vance', role: 'SYSTEM_ADMIN' },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Executive Metrics & Operational Cadence/i)).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Sprint Velocity')).toBeInTheDocument();
      expect(screen.getByText('Open Defects')).toBeInTheDocument();
      expect(screen.getByText('Sync Data')).toBeInTheDocument();
    });
  });

  it('renders correctly for developer persona with default metrics fallback on error', async () => {
    analyticsApi.getOverview.mockRejectedValue(new Error('Backend service unavailable'));
    analyticsApi.getDoraMetrics.mockRejectedValue(new Error('Backend service unavailable'));

    renderWithProviders(<RoleDashboardPage />, {
      authValue: {
        role: 'DEVELOPER',
        user: { fullName: 'Lucas Thorne', role: 'DEVELOPER' },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Developer · Operational Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Good morning/i)).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
    });
  });
});
