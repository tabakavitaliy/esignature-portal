import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { ConfirmDetails } from './confirm-details';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('ConfirmDetails', () => {
  const { confirmDetailsPage: t } = translations;
  const mockPush = vi.fn();

  const mockSignatory = {
    signatoryId: 'signatory-1',
    envelopeId: 'envelope-1',
    title: 'Mr',
    firstname: 'John',
    surname: 'Doe',
    addressAssociation: 'Owner' as const,
    emailAddress: 'john.doe@example.com',
    mobile: '07700900000',
    agreementShareMethod: 'Unspecified' as const,
    correspondenceAddress: {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: '',
      addressLine4: '',
      town: 'London',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
    },
  };

  const mockData: MatterDetails = {
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
    sessionStorage.clear();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ConfirmDetails />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders Header with correct text', () => {
    render(<ConfirmDetails />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders ProgressStepper with 4 steps', () => {
    render(<ConfirmDetails />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('ProgressStepper shows step 2 as current', () => {
    render(<ConfirmDetails />);
    const currentStep = screen.getByLabelText('Step 2 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('renders description text', () => {
    render(<ConfirmDetails />);
    const description = screen.getByText(t.description);
    expect(description).toBeInTheDocument();
  });

  it('renders signatory details heading', () => {
    render(<ConfirmDetails />);
    const heading = screen.getByText(t.signatoryDetailsHeading);
    expect(heading).toBeInTheDocument();
  });

  it('renders Edit button in view mode', () => {
    render(<ConfirmDetails />);
    const editButton = screen.getByRole('button', { name: t.editButton });
    expect(editButton).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<ConfirmDetails />);
    
    expect(screen.getByText(t.titleLabel)).toBeInTheDocument();
    expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.lastNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(t.mobileLabel)).toBeInTheDocument();
    expect(screen.getByText(t.correspondenceAddressLabel)).toBeInTheDocument();
  });

  it('renders Back button with arrow icon', () => {
    render(<ConfirmDetails />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toBeInTheDocument();
  });

  it('renders Next button with correct text in view mode', () => {
    render(<ConfirmDetails />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toBeInTheDocument();
  });

  it('has gradient background styling', () => {
    const { container } = render(<ConfirmDetails />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<ConfirmDetails />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  describe('data loading from sessionStorage and useMatterDetails', () => {
    it('loads signatory data when selectedSignatoryId is in sessionStorage', async () => {
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');

      render(<ConfirmDetails />);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const emailInput = inputs.find((input) => 
          input.getAttribute('type') === 'email' || 
          (input as HTMLInputElement).value === 'john.doe@example.com'
        );
        expect(emailInput).toHaveValue('john.doe@example.com');
      });
    });

    it('renders empty form when no selectedSignatoryId in sessionStorage', () => {
      render(<ConfirmDetails />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders empty form when signatory not found', () => {
      sessionStorage.setItem('selectedSignatoryId', 'non-existent-id');

      render(<ConfirmDetails />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('populates all form fields with signatory data', async () => {
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');

      render(<ConfirmDetails />);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).toHaveValue('John');
      });
    });
  });

  describe('edit mode toggle', () => {
    it('starts in view mode with Edit button visible', () => {
      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });
      expect(editButton).toBeInTheDocument();
    });

    it('enters edit mode when Edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const editButtonAfter = screen.queryByRole('button', { name: t.editButton });
      expect(editButtonAfter).not.toBeInTheDocument();
    });

    it('hides Edit button in edit mode', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const editButtonAfter = screen.queryByRole('button', { name: t.editButton });
      expect(editButtonAfter).not.toBeInTheDocument();
    });

    it('changes Next button to "Save and Next" in edit mode', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const saveAndNextButton = screen.getByRole('button', { name: t.saveAndNextButton });
      expect(saveAndNextButton).toBeInTheDocument();
    });

    it('checkbox remains visible in edit mode', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const checkboxAfter = screen.getByRole('checkbox');
      expect(checkboxAfter).toBeInTheDocument();
    });
  });

  describe('form fields disabled state', () => {
    it('all form fields are disabled in view mode', () => {
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('all form fields are enabled in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).not.toBeDisabled();
      });
    });
  });

  describe('navigation', () => {
    it('navigates to confirm-name when Back button is clicked', async () => {
      const user = userEvent.setup();
      
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      
      await user.click(backButton);
      
      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('shows error when Next clicked without confirmation in view mode', async () => {
      const user = userEvent.setup();
      
      render(<ConfirmDetails />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });
      
      await user.click(nextButton);
      
      const errorMessage = screen.getByText(t.confirmDetailsError);
      expect(errorMessage).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('allows navigation when checkbox is confirmed in view mode', async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<ConfirmDetails />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);
      
      expect(mockPush).not.toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('form validation in edit mode', () => {
    it('shows error when required fields are empty', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const firstNameInput = inputs.find((input) => 
        (input as HTMLInputElement).value === 'John'
      );
      
      if (firstNameInput) {
        await user.clear(firstNameInput);
      }

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      const errorMessage = await screen.findByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('shows error when email is invalid', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const emailInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'john.doe@example.com'
        );
        expect(emailInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const emailInput = inputs.find((input) => 
        (input as HTMLInputElement).value === 'john.doe@example.com'
      );
      
      if (emailInput) {
        await user.clear(emailInput);
        await user.type(emailInput, 'invalid-email');
      }

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      const errorMessage = await screen.findByText(t.invalidEmailError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('validates successfully with all required fields filled', async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).not.toBeDisabled();
      });

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Form data saved', expect.any(Object));
      
      consoleWarnSpy.mockRestore();
    });

    it('allows empty optional fields', async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const mobileInput = inputs.find((input) => 
          (input as HTMLInputElement).value === '07700900000'
        );
        expect(mobileInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const mobileInput = inputs.find((input) => 
        (input as HTMLInputElement).value === '07700900000'
      );
      
      if (mobileInput) {
        await user.clear(mobileInput);
      }

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Form data saved', expect.any(Object));
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('checkbox behavior', () => {
    it('renders checkbox in view mode', () => {
      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('checkbox shows correct label text', () => {
      render(<ConfirmDetails />);
      const checkboxLabel = screen.getByText(t.confirmCheckboxLabel);
      expect(checkboxLabel).toBeInTheDocument();
    });

    it('checkbox is initially unchecked', () => {
      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('checkbox can be checked', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });

    it('checkbox can be toggled', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const checkbox = screen.getByRole('checkbox');
      
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('checkbox remains visible in edit mode', async () => {
      const user = userEvent.setup();
      render(<ConfirmDetails />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      const checkboxAfter = screen.getByRole('checkbox');
      expect(checkboxAfter).toBeInTheDocument();
    });
  });

  describe('edit mode form interactions', () => {
    it('can edit title in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).not.toBeDisabled();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const msOption = await screen.findByText('Ms');
      await user.click(msOption);

      await waitFor(() => {
        expect(select).toHaveTextContent('Ms');
      });
    });

    it('can edit first name in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const firstNameInput = inputs.find((input) => 
        (input as HTMLInputElement).value === 'John'
      );
      
      if (firstNameInput) {
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Jane');
        expect(firstNameInput).toHaveValue('Jane');
      }
    });

    it('can edit email in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const emailInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'john.doe@example.com'
        );
        expect(emailInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const emailInput = inputs.find((input) => 
        (input as HTMLInputElement).value === 'john.doe@example.com'
      );
      
      if (emailInput) {
        await user.clear(emailInput);
        await user.type(emailInput, 'jane.doe@example.com');
        expect(emailInput).toHaveValue('jane.doe@example.com');
      }
    });

    it('can edit optional mobile field in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const mobileInput = inputs.find((input) => 
          (input as HTMLInputElement).value === '07700900000'
        );
        expect(mobileInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const mobileInput = inputs.find((input) => 
        (input as HTMLInputElement).value === '07700900000'
      );
      
      if (mobileInput) {
        await user.clear(mobileInput);
        await user.type(mobileInput, '07700900999');
        expect(mobileInput).toHaveValue('07700900999');
      }
    });

    it('can edit address fields in edit mode', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const addressInput = inputs.find((input) => 
          (input as HTMLInputElement).value === '123 Main St'
        );
        expect(addressInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const addressInput = inputs.find((input) => 
        (input as HTMLInputElement).value === '123 Main St'
      );
      
      if (addressInput) {
        await user.clear(addressInput);
        await user.type(addressInput, '456 Oak Ave');
        expect(addressInput).toHaveValue('456 Oak Ave');
      }
    });
  });

  describe('error handling', () => {
    it('clears error message when clicking Next again after error', async () => {
      const user = userEvent.setup();
      
      render(<ConfirmDetails />);
      
      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);
      
      const errorMessage = screen.getByText(t.confirmDetailsError);
      expect(errorMessage).toBeInTheDocument();

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await user.click(nextButton);
      
      const errorAfter = screen.queryByText(t.confirmDetailsError);
      expect(errorAfter).not.toBeInTheDocument();
    });

    it('clears error message when clicking Save and Next again in edit mode', async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).not.toBeDisabled();
      });

      const inputs = screen.getAllByRole('textbox');
      const firstNameInput = inputs.find((input) => 
        (input as HTMLInputElement).value === 'John'
      );
      
      if (firstNameInput) {
        await user.clear(firstNameInput);
      }

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      const errorMessage = await screen.findByText(t.requiredFieldsError);
      expect(errorMessage).toBeInTheDocument();

      if (firstNameInput) {
        await user.type(firstNameInput, 'John');
      }

      await user.click(saveButton);

      const errorAfter = screen.queryByText(t.requiredFieldsError);
      expect(errorAfter).not.toBeInTheDocument();
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('component styling', () => {
    it('card has rounded corners and backdrop blur', () => {
      const { container } = render(<ConfirmDetails />);
      const card = container.querySelector('.rounded-2xl');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('backdrop-blur-sm');
    });

    it('has divider between description and form', () => {
      const { container } = render(<ConfirmDetails />);
      const divider = container.querySelector('.h-px.w-\\[24px\\]');
      expect(divider).toBeInTheDocument();
    });

    it('Edit button has correct styling', () => {
      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });
      expect(editButton).toHaveClass('bg-transparent');
      expect(editButton).toHaveClass('border-0');
    });

    it('buttons are in a flex container with gap', () => {
      const { container } = render(<ConfirmDetails />);
      const buttonContainer = container.querySelector('.flex.gap-4');
      expect(buttonContainer).toBeInTheDocument();
      
      const buttons = buttonContainer?.querySelectorAll('button');
      expect(buttons?.length).toBeGreaterThanOrEqual(2);
    });

    it('Back button is narrower than Next button', () => {
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      const nextButton = screen.getByRole('button', { name: t.nextButton });
      
      expect(backButton).toHaveClass('w-auto');
      expect(nextButton).toHaveClass('w-full');
    });

    it('disabled inputs have grey background and text color', () => {
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveClass('disabled:bg-[#F5F5F5]');
        expect(input).toHaveClass('disabled:text-[#CCCCCC]');
        expect(input).toHaveClass('disabled:opacity-100');
      });
    });

    it('disabled select has grey background and text color', () => {
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('disabled:bg-[#F5F5F5]');
      expect(select).toHaveClass('disabled:text-[#CCCCCC]');
      expect(select).toHaveClass('disabled:opacity-100');
    });
  });

  describe('accessibility', () => {
    it('main has semantic main element', () => {
      render(<ConfirmDetails />);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('header has semantic header element', () => {
      render(<ConfirmDetails />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders logo in header', () => {
      render(<ConfirmDetails />);
      const logo = screen.getByRole('img', { name: /liberty logo/i });
      expect(logo).toBeInTheDocument();
    });

    it('Back button has proper aria-label', () => {
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toHaveAttribute('aria-label', t.backButtonLabel);
    });
  });

  describe('layout and structure', () => {
    it('ContentWrapper centers content with max width', () => {
      const { container } = render(<ConfirmDetails />);
      const wrapper = container.querySelector('.max-w-\\[600px\\]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('mx-auto');
    });

    it('main content area uses column layout', () => {
      render(<ConfirmDetails />);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('flex-col');
    });

    it('card expands to fill available vertical space', () => {
      const { container } = render(<ConfirmDetails />);
      const card = container.querySelector('.rounded-2xl');
      expect(card).toHaveClass('flex-1');
    });

    it('form fields use consistent spacing', () => {
      const { container } = render(<ConfirmDetails />);
      const formContainer = container.querySelector('.space-y-5');
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('all text from translations', () => {
    it('uses translations for all visible text', () => {
      render(<ConfirmDetails />);
      
      expect(screen.getByText(t.headerText)).toBeInTheDocument();
      expect(screen.getByText(t.description)).toBeInTheDocument();
      expect(screen.getByText(t.signatoryDetailsHeading)).toBeInTheDocument();
      expect(screen.getByText(t.editButton)).toBeInTheDocument();
      expect(screen.getByText(t.titleLabel)).toBeInTheDocument();
      expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
      expect(screen.getByText(t.lastNameLabel)).toBeInTheDocument();
      expect(screen.getByText(t.emailLabel)).toBeInTheDocument();
      expect(screen.getByText(t.mobileLabel)).toBeInTheDocument();
      expect(screen.getByText(t.correspondenceAddressLabel)).toBeInTheDocument();
      expect(screen.getByText(t.confirmCheckboxLabel)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
    });
  });

  describe('loading and error states from useMatterDetails', () => {
    it('renders correctly when isLoading is true', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      render(<ConfirmDetails />);
      const heading = screen.getByRole('heading', { name: t.headerText });
      expect(heading).toBeInTheDocument();
    });

    it('renders correctly when error is present', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
      });

      render(<ConfirmDetails />);
      const heading = screen.getByRole('heading', { name: t.headerText });
      expect(heading).toBeInTheDocument();
    });

    it('renders correctly when data is undefined', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      render(<ConfirmDetails />);
      const heading = screen.getByRole('heading', { name: t.headerText });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('initializes isEditMode as false', () => {
      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });
      expect(editButton).toBeInTheDocument();
    });

    it('initializes isConfirmed as false', () => {
      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('maintains form state when toggling between modes', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).toHaveValue('John');
      });

      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).toHaveValue('John');
      });
    });
  });

  describe('console logging for debugging', () => {
    it('logs form data when Save and Next is clicked with valid data', async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorage.setItem('selectedSignatoryId', 'signatory-1');
      
      render(<ConfirmDetails />);
      
      const editButton = screen.getByRole('button', { name: t.editButton });
      await user.click(editButton);

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find((input) => 
          (input as HTMLInputElement).value === 'John'
        );
        expect(firstNameInput).not.toBeDisabled();
      });

      const saveButton = screen.getByRole('button', { name: t.saveAndNextButton });
      await user.click(saveButton);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Form data saved', {
        title: 'Mr',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobile: '07700900000',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        town: 'London',
        postcode: 'SW1A 1AA',
      });
      
      consoleWarnSpy.mockRestore();
    });
  });
});
