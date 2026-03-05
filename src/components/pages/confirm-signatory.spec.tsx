import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { ConfirmSignatory } from './confirm-signatory';
import translations from '@/i18n/en.json';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import * as useReadyToSignModule from '@/hooks/queries/use-ready-to-sign';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/hooks/queries/use-ready-to-sign', () => ({
  useReadyToSign: vi.fn(),
}));

describe('ConfirmSignatory', () => {
  const { confirmSignatoryPage: t } = translations;
  const mockPush = vi.fn();
  const mockSign = vi.fn();

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
    (useReadyToSignModule.useReadyToSign as ReturnType<typeof vi.fn>).mockReturnValue({
      sign: mockSign,
      isLoading: false,
      error: null,
      data: undefined,
    });
  });

  it('renders without crashing', () => {
    render(<ConfirmSignatory />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders Header with correct text', () => {
    render(<ConfirmSignatory />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders ProgressStepper with 4 steps', () => {
    render(<ConfirmSignatory />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('ProgressStepper shows step 3 as current', () => {
    render(<ConfirmSignatory />);
    const currentStep = screen.getByLabelText('Step 3 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('ProgressStepper shows steps 1-2 as completed', () => {
    render(<ConfirmSignatory />);

    const completedStep1 = screen.getByLabelText('Step 1 completed');
    expect(completedStep1).toBeInTheDocument();
    expect(completedStep1).toHaveClass('bg-stepper-complete');

    const completedStep2 = screen.getByLabelText('Step 2 completed');
    expect(completedStep2).toBeInTheDocument();
    expect(completedStep2).toHaveClass('bg-stepper-complete');
  });

  it('ProgressStepper shows step 4 as upcoming', () => {
    render(<ConfirmSignatory />);

    const upcomingStep4 = screen.getByLabelText('Step 4 upcoming');
    expect(upcomingStep4).toBeInTheDocument();
    expect(upcomingStep4).toHaveClass('bg-stepper-upcoming');
  });

  it('renders address count text', () => {
    const mockData: MatterDetails = {
      hasSignedMatter: true,
      matterId: 'test-matter-id',
      matterReference: 'REF123',
      matterStatus: 'Active',
      privacyPolicyUrl: 'https://example.com/privacy',
      matterDocumentId: 'test-doc-id',
      propertyAddresses: [
        {
          addressLine1: '123 Main St',
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          town: 'London',
          county: null,
          postcode: 'SW1A 1AA',
        },
      ],
      signatories: [],
    };

    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    render(<ConfirmSignatory />);
    expect(screen.getByText(/1 address/i)).toBeInTheDocument();
    expect(screen.getByText(/associated with this agreement/i)).toBeInTheDocument();
  });

  it('renders authority question text', () => {
    render(<ConfirmSignatory />);
    const question = screen.getByText(t.authorityQuestion);
    expect(question).toBeInTheDocument();
  });

  it('renders Back button with arrow icon', () => {
    render(<ConfirmSignatory />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toBeInTheDocument();
  });

  it('Back button has secondary styling', () => {
    render(<ConfirmSignatory />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toHaveClass('bg-transparent');
    expect(backButton).toHaveClass('border-2');
    expect(backButton).toHaveClass('border-white');
  });

  it('renders Preview agreement button with correct text', () => {
    render(<ConfirmSignatory />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent('Preview agreement');
  });

  it('Preview agreement button has primary styling', () => {
    render(<ConfirmSignatory />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toHaveClass('bg-white');
  });

  it('has gradient background styling', () => {
    const { container } = render(<ConfirmSignatory />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<ConfirmSignatory />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('main has semantic main element for accessibility', () => {
    render(<ConfirmSignatory />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('header has semantic header element for accessibility', () => {
    render(<ConfirmSignatory />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('navigates to /confirm-details when Back button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmSignatory />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });

    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/confirm-details');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('card has rounded corners and backdrop blur', () => {
    const { container } = render(<ConfirmSignatory />);
    const card = container.querySelector('.rounded-2xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('backdrop-blur-sm');
  });

  it('buttons are in a flex container with gap', () => {
    render(<ConfirmSignatory />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const nextButton = screen.getByRole('button', { name: t.nextButton });

    expect(backButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('Back button is narrower than Next button', () => {
    render(<ConfirmSignatory />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const nextButton = screen.getByRole('button', { name: t.nextButton });

    expect(backButton).toHaveClass('w-auto');
    expect(nextButton).toHaveClass('w-full');
  });

  it('all text comes from translations', () => {
    render(<ConfirmSignatory />);

    expect(screen.getByText(t.headerText)).toBeInTheDocument();
    expect(screen.getByText(t.addressCountSuffix)).toBeInTheDocument();
    expect(screen.getByText(t.authorityQuestion)).toBeInTheDocument();
    expect(screen.getByText(t.authorityYes)).toBeInTheDocument();
    expect(screen.getByText(t.authorityNo)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });

  it('renders logo in header', () => {
    render(<ConfirmSignatory />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('ContentWrapper centers content with max width', () => {
    const { container } = render(<ConfirmSignatory />);
    const wrapper = container.querySelector('.max-w-\\[600px\\]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('main content area uses column layout without vertical centering', () => {
    render(<ConfirmSignatory />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-col');
    expect(main).not.toHaveClass('items-center');
    expect(main).not.toHaveClass('justify-center');
  });

  it('card expands to fill available vertical space', () => {
    const { container } = render(<ConfirmSignatory />);
    const card = container.querySelector('.rounded-2xl');
    expect(card).toHaveClass('flex-1');
  });

  describe('useMatterDetails hook integration', () => {
    it('renders empty address list when data is undefined', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);

      expect(screen.getByText(/0 addresses/i)).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });

    it('renders empty address list when propertyAddresses array is empty', () => {
      const mockData: MatterDetails = {
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

      render(<ConfirmSignatory />);

      expect(screen.getByText(/0 addresses/i)).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });

    it('displays addresses in scrollable list from propertyAddresses data', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: 'Greater London',
            postcode: 'SW1A 1AA',
          },
          {
            addressLine1: '456 Oak Ave',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'Manchester',
            county: 'Greater Manchester',
            postcode: 'M1 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);

      expect(
        screen.getByText('123 Main St, Apt 4B, London, Greater London, SW1A 1AA')
      ).toBeInTheDocument();
      expect(
        screen.getByText('456 Oak Ave, Manchester, Greater Manchester, M1 1AA')
      ).toBeInTheDocument();
    });

    it('formats addresses correctly with all fields', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '100 Test Rd',
            addressLine2: 'Suite 200',
            addressLine3: 'Floor 3',
            addressLine4: 'Building A',
            town: 'Birmingham',
            county: 'West Midlands',
            postcode: 'B1 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);

      expect(
        screen.getByText(
          '100 Test Rd, Suite 200, Floor 3, Building A, Birmingham, West Midlands, B1 1AA'
        )
      ).toBeInTheDocument();
    });

    it('formats addresses correctly with minimal fields', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '789 Pine Rd',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'Leeds',
            county: null,
            postcode: 'LS1 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);

      expect(screen.getByText('789 Pine Rd, Leeds, LS1 1AA')).toBeInTheDocument();
    });
  });

  describe('loading and error states', () => {
    it('renders correctly when isLoading is true', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      render(<ConfirmSignatory />);
      const heading = screen.getByRole('heading', { name: t.headerText });
      expect(heading).toBeInTheDocument();
    });

    it('renders correctly when error is present', () => {
      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
      });

      render(<ConfirmSignatory />);
      const heading = screen.getByRole('heading', { name: t.headerText });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('address count display', () => {
    it('displays singular "address" when count is 1', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '123 Main St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);
      expect(screen.getByText(/1 address/i)).toBeInTheDocument();
    });

    it('displays plural "addresses" when count is 2', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '123 Main St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
          {
            addressLine1: '456 Oak Ave',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'Manchester',
            county: null,
            postcode: 'M1 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);
      expect(screen.getByText(/2 addresses/i)).toBeInTheDocument();
    });

    it('displays plural "addresses" when count is 12', () => {
      const mockAddresses = Array.from({ length: 12 }, (_, i) => ({
        addressLine1: `${i + 20}, Horton Road`,
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        town: 'London',
        county: '',
        postcode: `W12 E2${i + 1}`,
      }));

      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: mockAddresses,
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);
      expect(screen.getByText(/12 addresses/i)).toBeInTheDocument();
    });

    it('displays "0 addresses" when no addresses', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
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

      render(<ConfirmSignatory />);
      expect(screen.getByText(/0 addresses/i)).toBeInTheDocument();
    });
  });

  describe('authority radio group functionality', () => {
    it('renders authority question text', () => {
      render(<ConfirmSignatory />);
      const question = screen.getByText(t.authorityQuestion);
      expect(question).toBeInTheDocument();
    });

    it('renders two authority radio options', () => {
      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);

      expect(screen.getByText(t.authorityYes)).toBeInTheDocument();
      expect(screen.getByText(t.authorityNo)).toBeInTheDocument();
    });

    it('can select Yes authority option', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;

      expect(yesRadio).not.toBeChecked();
      await user.click(yesRadio);
      expect(yesRadio).toBeChecked();
    });

    it('can select No authority option', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      const noRadio = radios[1]!;

      expect(noRadio).not.toBeChecked();
      await user.click(noRadio);
      expect(noRadio).toBeChecked();
    });

    it('can switch between authority options', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;
      const noRadio = radios[1]!;

      await user.click(yesRadio);
      expect(yesRadio).toBeChecked();
      expect(noRadio).not.toBeChecked();

      await user.click(noRadio);
      expect(yesRadio).not.toBeChecked();
      expect(noRadio).toBeChecked();
    });

    it('clicking authority label selects corresponding radio button', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const yesLabel = screen.getByText(t.authorityYes);
      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;

      expect(yesRadio).not.toBeChecked();
      await user.click(yesLabel);
      expect(yesRadio).toBeChecked();
    });
  });

  describe('handleNextClick validation', () => {
    it('shows selectAuthorityError when clicking Preview agreement with no selection', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      const errorMessage = screen.getByText(t.selectAuthorityError);
      expect(errorMessage).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockSign).not.toHaveBeenCalled();
    });

    it('calls sign mutation when Yes authority is selected', async () => {
      const user = userEvent.setup();

      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;

      await user.click(yesRadio);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);

      expect(mockSign).toHaveBeenCalledTimes(1);
      expect(mockSign).toHaveBeenCalledWith({ onSuccess: expect.any(Function) });
    });

    it('redirects to preview-agreement only after sign success callback', async () => {
      const user = userEvent.setup();

      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;

      await user.click(yesRadio);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();

      const onSuccessCallback = mockSign.mock.calls[0]?.[0]?.onSuccess;
      expect(onSuccessCallback).toBeDefined();

      onSuccessCallback?.();

      expect(mockPush).toHaveBeenCalledWith('/preview-agreement');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('shows Next button label when No authority is selected', async () => {
      const user = userEvent.setup();

      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      const noRadio = radios[1]!;

      await user.click(noRadio);

      expect(screen.getByRole('button', { name: t.nextButtonNoAuth })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: t.nextButton })).not.toBeInTheDocument();
    });

    it('navigates to /not-authorized-signatory when No authority is selected', async () => {
      const user = userEvent.setup();

      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      const noRadio = radios[1]!;

      await user.click(noRadio);

      const nextButton = screen.getByRole('button', { name: t.nextButtonNoAuth });
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/not-authorized-signatory');
      expect(mockSign).not.toHaveBeenCalled();
    });

    it('error message clears when selecting an authority option after error', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);

      const errorMessage = screen.getByText(t.selectAuthorityError);
      expect(errorMessage).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]!);

      await user.click(nextButton);

      const errorAfterSelection = screen.queryByText(t.selectAuthorityError);
      expect(errorAfterSelection).not.toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('initializes selectedAuthority as empty string', () => {
      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it('handles multiple propertyAddresses maintaining order in display', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '1 First St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
          {
            addressLine1: '2 Second St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'Manchester',
            county: null,
            postcode: 'M1 1AA',
          },
          {
            addressLine1: '3 Third St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'Birmingham',
            county: null,
            postcode: 'B1 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      render(<ConfirmSignatory />);

      expect(screen.getByText('1 First St, London, SW1A 1AA')).toBeInTheDocument();
      expect(screen.getByText('2 Second St, Manchester, M1 1AA')).toBeInTheDocument();
      expect(screen.getByText('3 Third St, Birmingham, B1 1AA')).toBeInTheDocument();
    });
  });

  describe('address list styling', () => {
    it('renders address list with white background and scrollable container', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '123 Main St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      const { container } = render(<ConfirmSignatory />);
      const addressList = container.querySelector('.bg-white.rounded-xl.max-h-\\[300px\\]');
      expect(addressList).toBeInTheDocument();
      expect(addressList).toHaveClass('overflow-y-auto');
    });
  });

  describe('accessibility features', () => {
    it('Back button has proper aria-label', () => {
      render(<ConfirmSignatory />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toHaveAttribute('aria-label', t.backButtonLabel);
    });

    it('authority radio buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      const yesRadio = radios[0]!;

      yesRadio.focus();
      expect(yesRadio).toHaveFocus();

      await user.keyboard(' ');
      expect(yesRadio).toBeChecked();
    });

    it('Preview agreement button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      nextButton.focus();
      expect(nextButton).toHaveFocus();

      await user.keyboard('{Enter}');

      const errorMessage = screen.getByText(t.selectAuthorityError);
      expect(errorMessage).toBeInTheDocument();
    });

    it('Back button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ConfirmSignatory />);

      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      backButton.focus();
      expect(backButton).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(mockPush).toHaveBeenCalledWith('/confirm-details');
    });
  });

  describe('useMemo optimization', () => {
    it('memoizes addresses and authorityOptions based on data', () => {
      const mockData: MatterDetails = {
        hasSignedMatter: true,
        matterId: 'test-matter-id',
        matterReference: 'REF123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'test-doc-id',
        propertyAddresses: [
          {
            addressLine1: '123 Main St',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            town: 'London',
            county: null,
            postcode: 'SW1A 1AA',
          },
        ],
        signatories: [],
      };

      (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      });

      const { rerender } = render(<ConfirmSignatory />);

      const radiosBefore = screen.getAllByRole('radio');
      expect(radiosBefore).toHaveLength(2);

      rerender(<ConfirmSignatory />);

      const radiosAfter = screen.getAllByRole('radio');
      expect(radiosAfter).toHaveLength(2);
    });
  });

  describe('useReadyToSign integration', () => {
    it('disables all controls while isLoading is true', () => {
      (useReadyToSignModule.useReadyToSign as ReturnType<typeof vi.fn>).mockReturnValue({
        sign: mockSign,
        isLoading: true,
        error: null,
        data: undefined,
      });

      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });

      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toBeDisabled();

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      expect(nextButton).toBeDisabled();
    });

    it('enables all controls when isLoading is false', () => {
      (useReadyToSignModule.useReadyToSign as ReturnType<typeof vi.fn>).mockReturnValue({
        sign: mockSign,
        isLoading: false,
        error: null,
        data: undefined,
      });

      render(<ConfirmSignatory />);

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).not.toBeDisabled();
      });

      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).not.toBeDisabled();

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      expect(nextButton).not.toBeDisabled();
    });

    it('does not call sign when disabled and Next button is clicked', async () => {
      const user = userEvent.setup();
      (useReadyToSignModule.useReadyToSign as ReturnType<typeof vi.fn>).mockReturnValue({
        sign: mockSign,
        isLoading: true,
        error: null,
        data: undefined,
      });

      render(<ConfirmSignatory />);
      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]!);

      const nextButton = screen.getByRole('button', { name: t.nextButton });
      await user.click(nextButton);

      expect(mockSign).not.toHaveBeenCalled();
    });
  });
});
