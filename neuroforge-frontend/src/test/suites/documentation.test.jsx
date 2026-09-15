import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { DocumentationPage } from '../../pages/Documentation/DocumentationPage';
import { documentationApi } from '../../api/documentationApi';
import { projectApi } from '../../api/projectApi';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/documentationApi', () => ({
  documentationApi: {
    getAll: vi.fn(),
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

describe('Area J: Architecture & Documentation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    documentationApi.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          projectId: 1,
          documentVersion: 1,
          title: 'ADR 001: MySQL Schema Evolution with Flyway',
          documentType: 'ADR',
          content: 'We use Flyway to manage relational migrations with V1, V2, and V3.',
          createdDate: '2026-03-10T10:00:00',
        },
      ],
    });
  });

  it('renders documentation and ADR records', async () => {
    renderWithProviders(<DocumentationPage />, {
      authValue: { role: 'SOFTWARE_ARCHITECT', user: { fullName: 'Marcus Brody' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('ADR 001: MySQL Schema Evolution with Flyway').length).toBeGreaterThan(0);
      expect(screen.getByText('Architecture blueprints')).toBeInTheDocument();
    });
  });

  it('allows publishing a new architecture specification', async () => {
    documentationApi.create.mockResolvedValue({
      success: true,
      data: {
        projectId: 1,
        documentVersion: 2,
        title: 'ADR 002: Real-time WebSockets',
        documentType: 'ADR',
      },
    });

    renderWithProviders(<DocumentationPage />, {
      authValue: { role: 'SOFTWARE_ARCHITECT', user: { fullName: 'Marcus Brody' } },
    });

    await waitFor(() => {
      expect(screen.getAllByText('ADR 001: MySQL Schema Evolution with Flyway').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /Publish Specification/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ADR-003/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/ADR-003/i), {
      target: { value: 'ADR 002: Real-time WebSockets' },
    });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[selects.length - 2], { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Publish Document/i }));

    await waitFor(() => {
      expect(documentationApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'ADR 002: Real-time WebSockets',
          projectId: 1,
        })
      );
    });
  });
});
