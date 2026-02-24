import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import ConfirmSignatoryPage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('ConfirmSignatoryPage', () => {
  const { confirmSignatoryPage: t } = translations;

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: vi.fn(),
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it('renders without crashing', () => {
    render(<ConfirmSignatoryPage />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders the ConfirmSignatory component', () => {
    render(<ConfirmSignatoryPage />);
    const authorityQuestion = screen.getByText(t.authorityQuestion);
    expect(authorityQuestion).toBeInTheDocument();
  });

  it('renders all expected page elements', () => {
    render(<ConfirmSignatoryPage />);
    
    expect(screen.getByRole('heading', { name: t.headerText })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Progress' })).toBeInTheDocument();
    expect(screen.getByText(t.addressCountSuffix)).toBeInTheDocument();
    expect(screen.getByText(t.authorityQuestion)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });
});
