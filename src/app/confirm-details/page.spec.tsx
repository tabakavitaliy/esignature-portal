import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import ConfirmDetailsPage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useUpdateSignatoryModule from '@/hooks/queries/use-update-signatory';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-update-signatory', () => ({
  useUpdateSignatory: vi.fn(),
}));

describe('ConfirmDetailsPage', () => {
  const { confirmDetailsPage: t } = translations;

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: vi.fn(),
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useUpdateSignatoryModule.useUpdateSignatory as ReturnType<typeof vi.fn>).mockReturnValue({
      updateSignatory: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  });

  it('renders without crashing', () => {
    render(<ConfirmDetailsPage />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders ConfirmDetails component', () => {
    render(<ConfirmDetailsPage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('has header with correct text', () => {
    render(<ConfirmDetailsPage />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });
});
