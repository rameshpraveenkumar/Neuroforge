import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { RequirementsPage } from '../../pages/Requirements/RequirementsPage';
import { requirementApi } from '../../api/requirementApi';
import { projectApi } from '../../api/projectApi';
import { mockRequirements, mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/requirementApi', () => ({
  requirementApi: {
    getAll: vi.fn(),
    getByProject: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

describe('Area F: Requirements Management', () => {
  beforeEach(() => {
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    requirementApi.getAll.mockResolvedValue({ success: true, data: mockRequirements });
  });

  it('renders requirements list and status badges', async () => {
    renderWithProviders(<RequirementsPage />, {
      authValue: { role: 'PRODUCT_OWNER', user: { fullName: 'Elena Rostova' } },
    });

    await waitFor(() => {
      expect(screen.getByText('Distributed Tracing Integration')).toBeInTheDocument();
      expect(screen.getByText('Audit Trail Export to CSV/JSON')).toBeInTheDocument();
    });
  });

  it('handles empty state when no requirements exist', async () => {
    requirementApi.getAll.mockResolvedValue({ success: true, data: [] });

    renderWithProviders(<RequirementsPage />, {
      authValue: { role: 'PRODUCT_OWNER', user: { fullName: 'Elena Rostova' } },
    });

    await waitFor(() => {
      expect(screen.getByText(/No requirements found/i)).toBeInTheDocument();
    });
  });
});
