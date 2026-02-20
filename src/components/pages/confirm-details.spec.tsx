import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { ConfirmDetails } from './confirm-details';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('ConfirmDetails', () => {
  const { confirmDetailsPage: t } = translations;
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  describe('Rendering tests', () => {
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

    it('ProgressStepper shows step 1 as completed', () => {
      render(<ConfirmDetails />);
      const completedStep = screen.getByLabelText('Step 1 completed');
      expect(completedStep).toBeInTheDocument();
      expect(completedStep).toHaveClass('bg-stepper-complete');
    });

    it('ProgressStepper shows step 2 as current', () => {
      render(<ConfirmDetails />);
      const currentStep = screen.getByLabelText('Step 2 current');
      expect(currentStep).toBeInTheDocument();
      expect(currentStep).toHaveClass('bg-stepper-current');
    });

    it('ProgressStepper shows steps 3-4 as upcoming', () => {
      render(<ConfirmDetails />);

      const upcomingStep3 = screen.getByLabelText('Step 3 upcoming');
      expect(upcomingStep3).toBeInTheDocument();

      const upcomingStep4 = screen.getByLabelText('Step 4 upcoming');
      expect(upcomingStep4).toBeInTheDocument();
    });

    it('renders description paragraph', () => {
      render(<ConfirmDetails />);
      const description = screen.getByText(t.description);
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('renders signatory details heading', () => {
      render(<ConfirmDetails />);
      const heading = screen.getByRole('heading', { name: t.signatoryDetailsHeading });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders Edit button with pencil icon', () => {
      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent(t.editButton);
    });

    it('renders Back button with arrow icon', () => {
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toBeInTheDocument();
    });

    it('renders Next button with correct text', () => {
      render(<ConfirmDetails />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('Form field tests', () => {
    it('renders Title select with correct label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.titleLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Title select with correct placeholder', () => {
      render(<ConfirmDetails />);
      const placeholder = screen.getByText(t.titlePlaceholder);
      expect(placeholder).toBeInTheDocument();
    });

    it('renders First name input with correct label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.firstNameLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Last name input with correct label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.lastNameLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Email input with correct label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.emailLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Mobile number input with correct label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.mobileLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Correspondence address label', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.correspondenceAddressLabel);
      expect(label).toBeInTheDocument();
    });

    it('renders Address line 1 input with correct label', () => {
      render(<ConfirmDetails />);
      const labels = screen.getAllByText(t.addressLine1Label);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders Address line 2 input with correct label', () => {
      render(<ConfirmDetails />);
      const labels = screen.getAllByText(t.addressLine2Label);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders Town input with correct label', () => {
      render(<ConfirmDetails />);
      const labels = screen.getAllByText(t.townLabel);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders Postcode input with correct label', () => {
      render(<ConfirmDetails />);
      const labels = screen.getAllByText(t.postcodeLabel);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders confirmation checkbox with correct label', () => {
      render(<ConfirmDetails />);
      const checkboxLabel = screen.getByText(t.confirmCheckboxLabel);
      expect(checkboxLabel).toBeInTheDocument();
    });

    it('checkbox is initially unchecked', () => {
      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Accessibility tests', () => {
    it('main has semantic main element', () => {
      render(<ConfirmDetails />);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('header has semantic banner role', () => {
      render(<ConfirmDetails />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('Title select has combobox role', () => {
      render(<ConfirmDetails />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('Title select label is properly associated', () => {
      render(<ConfirmDetails />);
      const label = screen.getByText(t.titleLabel);
      const select = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for');
      expect(select).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(select.getAttribute('id'));
    });

    it('checkbox has correct role', () => {
      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('Back button has proper aria-label', () => {
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toHaveAttribute('aria-label', t.backButtonLabel);
    });

    it('Edit button has proper aria-label', () => {
      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });
      expect(editButton).toHaveAttribute('aria-label', t.editButton);
    });
  });

  describe('Layout tests', () => {
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

    it('card has rounded corners and backdrop blur', () => {
      const { container } = render(<ConfirmDetails />);
      const card = container.querySelector('.rounded-2xl');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('backdrop-blur-sm');
    });

    it('card expands to fill available vertical space', () => {
      const { container } = render(<ConfirmDetails />);
      const card = container.querySelector('.rounded-2xl');
      expect(card).toHaveClass('flex-1');
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

    it('Back button has secondary styling', () => {
      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toHaveClass('bg-transparent');
      expect(backButton).toHaveClass('border-2');
      expect(backButton).toHaveClass('border-white');
    });

    it('Next button has primary styling', () => {
      render(<ConfirmDetails />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });
      expect(nextButton).toHaveClass('bg-white');
    });

    it('ContentWrapper centers content with max width', () => {
      const { container } = render(<ConfirmDetails />);
      const wrapper = container.querySelector('.max-w-\\[600px\\]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('mx-auto');
    });
  });

  describe('Translation tests', () => {
    it('all text comes from translations', () => {
      render(<ConfirmDetails />);

      expect(screen.getByText(t.headerText)).toBeInTheDocument();
      expect(screen.getByText(t.description)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: t.signatoryDetailsHeading })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.editButton })).toBeInTheDocument();
      expect(screen.getByText(t.titleLabel)).toBeInTheDocument();
      expect(screen.getByText(t.titlePlaceholder)).toBeInTheDocument();
      expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
      expect(screen.getByText(t.lastNameLabel)).toBeInTheDocument();
      expect(screen.getByText(t.emailLabel)).toBeInTheDocument();
      expect(screen.getByText(t.mobileLabel)).toBeInTheDocument();
      expect(screen.getByText(t.correspondenceAddressLabel)).toBeInTheDocument();
      expect(screen.getByText(t.confirmCheckboxLabel)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
    });

    it('renders logo in header', () => {
      render(<ConfirmDetails />);
      const logo = screen.getByRole('img', { name: /liberty logo/i });
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Interaction tests', () => {
    it('navigates to /confirm-name when Back button is clicked', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn');

      render(<ConfirmDetails />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });

      await user.click(backButton);

      expect(consoleSpy).toHaveBeenCalledWith('Back button clicked');
      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
      expect(mockPush).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });

    it('logs when Next button is clicked', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn');

      render(<ConfirmDetails />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      expect(consoleSpy).toHaveBeenCalledWith('Next button clicked');

      consoleSpy.mockRestore();
    });

    it('logs when Edit button is clicked', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn');

      render(<ConfirmDetails />);
      const editButton = screen.getByRole('button', { name: t.editButton });

      await user.click(editButton);

      expect(consoleSpy).toHaveBeenCalledWith('Edit button clicked');

      consoleSpy.mockRestore();
    });

    it('logs when Title select changes', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn');

      render(<ConfirmDetails />);
      const select = screen.getByRole('combobox');

      await user.click(select);
      const mrOption = await screen.findByText('Mr');
      await user.click(mrOption);

      expect(consoleSpy).toHaveBeenCalledWith('Title changed:', 'mr');

      consoleSpy.mockRestore();
    });

    it('checkbox can be toggled', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'warn');

      render(<ConfirmDetails />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await user.click(checkbox);

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(consoleSpy).toHaveBeenCalledWith('Checkbox changed:', true);

      await user.click(checkbox);

      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(consoleSpy).toHaveBeenCalledWith('Checkbox changed:', false);

      consoleSpy.mockRestore();
    });

    it('checkbox can be toggled by clicking its label', async () => {
      const user = userEvent.setup();

      render(<ConfirmDetails />);
      const checkboxLabel = screen.getByText(t.confirmCheckboxLabel);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkboxLabel);

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('CustomerPrivacy', () => {
    it('renders CustomerPrivacy component at bottom', () => {
      const mockData = {
        hasSignedMatter: false,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Pending',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmDetails />);
      const privacyLink = screen.getByText(translations.customerPrivacy.linkText);
      expect(privacyLink).toBeInTheDocument();
    });

    it('does not render CustomerPrivacy when no privacy URL', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      render(<ConfirmDetails />);
      const privacyLink = screen.queryByText(translations.customerPrivacy.linkText);
      expect(privacyLink).not.toBeInTheDocument();
    });
  });

  describe('Form inputs state', () => {
    it('all inputs are initially empty', () => {
      render(<ConfirmDetails />);
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveValue('');
      });
    });

    it('Title select is initially empty', () => {
      render(<ConfirmDetails />);
      const placeholder = screen.getByText(t.titlePlaceholder);
      expect(placeholder).toBeInTheDocument();
    });
  });
});
