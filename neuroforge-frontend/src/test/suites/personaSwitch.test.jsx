import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../utils/testUtils';
import { PersonaSwitcher } from '../../components/layout/PersonaSwitcher';
import { DEMO_PERSONAS } from '../../utils/demoData';

describe('Area C: Persona & Role Switching', () => {
  it('renders the active persona and role', () => {
    renderWithProviders(<PersonaSwitcher />, {
      authValue: {
        role: 'DEVELOPER',
        user: { fullName: 'Lucas Thorne', role: 'DEVELOPER' },
        demoPersonas: DEMO_PERSONAS,
        demoSwitch: vi.fn(),
      },
    });

    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('opens persona dropdown and displays available roles', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonaSwitcher />, {
      authValue: {
        role: 'DEVELOPER',
        user: { fullName: 'Lucas Thorne', role: 'DEVELOPER' },
        demoPersonas: DEMO_PERSONAS,
        demoSwitch: vi.fn(),
      },
    });

    const triggerBtn = screen.getByTitle(/Switch Active Persona/i);
    await user.click(triggerBtn);

    expect(screen.getByText(/Select Role Persona/i)).toBeInTheDocument();
    expect(screen.getByText('System Admin')).toBeInTheDocument();
    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Software Architect')).toBeInTheDocument();
  });

  it('invokes demoSwitch when a new persona is selected', async () => {
    const mockDemoSwitch = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();

    renderWithProviders(<PersonaSwitcher />, {
      authValue: {
        role: 'DEVELOPER',
        user: { fullName: 'Lucas Thorne', role: 'DEVELOPER' },
        demoPersonas: DEMO_PERSONAS,
        demoSwitch: mockDemoSwitch,
      },
    });

    const triggerBtn = screen.getByTitle(/Switch Active Persona/i);
    await user.click(triggerBtn);

    const pmOption = screen.getByText('Project Manager');
    await user.click(pmOption);

    expect(mockDemoSwitch).toHaveBeenCalledWith('PROJECT_MANAGER');
  });
});
