import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { SprintBoardPage } from '../../pages/Sprints/SprintBoardPage';
import { BacklogTasksPage } from '../../pages/Tasks/BacklogTasksPage';
import { sprintApi } from '../../api/sprintApi';
import { taskApi } from '../../api/taskApi';
import { projectApi } from '../../api/projectApi';
import { userApi } from '../../api/userApi';
import { mockSprints, mockTasks } from '../fixtures/sprintFixtures';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/sprintApi', () => ({
  sprintApi: {
    getAll: vi.fn(),
    getByProject: vi.fn(),
  },
}));

vi.mock('../../api/taskApi', () => ({
  taskApi: {
    getAll: vi.fn(),
    getBySprint: vi.fn(),
    updateStatus: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../api/userApi', () => ({
  userApi: {
    getAll: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('Area G & H: Sprints, Kanban Board & Backlog', () => {
  beforeEach(() => {
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    sprintApi.getAll.mockResolvedValue({ success: true, data: mockSprints });
    sprintApi.getByProject.mockResolvedValue({ success: true, data: mockSprints });
    taskApi.getBySprint.mockResolvedValue({ success: true, data: mockTasks });
    taskApi.getAll.mockResolvedValue({ success: true, data: mockTasks });
    userApi.getAll.mockResolvedValue({ success: true, data: [] });
  });

  it('renders Kanban board with 4 columns and tasks', async () => {
    renderWithProviders(<SprintBoardPage />, {
      authValue: { role: 'DEVELOPER', user: { fullName: 'Lucas Thorne' } },
    });

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('In Review / QA')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Implement Flyway V3 Migration')).toBeInTheDocument();
      expect(screen.getByText('Add RestClient LLM Provider')).toBeInTheDocument();
    });
  });

  it('renders BacklogTasksPage with tasks table', async () => {
    renderWithProviders(<BacklogTasksPage />, {
      authValue: { role: 'PRODUCT_OWNER', user: { fullName: 'Elena Rostova' } },
    });

    await waitFor(() => {
      expect(screen.getByText('Implement Flyway V3 Migration')).toBeInTheDocument();
      expect(screen.getByText('Add RestClient LLM Provider')).toBeInTheDocument();
    });
  });
});
