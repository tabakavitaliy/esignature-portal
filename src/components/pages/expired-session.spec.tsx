import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ExpiredSession } from './expired-session';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ExpiredSession', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    
    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: {
        hasSignedMatter: false,
        matterId: 'test-matter',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'doc-123',
        propertyAddresses: [],
        signatories: [],
      },
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it('should render header with correct text', () => {
    render(<ExpiredSession />, { wrapper: createWrapper() });

    expect(screen.getByText('Signature Portal')).toBeInTheDocument();
    expect(screen.getByText('Powered by Liberty Blume')).toBeInTheDocument();
  });

  it('should render expiry message', () => {
    render(<ExpiredSession />, { wrapper: createWrapper() });

    expect(
      screen.getByText(
        'Your session has expired due to inactivity. Use the eSignature credential to login again'
      )
    ).toBeInTheDocument();
  });

  it('should render clock icon', () => {
    render(<ExpiredSession />, { wrapper: createWrapper() });

    const clockIcon = screen.getByLabelText('Clock');
    expect(clockIcon).toBeInTheDocument();
  });

  it('should render login button', () => {
    render(<ExpiredSession />, { wrapper: createWrapper() });

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should navigate to home when login button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExpiredSession />, { wrapper: createWrapper() });

    const loginButton = screen.getByRole('button', { name: 'Login' });
    await user.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('should render with gradient background', () => {
    const { container } = render(<ExpiredSession />, { wrapper: createWrapper() });

    const mainDiv = container.querySelector('.bg-gradient-to-b');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render customer privacy notice', () => {
    render(<ExpiredSession />, { wrapper: createWrapper() });

    expect(screen.getByText('Customer privacy notice')).toBeInTheDocument();
  });
});
