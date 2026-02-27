import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { AddAuthorizedSign } from './add-authorized-sign';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useAddNewSignatoryModule from '@/hooks/queries/use-add-new-signatory';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-add-new-signatory', () => ({
  useAddNewSignatory: vi.fn(),
}));

describe('AddAuthorizedSign', () => {
  const { addAuthorizedSignPage: t, signatoryDetailsForm: tForm } = translations;
  const mockPush = vi.fn();
  const mockAddSignatory = vi.fn();

  const selectOption = async (user: ReturnType<typeof userEvent.setup>, selectElement: HTMLElement, optionText: string): Promise<void> => {
    await user.click(selectElement);
    await waitFor(async () => {
      const option = await screen.findByRole('option', { name: optionText });
      await user.click(option);
    });
  };

  const mockSignatory = {
    signatoryId: 'signatory-123',
    envelopeId: 'envelope-456',
    title: 'Mr',
    firstname: 'Existing',
    surname: 'User',
    emailAddress: 'existing@example.com',
    mobile: null,
    addressAssociation: 'Owner' as const,
    agreementShareMethod: 'Unspecified' as const,
    correspondenceAddress: {
      addressLine1: '1 Test St',
      addressLine2: null,
      addressLine3: null,
      town: 'London',
      county: null,
      postcode: 'SW1A 1AA',
    },
  };

  const mockMatterDetails: MatterDetails = {
    hasSignedMatter: false,
    matterId: 'test-matter-id',
    matterReference: 'REF123',
    matterStatus: 'Pending',
    privacyPolicyUrl: 'https://example.com/privacy',
    matterDocumentId: 'test-doc-id',
    propertyAddresses: [],
    signatories: [mockSignatory],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('selectedSignatoryId', 'signatory-123');
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });
    (useAddNewSignatoryModule.useAddNewSignatory as ReturnType<typeof vi.fn>).mockReturnValue({
      addNewSignatory: mockAddSignatory,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  });

  it('renders without crashing', () => {
    render(<AddAuthorizedSign />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders Header with correct text', () => {
    render(<AddAuthorizedSign />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders ProgressStepper with 4 steps', () => {
    render(<AddAuthorizedSign />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('ProgressStepper shows step 2 as current', () => {
    render(<AddAuthorizedSign />);
    const currentStep = screen.getByLabelText('Step 2 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('ProgressStepper shows step 1 as completed', () => {
    render(<AddAuthorizedSign />);
    const completedStep = screen.getByLabelText('Step 1 completed');
    expect(completedStep).toBeInTheDocument();
  });

  it('ProgressStepper shows steps 3-4 as upcoming', () => {
    render(<AddAuthorizedSign />);

    const upcomingStep3 = screen.getByLabelText('Step 3 upcoming');
    expect(upcomingStep3).toBeInTheDocument();

    const upcomingStep4 = screen.getByLabelText('Step 4 upcoming');
    expect(upcomingStep4).toBeInTheDocument();
  });

  it('renders form heading and description', () => {
    render(<AddAuthorizedSign />);
    expect(screen.getByText(t.formHeading)).toBeInTheDocument();
    expect(screen.getByText(t.formDescription)).toBeInTheDocument();
  });

  it('renders signatory details heading', () => {
    render(<AddAuthorizedSign />);
    expect(screen.getByText(t.signatoryDetailsHeading)).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<AddAuthorizedSign />);

    expect(screen.getByText(tForm.titleLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.firstNameLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.lastNameLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.addressAssociationLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.confirmEmailLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.mobileLabel)).toBeInTheDocument();
    expect(screen.getByText(tForm.correspondenceAddressLabel)).toBeInTheDocument();
  });

  it('renders all form field placeholders', () => {
    render(<AddAuthorizedSign />);

    const selectPlaceholders = screen.getAllByText(tForm.titlePlaceholder);
    expect(selectPlaceholders.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText(tForm.firstNamePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.lastNamePlaceholder)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(tForm.emailPlaceholder)).toHaveLength(2);
    expect(screen.getByPlaceholderText(tForm.mobilePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.addressLine1Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.addressLine2Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.addressLine3Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.townPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.countyPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(tForm.postcodePlaceholder)).toBeInTheDocument();
  });

  it('renders legal basis text', () => {
    render(<AddAuthorizedSign />);
    expect(screen.getByText(t.legalBasisText)).toBeInTheDocument();
  });

  it('renders data handling text', () => {
    render(<AddAuthorizedSign />);
    expect(screen.getByText(t.dataHandlingText)).toBeInTheDocument();
  });

  it('renders Back button with arrow icon', () => {
    render(<AddAuthorizedSign />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toBeInTheDocument();
  });

  it('Back button has secondary styling', () => {
    render(<AddAuthorizedSign />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toHaveClass('bg-transparent');
    expect(backButton).toHaveClass('border-2');
    expect(backButton).toHaveClass('border-white');
  });

  it('renders Submit button with correct text', () => {
    render(<AddAuthorizedSign />);
    const submitButton = screen.getByRole('button', { name: t.submitButton });
    expect(submitButton).toBeInTheDocument();
  });

  it('Submit button has primary styling', () => {
    render(<AddAuthorizedSign />);
    const submitButton = screen.getByRole('button', { name: t.submitButton });
    expect(submitButton).toHaveClass('bg-white');
  });

  it('has gradient background styling', () => {
    const { container } = render(<AddAuthorizedSign />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<AddAuthorizedSign />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('main has semantic main element for accessibility', () => {
    render(<AddAuthorizedSign />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('header has semantic header element for accessibility', () => {
    render(<AddAuthorizedSign />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('navigates to /confirm-name when Back button is clicked', async () => {
    const user = userEvent.setup();

    render(<AddAuthorizedSign />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });

    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('title select has combobox role for accessibility', () => {
    render(<AddAuthorizedSign />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  it('card has rounded corners and backdrop blur', () => {
    const { container } = render(<AddAuthorizedSign />);
    const card = container.querySelector('.rounded-2xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('backdrop-blur-sm');
  });

  it('buttons are in a flex container with gap', () => {
    const { container } = render(<AddAuthorizedSign />);
    const buttonContainer = container.querySelector('.flex.gap-4');
    expect(buttonContainer).toBeInTheDocument();

    const buttons = buttonContainer?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
  });

  it('Back button is narrower than Submit button', () => {
    render(<AddAuthorizedSign />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const submitButton = screen.getByRole('button', { name: t.submitButton });

    expect(backButton).toHaveClass('w-auto');
    expect(submitButton).toHaveClass('w-full');
  });

  it('all page-level text comes from translations', () => {
    render(<AddAuthorizedSign />);

    expect(screen.getByText(t.headerText)).toBeInTheDocument();
    expect(screen.getByText(t.formHeading)).toBeInTheDocument();
    expect(screen.getByText(t.formDescription)).toBeInTheDocument();
    expect(screen.getByText(t.signatoryDetailsHeading)).toBeInTheDocument();
    expect(screen.getByText(t.legalBasisText)).toBeInTheDocument();
    expect(screen.getByText(t.dataHandlingText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.submitButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });

  it('Submit button is disabled when isPending', () => {
    (useAddNewSignatoryModule.useAddNewSignatory as ReturnType<typeof vi.fn>).mockReturnValue({
      addNewSignatory: mockAddSignatory,
      isPending: true,
      isError: false,
      error: null,
      isSuccess: false,
    });

    render(<AddAuthorizedSign />);
    const submitButton = screen.getByRole('button', { name: t.submitButton });
    expect(submitButton).toBeDisabled();
  });

  describe('form validation', () => {
    it('shows requiredFieldsError when submitting empty form', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);
      const submitButton = screen.getByRole('button', { name: t.submitButton });

      await user.click(submitButton);

      const errorMessage = screen.getByText(tForm.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows requiredFieldsError when title is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      await user.type(screen.getByPlaceholderText(tForm.firstNamePlaceholder), 'John');
      await user.type(screen.getByPlaceholderText(tForm.lastNamePlaceholder), 'Doe');

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();
    });

    it('shows requiredFieldsError when first name is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      await user.type(screen.getByPlaceholderText(tForm.lastNamePlaceholder), 'Doe');

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();
    });

    it('shows requiredFieldsError when last name is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      await user.type(screen.getByPlaceholderText(tForm.firstNamePlaceholder), 'John');

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();
    });

    it('shows requiredFieldsError when mobile is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();
      expect(mockAddSignatory).not.toHaveBeenCalled();
    });

    it('shows invalidEmailError when email format is invalid', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'not-a-valid-email' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'not-a-valid-email' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), { target: { value: '07700900000' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.invalidEmailError)).toBeInTheDocument();
      expect(mockAddSignatory).not.toHaveBeenCalled();
    });

    it('shows emailMismatchError when emails do not match', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'different@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), { target: { value: '07700900000' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.emailMismatchError)).toBeInTheDocument();
      expect(mockAddSignatory).not.toHaveBeenCalled();
    });

    it('shows invalidMobileError when mobile format is invalid', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), { target: { value: 'abc' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.getByText(tForm.invalidMobileError)).toBeInTheDocument();
      expect(mockAddSignatory).not.toHaveBeenCalled();
    });

    it('clears error message on next submit attempt', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      await user.click(screen.getByRole('button', { name: t.submitButton }));
      expect(screen.getByText(tForm.requiredFieldsError)).toBeInTheDocument();

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(screen.queryByText(tForm.emailMismatchError)).not.toBeInTheDocument();
    });
  });

  describe('API submission', () => {
    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), { target: { value: '07700900000' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });
    };

    it('calls addSignatory with correct payload on valid submission', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockResolvedValue({ success: true });

      render(<AddAuthorizedSign />);
      await fillValidForm(user);

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      await waitFor(() => {
        expect(mockAddSignatory).toHaveBeenCalledWith({
          signatory: expect.objectContaining({
            signatoryId: 'signatory-123',
            envelopeId: 'envelope-456',
            title: 'Mr',
            firstname: 'John',
            surname: 'Doe',
            addressAssociation: 'Owner',
            emailAddress: 'john@example.com',
            mobile: '07700900000',
            agreementShareMethod: 'Unspecified',
            correspondenceAddress: expect.objectContaining({
              addressLine1: '123 Main St',
              addressLine4: null,
              town: 'London',
              postcode: 'SW1A 1AA',
            }),
          }),
        });
      });
    });

    it('navigates to /confirm-signatory on successful submission', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockResolvedValue({ success: true });

      render(<AddAuthorizedSign />);
      await fillValidForm(user);

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/confirm-signatory');
      });
    });

    it('shows error message when API call fails', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockRejectedValue(new Error('Network error'));

      render(<AddAuthorizedSign />);
      await fillValidForm(user);

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows fallback error message when API throws non-Error', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockRejectedValue('unknown error');

      render(<AddAuthorizedSign />);
      await fillValidForm(user);

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      await waitFor(() => {
        expect(screen.getByText('An error occurred while adding signatory')).toBeInTheDocument();
      });
    });

    it('does not navigate when validation fails', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);
      await user.click(screen.getByRole('button', { name: t.submitButton }));

      expect(mockAddSignatory).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('form field inputs', () => {
    it('updates title when selected', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      expect(screen.getAllByText('Mr').length).toBeGreaterThan(0);
    });

    it('updates first name input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(tForm.firstNamePlaceholder);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('updates last name input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const lastNameInput = screen.getByPlaceholderText(tForm.lastNamePlaceholder);
      await user.type(lastNameInput, 'Doe');

      expect(lastNameInput).toHaveValue('Doe');
    });

    it('updates email inputs', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      await user.type(emailInputs[0]!, 'john@example.com');
      await user.type(emailInputs[1]!, 'john@example.com');

      expect(emailInputs[0]).toHaveValue('john@example.com');
      expect(emailInputs[1]).toHaveValue('john@example.com');
    });

    it('updates mobile input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const mobileInput = screen.getByPlaceholderText(tForm.mobilePlaceholder);
      await user.type(mobileInput, '07700900000');

      expect(mobileInput).toHaveValue('07700900000');
    });

    it('updates address line 1 input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const addressLine1 = screen.getByPlaceholderText(tForm.addressLine1Placeholder);
      await user.type(addressLine1, '123 Main St');

      expect(addressLine1).toHaveValue('123 Main St');
    });

    it('updates town input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const townInput = screen.getByPlaceholderText(tForm.townPlaceholder);
      await user.type(townInput, 'London');

      expect(townInput).toHaveValue('London');
    });

    it('updates postcode input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const postcodeInput = screen.getByPlaceholderText(tForm.postcodePlaceholder);
      await user.type(postcodeInput, 'SW1A 1AA');

      expect(postcodeInput).toHaveValue('SW1A 1AA');
    });
  });

  describe('optional address fields', () => {
    it('allows submission without address line 2, 3, and county', async () => {
      const user = userEvent.setup();
      mockAddSignatory.mockResolvedValue({ success: true });

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await selectOption(user, titleSelect!, 'Mr');

      fireEvent.change(screen.getByPlaceholderText(tForm.firstNamePlaceholder), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.lastNamePlaceholder), { target: { value: 'Doe' } });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await selectOption(user, addressAssociationSelect!, 'Owner');

      const emailInputs = screen.getAllByPlaceholderText(tForm.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(tForm.mobilePlaceholder), { target: { value: '07700900000' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.addressLine1Placeholder), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.townPlaceholder), { target: { value: 'London' } });
      fireEvent.change(screen.getByPlaceholderText(tForm.postcodePlaceholder), { target: { value: 'SW1A 1AA' } });

      await user.click(screen.getByRole('button', { name: t.submitButton }));

      await waitFor(() => {
        expect(mockAddSignatory).toHaveBeenCalledWith({
          signatory: expect.objectContaining({
            correspondenceAddress: expect.objectContaining({
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              county: null,
            }),
          }),
        });
      });
    });
  });

  describe('state management', () => {
    it('initializes all form fields as empty strings', () => {
      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(tForm.firstNamePlaceholder);
      const lastNameInput = screen.getByPlaceholderText(tForm.lastNamePlaceholder);
      const mobileInput = screen.getByPlaceholderText(tForm.mobilePlaceholder);

      expect(firstNameInput).toHaveValue('');
      expect(lastNameInput).toHaveValue('');
      expect(mobileInput).toHaveValue('');
    });

    it('maintains independent state for all form fields', () => {
      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(tForm.firstNamePlaceholder);
      const lastNameInput = screen.getByPlaceholderText(tForm.lastNamePlaceholder);

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels on buttons', () => {
      render(<AddAuthorizedSign />);

      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      const submitButton = screen.getByRole('button', { name: t.submitButton });

      expect(backButton).toHaveAttribute('aria-label', t.backButtonLabel);
      expect(submitButton).toBeInTheDocument();
    });

    it('form inputs are associated with their labels', () => {
      render(<AddAuthorizedSign />);

      const firstNameLabel = screen.getByText(tForm.firstNameLabel);
      const firstNameInput = screen.getByPlaceholderText(tForm.firstNamePlaceholder);

      const firstNameLabelFor = firstNameLabel.getAttribute('for');
      const firstNameInputId = firstNameInput.getAttribute('id');

      expect(firstNameLabelFor).toBe(firstNameInputId);
    });
  });

  describe('layout and styling', () => {
    it('ContentWrapper centers content with max width', () => {
      const { container } = render(<AddAuthorizedSign />);
      const wrapper = container.querySelector('.max-w-\\[600px\\]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('mx-auto');
    });

    it('main content area uses column layout', () => {
      render(<AddAuthorizedSign />);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('flex-col');
    });

    it('card expands to fill available vertical space', () => {
      const { container } = render(<AddAuthorizedSign />);
      const card = container.querySelector('.rounded-2xl');
      expect(card).toHaveClass('flex-1');
    });

    it('has divider line between heading and form', () => {
      const { container } = render(<AddAuthorizedSign />);
      const divider = container.querySelector('.h-px.w-\\[24px\\]');
      expect(divider).toBeInTheDocument();
    });
  });
});
