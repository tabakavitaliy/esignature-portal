import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InactivityProvider } from './inactivity-provider';
import * as useInactivityTimerModule from '@/hooks/common/use-inactivity-timer';

vi.mock('@/hooks/common/use-inactivity-timer', () => ({
  useInactivityTimer: vi.fn(),
}));

describe('InactivityProvider', () => {
  const mockResetTimer = vi.fn();
  const mockLogOff = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    vi.spyOn(useInactivityTimerModule, 'useInactivityTimer').mockReturnValue({
      isWarningVisible: false,
      remainingSeconds: 120,
      resetTimer: mockResetTimer,
      logOff: mockLogOff,
    });

    render(
      <InactivityProvider>
        <div>Test Child</div>
      </InactivityProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should not render modal when warning is not visible', () => {
    vi.spyOn(useInactivityTimerModule, 'useInactivityTimer').mockReturnValue({
      isWarningVisible: false,
      remainingSeconds: 120,
      resetTimer: mockResetTimer,
      logOff: mockLogOff,
    });

    render(
      <InactivityProvider>
        <div>Test Child</div>
      </InactivityProvider>
    );

    expect(
      screen.queryByText('Are you still there? Your session will expire soon due to inactivity')
    ).not.toBeInTheDocument();
  });

  it('should render modal when warning is visible', () => {
    vi.spyOn(useInactivityTimerModule, 'useInactivityTimer').mockReturnValue({
      isWarningVisible: true,
      remainingSeconds: 90,
      resetTimer: mockResetTimer,
      logOff: mockLogOff,
    });

    render(
      <InactivityProvider>
        <div>Test Child</div>
      </InactivityProvider>
    );

    expect(
      screen.getByText('Are you still there? Your session will expire soon due to inactivity')
    ).toBeInTheDocument();
  });

  it('should pass correct props to modal', () => {
    const mockRemainingSeconds = 45;

    vi.spyOn(useInactivityTimerModule, 'useInactivityTimer').mockReturnValue({
      isWarningVisible: true,
      remainingSeconds: mockRemainingSeconds,
      resetTimer: mockResetTimer,
      logOff: mockLogOff,
    });

    render(
      <InactivityProvider>
        <div>Test Child</div>
      </InactivityProvider>
    );

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });
});
