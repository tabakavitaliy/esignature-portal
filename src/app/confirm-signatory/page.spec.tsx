import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmSignatoryPage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useReadyToSignModule from '@/hooks/queries/use-ready-to-sign';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-ready-to-sign', () => ({
  useReadyToSign: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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
    (useReadyToSignModule.useReadyToSign as ReturnType<typeof vi.fn>).mockReturnValue({
      sign: vi.fn(),
      isLoading: false,
      error: null,
      data: undefined,
    });
  });

  it('renders without crashing', () => {
    render(<ConfirmSignatoryPage />, { wrapper: createWrapper() });
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders the ConfirmSignatory component', () => {
    render(<ConfirmSignatoryPage />, { wrapper: createWrapper() });
    const authorityQuestion = screen.getByText(t.authorityQuestion);
    expect(authorityQuestion).toBeInTheDocument();
  });

  it('renders all expected page elements', () => {
    render(<ConfirmSignatoryPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: t.headerText })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Progress' })).toBeInTheDocument();
    expect(screen.getByText(t.addressCountSuffix)).toBeInTheDocument();
    expect(screen.getByText(t.authorityQuestion)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });
});
