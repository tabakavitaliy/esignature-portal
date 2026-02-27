import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddNewNamePage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useAddNewSignatoryModule from '@/hooks/queries/use-add-new-signatory';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-add-new-signatory', () => ({
  useAddNewSignatory: vi.fn(),
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
    const { addAuthorizedSignPage: t } = translations;
    render(<AddNewNamePage />);
    expect(screen.getByText(t.headerText)).toBeInTheDocument();
  });
});
