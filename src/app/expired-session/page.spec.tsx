import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import ExpiredSessionPage from './page';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
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

describe('ExpiredSessionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

  it('should render ExpiredSession component', () => {
    const { container } = render(<ExpiredSessionPage />, { wrapper: createWrapper() });
    expect(container).toBeTruthy();
  });
});
