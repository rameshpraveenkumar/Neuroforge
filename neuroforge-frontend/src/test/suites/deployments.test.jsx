import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { DeploymentsPage } from '../../pages/DevOps/DeploymentsPage';
import { deploymentApi } from '../../api/deploymentApi';
import { projectApi } from '../../api/projectApi';
import { mockDeployments } from '../fixtures/deploymentFixtures';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/deploymentApi', () => ({
  deploymentApi: {
    getAll: vi.fn(),
    trigger: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

describe('Area M: Deployments & Release Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    deploymentApi.getAll.mockResolvedValue({ success: true, data: mockDeployments });
  });

  it('renders deployment history with environments and versions', async () => {
    renderWithProviders(<DeploymentsPage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('v2026.4.1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PRODUCTION').length).toBeGreaterThan(0);
      expect(screen.getAllByText('v2026.4.0-rc2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('STAGING').length).toBeGreaterThan(0);
    });
  });

  it('allows triggering a new deployment', async () => {
    deploymentApi.trigger.mockResolvedValue({
      success: true,
      data: { deploymentId: 3, environment: 'DEV', version: 'v1.2.0-rc', status: 'HEALTHY' },
    });

    renderWithProviders(<DeploymentsPage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { id: 8, fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('v2026.4.1').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /Trigger Deployment/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/v1.2.0-rc2/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Deploy Release/i }));

    await waitFor(() => {
      expect(deploymentApi.trigger).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: 'DEV',
          version: 'v1.2.0-rc',
        })
      );
    });
  });
});
