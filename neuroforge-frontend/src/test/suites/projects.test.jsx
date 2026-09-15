import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../utils/testUtils';
import { ProjectsPage } from '../../pages/Projects/ProjectsPage';
import { projectApi } from '../../api/projectApi';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Area E: Project Management', () => {
  beforeEach(() => {
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
  });

  it('renders project list with metadata', async () => {
    renderWithProviders(<ProjectsPage />, {
      authValue: { role: 'PROJECT_MANAGER', user: { fullName: 'Sarah Jenkins' } },
    });

    await waitFor(() => {
      expect(screen.getByText('NeuroForge Core Platform')).toBeInTheDocument();
      expect(screen.getByText('Cloud Infrastructure Automation')).toBeInTheDocument();
    });
  });

  it('opens create project modal when Create Project button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsPage />, {
      authValue: { role: 'PROJECT_MANAGER', user: { fullName: 'Sarah Jenkins' } },
    });

    await waitFor(() => {
      expect(screen.getByText('NeuroForge Core Platform')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /Create Project/i });
    await user.click(createBtn);

    expect(screen.getByText(/Create New Project/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/NeuroCloud Core Engine/i)).toBeInTheDocument();
  });

  it('handles empty project list gracefully', async () => {
    projectApi.getAll.mockResolvedValue({ success: true, data: [] });

    renderWithProviders(<ProjectsPage />, {
      authValue: { role: 'DEVELOPER', user: { fullName: 'Lucas Thorne' } },
    });

    await waitFor(() => {
      expect(screen.getByText(/No projects found/i)).toBeInTheDocument();
    });
  });
});
