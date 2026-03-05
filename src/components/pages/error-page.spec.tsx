import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { ErrorPage } from './error-page';
import { ROUTES } from '@/constants/routes';
import { ERROR_RETURN_PATH_KEY } from '@/providers/query-provider';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('ErrorPage', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders screenshot-mapped copy', () => {
    render(<ErrorPage />);

    expect(screen.getByText('Signature Portal')).toBeInTheDocument();
    expect(screen.getByText('Powered by Liberty Blume')).toBeInTheDocument();
    expect(screen.getByText('We’re on it')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Looks like this service is temporarily unavailable. Please refresh and try again.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('If it still doesn’t work, wait a few minutes and try again.')
    ).toBeInTheDocument();
  });

  it('renders warning icon and both CTA buttons', () => {
    const { container } = render(<ErrorPage />);

    // WarningTriangleIcon is an SVG with width="46" height="40" (no aria-label on the element)
    expect(container.querySelector('svg[width="46"][height="40"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to login' })).toBeInTheDocument();
  });

  it('navigates back to login when secondary CTA clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorPage />);

    await user.click(screen.getByRole('button', { name: 'Back to login' }));

    expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
  });

  describe('Refresh button', () => {
    it('calls onRefresh prop and does not navigate when prop is provided', async () => {
      const user = userEvent.setup();
      const mockOnRefresh = vi.fn();
      render(<ErrorPage onRefresh={mockOnRefresh} />);

      await user.click(screen.getByRole('button', { name: 'Refresh' }));

      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('navigates to stored return path from sessionStorage', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem(ERROR_RETURN_PATH_KEY, '/confirm-name');
      render(<ErrorPage />);

      await user.click(screen.getByRole('button', { name: 'Refresh' }));

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
      expect(sessionStorage.getItem(ERROR_RETURN_PATH_KEY)).toBeNull();
    });

    it('falls back to home when no return path is in sessionStorage', async () => {
      const user = userEvent.setup();
      render(<ErrorPage />);

      await user.click(screen.getByRole('button', { name: 'Refresh' }));

      expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  it('Back to login clears sessionStorage return path', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(ERROR_RETURN_PATH_KEY, '/confirm-name');
    render(<ErrorPage />);

    await user.click(screen.getByRole('button', { name: 'Back to login' }));

    expect(sessionStorage.getItem(ERROR_RETURN_PATH_KEY)).toBeNull();
    expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
  });
});
