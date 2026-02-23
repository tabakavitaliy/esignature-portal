import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThankYouPage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('ThankYouPage', () => {
  const { thankYouPage: t } = translations;

  beforeEach(() => {
    vi.clearAllMocks();
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders the page header', () => {
    render(<ThankYouPage />);
    expect(screen.getByRole('heading', { name: t.headerText })).toBeInTheDocument();
  });

  it('renders the Thank you heading', () => {
    render(<ThankYouPage />);
    expect(screen.getByRole('heading', { name: t.heading })).toBeInTheDocument();
  });

  it('renders the confirmation body text', () => {
    render(<ThankYouPage />);
    expect(screen.getByText(t.body)).toBeInTheDocument();
  });

  it('renders no navigation buttons', () => {
    render(<ThankYouPage />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
