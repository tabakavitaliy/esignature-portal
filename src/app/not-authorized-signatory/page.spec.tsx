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

    it('shows invalid email error when email format is incorrect', async () => {
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
      fireEvent.change(emailInputs[0]!, { target: { value: 'invalid-email' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'invalid-email' } });

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

      expect(screen.getByText(tForm.invalidEmailError)).toBeInTheDocument();
    });

    it('shows invalid mobile error when mobile format is incorrect', async () => {
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
      fireEvent.change(emailInputs[1]!, { target: { value: 'test@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), {
        target: { value: 'invalid-phone' },
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

      expect(screen.getByText(tForm.invalidMobileError)).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('successfully submits form with valid data and navigates to thank you page', async () => {
      const user = userEvent.setup();
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          signatories: [
            {
              signatoryId: 'sig-123',
              envelopeId: 'env-456',
            },
          ],
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      // Mock sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: vi.fn(() => 'sig-123'),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

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
      fireEvent.change(emailInputs[1]!, { target: { value: 'test@example.com' } });

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

      await vi.waitFor(() => {
        expect(mockAddSignatory).toHaveBeenCalled();
      });

      await vi.waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/thank-you');
      });
    });

    it('handles submission error and displays error message', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Submission failed';
      mockAddSignatory.mockRejectedValueOnce(new Error(errorMessage));

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          signatories: [
            {
              signatoryId: 'sig-123',
              envelopeId: 'env-456',
            },
          ],
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: vi.fn(() => 'sig-123'),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

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
      fireEvent.change(emailInputs[1]!, { target: { value: 'test@example.com' } });

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

      await vi.waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalledWith('/thank-you');
    });

    it('handles non-Error submission failure', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockRejectedValueOnce('Non-Error failure');

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          signatories: [
            {
              signatoryId: 'sig-123',
              envelopeId: 'env-456',
            },
          ],
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: vi.fn(() => 'sig-123'),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

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
      fireEvent.change(emailInputs[1]!, { target: { value: 'test@example.com' } });

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

      await vi.waitFor(() => {
        expect(screen.getByText('An error occurred while adding signatory')).toBeInTheDocument();
      });
    });
  });

  describe('sessionStorage', () => {
    it('loads selectedSignatoryId from sessionStorage on mount', () => {
      const mockGetItem = vi.fn(() => 'sig-789');
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: mockGetItem,
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

      render(<NotAuthorizedSignatoryPage />);

      expect(mockGetItem).toHaveBeenCalledWith('selectedSignatoryId');
    });
  });
});
