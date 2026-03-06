import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { InvalidCredentialPage } from './invalid-credential-page';
import { ROUTES } from '@/constants/routes';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('InvalidCredentialPage', () => {
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

  describe('rendering', () => {
    it('renders the header text', () => {
      render(<InvalidCredentialPage />);

      expect(screen.getByText('Signature Portal')).toBeInTheDocument();
      expect(screen.getByText('Powered by Liberty Blume')).toBeInTheDocument();
    });

    it('renders both message lines', () => {
      render(<InvalidCredentialPage />);

      expect(
        screen.getByText(
          'Looks like this eSignature credential is invalid, or the agreement has already been responded to by someone.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('If you think this is a mistake, check the code and try again.')
      ).toBeInTheDocument();
    });

    it('renders Back and Close buttons', () => {
      render(<InvalidCredentialPage />);

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('renders the alert icon', () => {
      const { container } = render(<InvalidCredentialPage />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Back button', () => {
    it('navigates to home without clearing sessionStorage', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('token', 'ABCD-1234-EFGH-5678');
      render(<InvalidCredentialPage />);

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
      expect(sessionStorage.getItem('token')).toBe('ABCD-1234-EFGH-5678');
    });
  });

  describe('Close button', () => {
    it('clears sessionStorage and navigates to home', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('token', 'ABCD-1234-EFGH-5678');
      sessionStorage.setItem('selectedSignatoryId', 'sig-123');
      render(<InvalidCredentialPage />);

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('selectedSignatoryId')).toBeNull();
    });

    it('navigates to home even when sessionStorage is already empty', async () => {
      const user = userEvent.setup();
      render(<InvalidCredentialPage />);

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });
});
