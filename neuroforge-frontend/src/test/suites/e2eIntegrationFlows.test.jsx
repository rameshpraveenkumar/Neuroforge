import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { App } from '../../App';
import { analyticsApi } from '../../api/analyticsApi';
import { projectApi } from '../../api/projectApi';
import { cicdApi } from '../../api/cicdApi';
import { repositoryApi } from '../../api/repositoryApi';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import { mockAnalyticsOverview, mockDoraMetrics } from '../fixtures/analyticsFixtures';
import { mockProjects } from '../fixtures/projectFixtures';
import { mockPipelineRuns } from '../fixtures/cicdFixtures';
import { mockRepositories } from '../fixtures/repoFixtures';
import { DEMO_PERSONAS } from '../../utils/demoData';

vi.mock('../../api/analyticsApi', () => ({
  analyticsApi: {
    getOverview: vi.fn(),
    getDoraMetrics: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../api/cicdApi', () => ({
  cicdApi: {
    getHistory: vi.fn(),
    getById: vi.fn(),
    triggerRun: vi.fn(),
  },
}));

vi.mock('../../api/repositoryApi', () => ({
  repositoryApi: {
    getAll: vi.fn(),
    getCommits: vi.fn().mockResolvedValue({ success: true, data: [] }),
    getBranches: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

vi.mock('../../api/userApi', () => ({
  userApi: {
    getAll: vi.fn().mockResolvedValue({ success: true, data: [] }),
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

describe('Area 9: End-to-End Multi-Step User Journeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    analyticsApi.getOverview.mockResolvedValue({ success: true, data: mockAnalyticsOverview });
    analyticsApi.getDoraMetrics.mockResolvedValue({ success: true, data: mockDoraMetrics });
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    cicdApi.getHistory.mockResolvedValue({ success: true, data: mockPipelineRuns });
    repositoryApi.getAll.mockResolvedValue({ success: true, data: mockRepositories });
  });

  it('Journey 1: Navigate Dashboard -> Open Projects -> View Project Cards', async () => {
    authApi.getMe.mockResolvedValue({
      success: true,
      data: { id: 2, role: 'PROJECT_MANAGER', fullName: 'Sarah Jenkins', username: 'pm' },
    });

    renderWithProviders(<App />, {
      route: '/projects',
      includeRouter: false,
      authValue: {
        role: 'PROJECT_MANAGER',
        user: { id: 2, role: 'PROJECT_MANAGER', fullName: 'Sarah Jenkins' },
        isAuthenticated: true,
        loading: false,
        demoPersonas: DEMO_PERSONAS,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('NeuroForge Core Platform')).toBeInTheDocument();
      expect(screen.getByText('Cloud Infrastructure Automation')).toBeInTheDocument();
    });
  });

  it('Journey 2: DevOps Engineer opens CI/CD -> Inspects persistent pipeline run 03e5a93', async () => {
    authApi.getMe.mockResolvedValue({
      success: true,
      data: { id: 8, role: 'DEVOPS_ENGINEER', fullName: 'Kasper Lindqvist', username: 'devops' },
    });

    renderWithProviders(<App />, {
      route: '/devops/pipelines',
      includeRouter: false,
      authValue: {
        role: 'DEVOPS_ENGINEER',
        user: { id: 8, role: 'DEVOPS_ENGINEER', fullName: 'Kasper Lindqvist' },
        isAuthenticated: true,
        loading: false,
        demoPersonas: DEMO_PERSONAS,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('03e5a93')).toBeInTheDocument();
      expect(screen.getByText('LINT')).toBeInTheDocument();
      expect(screen.getByText('BUILD')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('DEPLOY')).toBeInTheDocument();
    });
  });
});
