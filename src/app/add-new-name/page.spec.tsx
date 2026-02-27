import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddNewNamePage from './page';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useAddNewSignatoryModule from '@/hooks/queries/use-add-new-signatory';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => '/add-new-name'),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-add-new-signatory', () => ({
  useAddNewSignatory: vi.fn(),
}));

vi.mock('@/hooks/queries/use-token', () => ({
  useToken: vi.fn(() => ({
    token: 'test-token',
    setToken: vi.fn(),
    clearToken: vi.fn(),
  })),
}));

describe('AddNewNamePage', () => {
  const mockMatterDetails: MatterDetails = {
    hasSignedMatter: false,
    matterId: 'test-matter-id',
    matterReference: 'REF123',
    matterStatus: 'Pending',
    privacyPolicyUrl: 'https://example.com/privacy',
    matterDocumentId: 'test-doc-id',
    propertyAddresses: [],
    signatories: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });
    (useAddNewSignatoryModule.useAddNewSignatory as ReturnType<typeof vi.fn>).mockReturnValue({
      addNewSignatory: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  });

  it('renders the AddAuthorizedSign component', () => {
    render(<AddNewNamePage />);
    expect(screen.getByText('Enter your details')).toBeInTheDocument();
  });
});
