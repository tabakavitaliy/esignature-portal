import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddNewNamePage from './page';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
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
  });

  it('renders the AddAuthorizedSign component', () => {
    render(<AddNewNamePage />);
    expect(screen.getByText('Add authorised signatory information')).toBeInTheDocument();
  });
});
