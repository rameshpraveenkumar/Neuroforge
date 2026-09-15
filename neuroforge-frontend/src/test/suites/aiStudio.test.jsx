import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import { AiStudioPage } from '../../pages/AI/AiStudioPage';
import { aiApi } from '../../api/aiApi';
import { projectApi } from '../../api/projectApi';
import { sprintApi } from '../../api/sprintApi';
import { requirementApi } from '../../api/requirementApi';
import { mockAiAssistants, mockAiSuggestion } from '../fixtures/aiFixtures';
import { mockProjects } from '../fixtures/projectFixtures';

vi.mock('../../api/aiApi', () => ({
  aiApi: {
    getAssistants: vi.fn(),
    getSuggestionsByAssistant: vi.fn().mockResolvedValue({ success: true, data: [] }),
    generate: vi.fn(),
  },
}));

vi.mock('../../api/projectApi', () => ({
  projectApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('../../api/sprintApi', () => ({
  sprintApi: {
    getAll: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

vi.mock('../../api/requirementApi', () => ({
  requirementApi: {
    getAll: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('Area N: AI Studio & Offline Fallback Synthesis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectApi.getAll.mockResolvedValue({ success: true, data: mockProjects });
    aiApi.getAssistants.mockResolvedValue({ success: true, data: mockAiAssistants });
    aiApi.generate.mockResolvedValue({ success: true, data: mockAiSuggestion });
  });

  it('renders AI assistants and 4 generation presets', async () => {
    renderWithProviders(<AiStudioPage />, {
      authValue: { role: 'PRODUCT_OWNER', user: { fullName: 'Elena Rostova' } },
    });

    await waitFor(() => {
      expect(screen.getByText('BDD User Story')).toBeInTheDocument();
      expect(screen.getByText('QA Test Matrix')).toBeInTheDocument();
      expect(screen.getByText('Sprint Risk Analysis')).toBeInTheDocument();
      expect(screen.getByText('Architecture Review')).toBeInTheDocument();
    });
  });

  it('submits a generation request and renders markdown suggestion', async () => {
    renderWithProviders(<AiStudioPage />, {
      authValue: { role: 'PRODUCT_OWNER', user: { fullName: 'Elena Rostova' } },
    });

    await waitFor(() => {
      expect(screen.getByText('BDD User Story')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Describe the business scenario/i), {
      target: { value: 'As a user I want portfolio rebalancing' },
    });

    const generateBtn = screen.getByRole('button', { name: /Synthesize Insights/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(aiApi.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'As a user I want portfolio rebalancing',
          type: 'USER_STORY',
        })
      );
      expect(screen.getByText(/SYNTHESIS OUTPUT/i)).toBeInTheDocument();
      expect(screen.getByText(/AI-Generated User Story: Real-Time Portfolio Rebalancing/i)).toBeInTheDocument();
    });
  });
});
