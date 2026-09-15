import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../utils/testUtils';
import { CiCdConsolePage } from '../../pages/DevOps/CiCdConsolePage';
import { cicdApi } from '../../api/cicdApi';
import { repositoryApi } from '../../api/repositoryApi';
import { mockPipelineRuns } from '../fixtures/cicdFixtures';
import { mockRepositories } from '../fixtures/repoFixtures';

vi.mock('../../api/cicdApi', () => ({
  cicdApi: {
    getHistory: vi.fn(),
    getById: vi.fn(),
    triggerPipeline: vi.fn(),
  },
}));

vi.mock('../../api/repositoryApi', () => ({
  repositoryApi: {
    getAll: vi.fn(),
  },
}));

describe('Area L: Persistent CI/CD Pipelines & History', () => {
  beforeEach(() => {
    cicdApi.getHistory.mockResolvedValue({ success: true, data: mockPipelineRuns });
    repositoryApi.getAll.mockResolvedValue({ success: true, data: mockRepositories });
  });

  it('loads and renders persistent pipeline runs from /api/cicd/history', async () => {
    renderWithProviders(<CiCdConsolePage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getByText(/CI\/CD Pipelines Console/i)).toBeInTheDocument();
      expect(screen.getByText('#101')).toBeInTheDocument();
      expect(screen.getByText('#102')).toBeInTheDocument();
    });
  });

  it('renders all 6 pipeline stages and logs when a run is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CiCdConsolePage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getByText('#101')).toBeInTheDocument();
    });

    const runCard = screen.getByText('#101');
    await user.click(runCard);

    expect(screen.getByText('LINT')).toBeInTheDocument();
    expect(screen.getByText('BUILD')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('SONAR')).toBeInTheDocument();
    expect(screen.getByText('DOCKER')).toBeInTheDocument();
    expect(screen.getByText('DEPLOY')).toBeInTheDocument();
  });

  it('renders empty pipeline history without errors when API returns []', async () => {
    cicdApi.getHistory.mockResolvedValue({ success: true, data: [] });

    renderWithProviders(<CiCdConsolePage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getByText(/No pipeline runs found/i)).toBeInTheDocument();
    });
  });

  it('triggers a simulated pipeline and opens modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CiCdConsolePage />, {
      authValue: { role: 'DEVOPS_ENGINEER', user: { fullName: 'Kasper Lindqvist' } },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Run Pipeline/i })).toBeInTheDocument();
    });

    const triggerBtn = screen.getByRole('button', { name: /Run Pipeline/i });
    await user.click(triggerBtn);

    expect(screen.getByText(/Trigger CI\/CD Pipeline Run/i)).toBeInTheDocument();
  });
});
