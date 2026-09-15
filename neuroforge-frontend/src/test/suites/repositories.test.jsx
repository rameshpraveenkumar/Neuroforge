import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { RepositoriesPage } from '../../pages/Repositories/RepositoriesPage';
import { repositoryApi } from '../../api/repositoryApi';
import { projectApi } from '../../api/projectApi';
import { userApi } from '../../api/userApi';
import { mockRepositories, mockCommits } from '../fixtures/repoFixtures';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/repositoryApi', () => ({
  repositoryApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    getCommits: vi.fn(),
    recordCommit: vi.fn(),
    addCollaborator: vi.fn(),
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

describe('Area I: Repositories & SCM', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    userApi.getAll.mockResolvedValue({ success: true, data: [{ id: 1, fullName: 'Lucas Thorne', role: 'DEVELOPER' }] });
    repositoryApi.getAll.mockResolvedValue({ success: true, data: mockRepositories });
    repositoryApi.getCommits.mockResolvedValue({ success: true, data: mockCommits });
  });

  it('renders repository list with branch and commit statistics', async () => {
    renderWithProviders(<RepositoriesPage />, {
      authValue: { role: 'DEVELOPER', user: { id: 1, fullName: 'Lucas Thorne' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('neuroforge-core').length).toBeGreaterThan(0);
      expect(screen.getByText('neuroforge-infra')).toBeInTheDocument();
      expect(screen.getAllByText('https://github.com/neuroforge/neuroforge-core.git').length).toBeGreaterThan(0);
    });
  });

  it('allows recording a commit on selected repository', async () => {
    repositoryApi.recordCommit.mockResolvedValue({
      success: true,
      data: { id: 10, commitHash: 'abcdef12', commitMessage: 'fix: resolve race condition', authorName: 'Lucas Thorne' },
    });

    renderWithProviders(<RepositoriesPage />, {
      authValue: { role: 'DEVELOPER', user: { id: 1, fullName: 'Lucas Thorne' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('neuroforge-core').length).toBeGreaterThan(0);
    });

    const recordButtons = screen.getAllByRole('button', { name: /Record Commit/i });
    fireEvent.click(recordButtons[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/implement secure OAuth2/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/implement secure OAuth2/i), {
      target: { value: 'fix: resolve race condition' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Commit Code/i }));

    await waitFor(() => {
      expect(repositoryApi.recordCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          commitMessage: 'fix: resolve race condition',
        })
      );
    });
  });
});
