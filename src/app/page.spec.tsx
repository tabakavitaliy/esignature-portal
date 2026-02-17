import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import HomePage from './page';
import translations from '@/i18n/en.json';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/hooks/queries/use-token', () => ({
  useToken: vi.fn(() => ({ token: null, setToken: vi.fn() })),
}));

describe('HomePage', () => {
  const { loginPage: t } = translations;
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
    });
  });

  it('renders the LoginPage component', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { name: t.signaturePortal });
    expect(heading).toBeInTheDocument();
  });

  it('displays the welcome message', () => {
    render(<HomePage />);
    const message = screen.getByText(t.welcomeMessage);
    expect(message).toBeInTheDocument();
  });

  it('has proper semantic structure with main element', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('renders the credential input field', () => {
    render(<HomePage />);
    const input = screen.getByLabelText(t.credentialLabel);
    expect(input).toBeInTheDocument();
  });
});
