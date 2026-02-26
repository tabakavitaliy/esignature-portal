import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { AddAuthorizedSign } from './add-authorized-sign';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('AddAuthorizedSign', () => {
  const { addAuthorizedSignPage: t } = translations;
  const mockPush = vi.fn();

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
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
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

    expect(screen.getByText(t.titleLabel)).toBeInTheDocument();
    expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.lastNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.addressAssociationLabel)).toBeInTheDocument();
    expect(screen.getByText(t.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(t.confirmEmailLabel)).toBeInTheDocument();
    expect(screen.getByText(t.mobileLabel)).toBeInTheDocument();
    expect(screen.getByText(t.correspondenceAddressLabel)).toBeInTheDocument();
  });

  it('renders all form field placeholders', () => {
    render(<AddAuthorizedSign />);

    const selectPlaceholders = screen.getAllByText(t.titlePlaceholder);
    expect(selectPlaceholders.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText(t.firstNamePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.lastNamePlaceholder)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(t.emailPlaceholder)).toHaveLength(2);
    expect(screen.getByPlaceholderText(t.mobilePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.addressLine1Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.addressLine2Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.addressLine3Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.cityPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.countyPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.postcodePlaceholder)).toBeInTheDocument();
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

  it('all text comes from translations', () => {
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

  describe('form validation', () => {
    it('shows requiredFieldsError when submitting empty form', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);
      const submitButton = screen.getByRole('button', { name: t.submitButton });

      await user.click(submitButton);

      const errorMessage = screen.getByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows emailMismatchError when emails do not match', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      fireEvent.change(screen.getByPlaceholderText(t.firstNamePlaceholder), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.lastNamePlaceholder), {
        target: { value: 'Doe' },
      });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await user.click(addressAssociationSelect!);
      const ownerOption = await screen.findByText('Owner');
      await user.click(ownerOption);

      const emailInputs = screen.getAllByPlaceholderText(t.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'different@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(t.addressLine1Placeholder), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.cityPlaceholder), {
        target: { value: 'London' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.postcodePlaceholder), {
        target: { value: 'SW1A 1AA' },
      });

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      const errorMessage = screen.getByText(t.emailMismatchError);
      expect(errorMessage).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows requiredFieldsError when title is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
      await user.type(firstNameInput, 'John');

      const lastNameInput = screen.getByPlaceholderText(t.lastNamePlaceholder);
      await user.type(lastNameInput, 'Doe');

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      const errorMessage = screen.getByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('shows requiredFieldsError when first name is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      const lastNameInput = screen.getByPlaceholderText(t.lastNamePlaceholder);
      await user.type(lastNameInput, 'Doe');

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      const errorMessage = screen.getByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('shows requiredFieldsError when last name is missing', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
      await user.type(firstNameInput, 'John');

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      const errorMessage = screen.getByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('clears error message when form becomes valid', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<AddAuthorizedSign />);

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      let errorMessage = screen.getByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      fireEvent.change(screen.getByPlaceholderText(t.firstNamePlaceholder), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.lastNamePlaceholder), {
        target: { value: 'Doe' },
      });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await user.click(addressAssociationSelect!);
      const ownerOption = await screen.findByText('Owner');
      await user.click(ownerOption);

      const emailInputs = screen.getAllByPlaceholderText(t.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(t.addressLine1Placeholder), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.cityPlaceholder), {
        target: { value: 'London' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.postcodePlaceholder), {
        target: { value: 'SW1A 1AA' },
      });

      await user.click(submitButton);

      errorMessage = screen.queryByText(t.requiredFieldsError)!;
      expect(errorMessage).not.toBeInTheDocument();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Form submitted successfully',
        expect.objectContaining({
          title: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('form field inputs', () => {
    it('updates title when selected', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      expect(screen.getByText('Mr')).toBeInTheDocument();
    });

    it('updates first name input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('updates last name input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const lastNameInput = screen.getByPlaceholderText(t.lastNamePlaceholder);
      await user.type(lastNameInput, 'Doe');

      expect(lastNameInput).toHaveValue('Doe');
    });

    it('updates email inputs', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const emailInputs = screen.getAllByPlaceholderText(t.emailPlaceholder);
      await user.type(emailInputs[0]!, 'john@example.com');
      await user.type(emailInputs[1]!, 'john@example.com');

      expect(emailInputs[0]).toHaveValue('john@example.com');
      expect(emailInputs[1]).toHaveValue('john@example.com');
    });

    it('updates mobile input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const mobileInput = screen.getByPlaceholderText(t.mobilePlaceholder);
      await user.type(mobileInput, '07700900000');

      expect(mobileInput).toHaveValue('07700900000');
    });

    it('updates address line 1 input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const addressLine1 = screen.getByPlaceholderText(t.addressLine1Placeholder);
      await user.type(addressLine1, '123 Main St');

      expect(addressLine1).toHaveValue('123 Main St');
    });

    it('updates city input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const cityInput = screen.getByPlaceholderText(t.cityPlaceholder);
      await user.type(cityInput, 'London');

      expect(cityInput).toHaveValue('London');
    });

    it('updates postcode input', async () => {
      const user = userEvent.setup();

      render(<AddAuthorizedSign />);

      const postcodeInput = screen.getByPlaceholderText(t.postcodePlaceholder);
      await user.type(postcodeInput, 'SW1A 1AA');

      expect(postcodeInput).toHaveValue('SW1A 1AA');
    });
  });

  describe('optional fields', () => {
    it('allows submission without mobile number', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      fireEvent.change(screen.getByPlaceholderText(t.firstNamePlaceholder), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.lastNamePlaceholder), {
        target: { value: 'Doe' },
      });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await user.click(addressAssociationSelect!);
      const ownerOption = await screen.findByText('Owner');
      await user.click(ownerOption);

      const emailInputs = screen.getAllByPlaceholderText(t.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(t.addressLine1Placeholder), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.cityPlaceholder), {
        target: { value: 'London' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.postcodePlaceholder), {
        target: { value: 'SW1A 1AA' },
      });

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Form submitted successfully',
        expect.objectContaining({
          mobile: '',
        })
      );

      consoleSpy.mockRestore();
    });

    it('allows submission without address line 2', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<AddAuthorizedSign />);

      const titleSelect = screen.getAllByRole('combobox')[0];
      await user.click(titleSelect!);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      fireEvent.change(screen.getByPlaceholderText(t.firstNamePlaceholder), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.lastNamePlaceholder), {
        target: { value: 'Doe' },
      });

      const addressAssociationSelect = screen.getAllByRole('combobox')[1];
      await user.click(addressAssociationSelect!);
      const ownerOption = await screen.findByText('Owner');
      await user.click(ownerOption);

      const emailInputs = screen.getAllByPlaceholderText(t.emailPlaceholder);
      fireEvent.change(emailInputs[0]!, { target: { value: 'john@example.com' } });
      fireEvent.change(emailInputs[1]!, { target: { value: 'john@example.com' } });

      fireEvent.change(screen.getByPlaceholderText(t.addressLine1Placeholder), {
        target: { value: '123 Main St' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.cityPlaceholder), {
        target: { value: 'London' },
      });
      fireEvent.change(screen.getByPlaceholderText(t.postcodePlaceholder), {
        target: { value: 'SW1A 1AA' },
      });

      const submitButton = screen.getByRole('button', { name: t.submitButton });
      await user.click(submitButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Form submitted successfully',
        expect.objectContaining({
          addressLine2: '',
          addressLine3: '',
          county: '',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('state management', () => {
    it('initializes all form fields as empty strings', () => {
      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
      const lastNameInput = screen.getByPlaceholderText(t.lastNamePlaceholder);
      const mobileInput = screen.getByPlaceholderText(t.mobilePlaceholder);

      expect(firstNameInput).toHaveValue('');
      expect(lastNameInput).toHaveValue('');
      expect(mobileInput).toHaveValue('');
    });

    it('maintains independent state for all form fields', () => {
      render(<AddAuthorizedSign />);

      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
      const lastNameInput = screen.getByPlaceholderText(t.lastNamePlaceholder);

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

      const firstNameLabel = screen.getByText(t.firstNameLabel);
      const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);

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
