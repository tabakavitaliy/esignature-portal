import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InactivityWarningModal } from './inactivity-warning-modal';

describe('InactivityWarningModal', () => {
  const mockOnImHere = vi.fn();
  const mockOnLogOff = vi.fn();

  const defaultProps = {
    remainingSeconds: 120,
    onImHere: mockOnImHere,
    onLogOff: mockOnLogOff,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct message', () => {
    render(<InactivityWarningModal {...defaultProps} />);

    expect(
      screen.getByText('Are you still there? Your session will expire soon due to inactivity')
    ).toBeInTheDocument();
  });

  it('should display countdown timer with correct format', () => {
    render(<InactivityWarningModal {...defaultProps} remainingSeconds={120} />);

    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
  });

  it('should format minutes and seconds correctly', () => {
    const { rerender } = render(<InactivityWarningModal {...defaultProps} remainingSeconds={95} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();

    rerender(<InactivityWarningModal {...defaultProps} remainingSeconds={5} />);

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('should render both buttons', () => {
    render(<InactivityWarningModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: "I'm here" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log off' })).toBeInTheDocument();
  });

  it("should call onImHere when I'm here button is clicked", async () => {
    const user = userEvent.setup();
    render(<InactivityWarningModal {...defaultProps} />);

    const imHereButton = screen.getByRole('button', { name: "I'm here" });
    await user.click(imHereButton);

    expect(mockOnImHere).toHaveBeenCalledTimes(1);
    expect(mockOnLogOff).not.toHaveBeenCalled();
  });

  it('should call onLogOff when Log off button is clicked', async () => {
    const user = userEvent.setup();
    render(<InactivityWarningModal {...defaultProps} />);

    const logOffButton = screen.getByRole('button', { name: 'Log off' });
    await user.click(logOffButton);

    expect(mockOnLogOff).toHaveBeenCalledTimes(1);
    expect(mockOnImHere).not.toHaveBeenCalled();
  });

  it('should render clock icon', () => {
    render(<InactivityWarningModal {...defaultProps} />);

    const clockIcon = screen.getByLabelText('Clock');
    expect(clockIcon).toBeInTheDocument();
  });

  it('should render overlay', () => {
    const { container } = render(<InactivityWarningModal {...defaultProps} />);

    const overlay = container.querySelector('.backdrop-blur-\\[2px\\]');
    expect(overlay).toBeInTheDocument();
  });

  it('should pad single digit numbers with leading zero', () => {
    render(<InactivityWarningModal {...defaultProps} remainingSeconds={9} />);

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('09')).toBeInTheDocument();
  });
});
