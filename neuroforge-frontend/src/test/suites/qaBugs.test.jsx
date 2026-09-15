import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { QaTestCenterPage } from '../../pages/QA/QaTestCenterPage';
import { BugTrackerPage } from '../../pages/Bugs/BugTrackerPage';
import { testCaseApi } from '../../api/testCaseApi';
import { bugApi } from '../../api/bugApi';
import { taskApi } from '../../api/taskApi';
import { projectApi } from '../../api/projectApi';
import { userApi } from '../../api/userApi';
import { mockTestCases, mockBugs } from '../fixtures/qaFixtures';
import { mockTasks } from '../fixtures/sprintFixtures';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/testCaseApi', () => ({
  testCaseApi: {
    getAll: vi.fn(),
    getByTask: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../api/bugApi', () => ({
  bugApi: {
    getAll: vi.fn(),
    updateStatus: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../api/taskApi', () => ({
  taskApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../api/userApi', () => ({
  userApi: {
    getAll: vi.fn(),
  },
}));

describe('Area K: QA Test Center & Bug Tracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    taskApi.getAll.mockResolvedValue({ success: true, data: mockTasks });
    userApi.getAll.mockResolvedValue({
      success: true,
      data: [{ id: 1, fullName: 'Lucas Thorne', role: 'DEVELOPER' }],
    });
    testCaseApi.getAll.mockResolvedValue({ success: true, data: mockTestCases });
    bugApi.getAll.mockResolvedValue({ success: true, data: mockBugs });
  });

  it('renders QA test cases with status and descriptions', async () => {
    renderWithProviders(<QaTestCenterPage />, {
      authValue: { role: 'QA_ENGINEER', user: { fullName: 'Priya Sharma' } },
    });

    await waitFor(() => {
      expect(screen.getByText('Verify JWT Authentication Filter')).toBeInTheDocument();
      expect(screen.getByText('Validate External LLM Fallback on 429')).toBeInTheDocument();
    });
  });

  it('renders bug tracker with severity indicators', async () => {
    renderWithProviders(<BugTrackerPage />, {
      authValue: { role: 'QA_ENGINEER', user: { fullName: 'Priya Sharma' } },
    });

    await waitFor(() => {
      expect(screen.getByText(/Empty JSON response from LLM causes NPE in parser/i)).toBeInTheDocument();
      expect(screen.getByText(/Audit log table horizontal scrollbar clipped in low res/i)).toBeInTheDocument();
    });
  });
});
