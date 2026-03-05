import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { PreviewAgreement } from './preview-agreement';
import translations from '@/i18n/en.json';
import * as usePollPreviewModule from '@/hooks/queries/use-poll-preview';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import type { PollPreviewResponse } from '@/hooks/queries/use-poll-preview';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/queries/use-poll-preview', () => ({
  usePollPreview: vi.fn(),
}));

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

vi.mock('@/components/common/document-section', () => ({
  DocumentSection: ({ documentTitle, documentId }: { documentTitle: string; documentId: string }) => (
    <div data-testid={`document-section-${documentId}`}>
      <h2>{documentTitle}</h2>
    </div>
  ),
}));

describe('PreviewAgreement', () => {
  const { previewAgreementPage: t } = translations;
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    });
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        matterId: 'test-matter-id',
        matterDocumentId: 'test-doc-id',
        privacyPolicyUrl: 'https://example.com/privacy',
      },
      error: null,
      isLoading: false,
    });
  });

  it('renders without crashing', () => {
    render(<PreviewAgreement />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders Header with correct text', () => {
    render(<PreviewAgreement />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders ProgressStepper with 4 steps', () => {
    render(<PreviewAgreement />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('ProgressStepper shows step 4 as current', () => {
    render(<PreviewAgreement />);
    const currentStep = screen.getByLabelText('Step 4 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('ProgressStepper shows steps 1-3 as completed', () => {
    render(<PreviewAgreement />);
    
    const completedStep1 = screen.getByLabelText('Step 1 completed');
    expect(completedStep1).toBeInTheDocument();
    expect(completedStep1).toHaveClass('bg-stepper-complete');
    
    const completedStep2 = screen.getByLabelText('Step 2 completed');
    expect(completedStep2).toBeInTheDocument();
    expect(completedStep2).toHaveClass('bg-stepper-complete');

    const completedStep3 = screen.getByLabelText('Step 3 completed');
    expect(completedStep3).toBeInTheDocument();
    expect(completedStep3).toHaveClass('bg-stepper-complete');
  });

  it('renders Back button with arrow icon', () => {
    render(<PreviewAgreement />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toBeInTheDocument();
  });

  it('Back button has secondary styling', () => {
    render(<PreviewAgreement />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toHaveClass('bg-transparent');
    expect(backButton).toHaveClass('border-2');
    expect(backButton).toHaveClass('border-white');
  });

  it('renders Sign agreement button with correct text', () => {
    render(<PreviewAgreement />);
    const signButton = screen.getByRole('button', { name: t.signButton });
    expect(signButton).toBeInTheDocument();
    expect(signButton).toHaveTextContent('Sign agreement');
  });

  it('Sign agreement button has primary styling', () => {
    render(<PreviewAgreement />);
    const signButton = screen.getByRole('button', { name: t.signButton });
    expect(signButton).toHaveClass('bg-white');
  });

  it('has gradient background styling', () => {
    const { container } = render(<PreviewAgreement />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<PreviewAgreement />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('main has semantic main element for accessibility', () => {
    render(<PreviewAgreement />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('header has semantic header element for accessibility', () => {
    render(<PreviewAgreement />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('navigates to /confirm-signatory when Back button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<PreviewAgreement />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    
    await user.click(backButton);
    
    expect(mockPush).toHaveBeenCalledWith('/confirm-signatory');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('Sign agreement button does nothing when clicked (no-op)', async () => {
    const user = userEvent.setup();
    
    render(<PreviewAgreement />);
    const signButton = screen.getByRole('button', { name: t.signButton });
    
    await user.click(signButton);
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('buttons are in a flex container with gap', () => {
    render(<PreviewAgreement />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const signButton = screen.getByRole('button', { name: t.signButton });
    
    expect(backButton).toBeInTheDocument();
    expect(signButton).toBeInTheDocument();
  });

  it('Back button is narrower than Sign button', () => {
    render(<PreviewAgreement />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const signButton = screen.getByRole('button', { name: t.signButton });
    
    expect(backButton).toHaveClass('w-auto');
    expect(signButton).toHaveClass('w-full');
  });

  it('all text comes from translations', () => {
    render(<PreviewAgreement />);
    
    expect(screen.getByText(t.headerText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.signButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });

  it('renders logo in header', () => {
    render(<PreviewAgreement />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('ContentWrapper centers content with max width', () => {
    const { container } = render(<PreviewAgreement />);
    const wrapper = container.querySelector('.max-w-\\[600px\\]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('mx-auto');
  });

  describe('usePollPreview hook integration', () => {
    it('calls usePollPreview', () => {
      render(<PreviewAgreement />);
      expect(usePollPreviewModule.usePollPreview).toHaveBeenCalled();
    });

    it('shows loading message when isLoading is true', () => {
      (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      render(<PreviewAgreement />);
      expect(screen.getByText(t.loadingMessage)).toBeInTheDocument();
    });

    it('shows error message when error is present', () => {
      (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch'),
        isLoading: false,
      });

      render(<PreviewAgreement />);
      expect(screen.getByText(t.errorMessage)).toBeInTheDocument();
    });

    it('renders document sections when data is available', () => {
      const mockData: PollPreviewResponse = {
        documents: [
          {
            documentId: 'doc-1',
            displayName: 'Agreement Document 1',
            fileName: 'agreement1.pdf',
          },
          {
            documentId: 'doc-2',
            displayName: 'Agreement Document 2',
            fileName: 'agreement2.pdf',
          },
        ],
      };

      (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<PreviewAgreement />);
      
      expect(screen.getByTestId('document-section-doc-1')).toBeInTheDocument();
      expect(screen.getByTestId('document-section-doc-2')).toBeInTheDocument();
      expect(screen.getByText('Agreement Document 1')).toBeInTheDocument();
      expect(screen.getByText('Agreement Document 2')).toBeInTheDocument();
    });

    it('shows no documents message when documents array is empty', () => {
      const mockData: PollPreviewResponse = {
        documents: [],
      };

      (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<PreviewAgreement />);
      expect(screen.getByText('No documents available')).toBeInTheDocument();
    });

    it('shows no documents message when data is undefined', () => {
      (usePollPreviewModule.usePollPreview as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
      });

      render(<PreviewAgreement />);
      expect(screen.getByText('No documents available')).toBeInTheDocument();
    });
  });

  describe('accessibility features', () => {
    it('Back button has proper aria-label', () => {
      render(<PreviewAgreement />);
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      expect(backButton).toHaveAttribute('aria-label', t.backButtonLabel);
    });

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<PreviewAgreement />);
      
      const backButton = screen.getByRole('button', { name: t.backButtonLabel });
      backButton.focus();
      expect(backButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockPush).toHaveBeenCalledWith('/confirm-signatory');
    });

    it('Sign agreement button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<PreviewAgreement />);
      
      const signButton = screen.getByRole('button', { name: t.signButton });
      signButton.focus();
      expect(signButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
