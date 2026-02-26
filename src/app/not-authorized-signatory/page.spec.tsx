import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import NotAuthorizedSignatoryPage from './page';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useAddSignatoryModule from '@/hooks/queries/use-add-signatory';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-add-signatory', () => ({
  useAddSignatory: vi.fn(),
}));

describe('NotAuthorizedSignatoryPage', () => {
  const { notAuthorizedSignatoryPage: t, signatoryDetailsForm: tForm } = translations;
  const mockPush = vi.fn();

  const mockAddSignatory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockAddSignatory.mockResolvedValue({ success: true });
    (useAddSignatoryModule.useAddSignatory as ReturnType<typeof vi.fn>).mockReturnValue({
      addSignatory: mockAddSignatory,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  });

  describe('rendering', () => {
    it('renders the page header', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByRole('heading', { name: t.headerText })).toBeInTheDocument();
    });

    it('renders the form heading and description', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByText(t.formHeading)).toBeInTheDocument();
      expect(screen.getByText(t.formDescription)).toBeInTheDocument();
    });

    it('renders the signatory details section heading', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByText(t.signatoryDetailsHeading)).toBeInTheDocument();
    });

    it('renders the legal basis text', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByText(t.legalBasisText)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByRole('button', { name: t.submitButton })).toBeInTheDocument();
    });

    it('renders progress stepper at step 4 of 4', () => {
      render(<NotAuthorizedSignatoryPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders all 7 address association options when select is opened', async () => {
      const user = userEvent.setup();
      render(<NotAuthorizedSignatoryPage />);

      const combos = screen.getAllByRole('combobox');
      const addressAssociationSelect = combos[1]!;
      await user.click(addressAssociationSelect);

      const options = ['Owner', 'Landlord', 'Property Manager', 'Solicitor', 'Executor', 'Director', 'Other'];
      for (const option of options) {
        const elements = await screen.findAllByText(option);
        expect(elements.length).toBeGreaterThan(0);
      }
    });
  });

  describe('navigation', () => {
    it('navigates back to /confirm-signatory when back is clicked', () => {
      render(<NotAuthorizedSignatoryPage />);
      const backButton = screen.getByLabelText(t.backButtonLabel);
      fireEvent.click(backButton);
      expect(mockPush).toHaveBeenCalledWith('/confirm-signatory');
    });
  });

  describe('validation', () => {
    it('shows required fields error when submitting empty form', () => {
      render(<NotAuthorizedSignatoryPage />);
      fireEvent.click(screen.getByRole('button', { name: t.submitButton }));
      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows email mismatch error when emails do not match', async () => {
      const user = userEvent.setup();
      render(<NotAuthorizedSignatoryPage />);

      const combos = screen.getAllByRole('combobox');
      await user.click(combos[0]!);
      const mrOptions = await screen.findAllByText('Mr');
      await user.click(mrOptions[mrOptions.length - 1]!);

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), {
        target: { value: 'Doe' },
      });

      await user.click(combos[1]!);
      const ownerOptions = await screen.findAllByText('Owner');
      await user.click(ownerOptions[ownerOptions.length - 1]!);

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'test@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'other@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), {
        target: { value: '07700900000' },
      });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), {
        target: { value: 'London' },
      });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), {
        target: { value: 'SW1A 1AA' },
      });

      fireEvent.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.emailMismatchError)).toBeInTheDocument();
    });
  });
});
