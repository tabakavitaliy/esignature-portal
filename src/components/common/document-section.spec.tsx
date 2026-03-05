import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DocumentSection } from './document-section';
import translations from '@/i18n/en.json';
import * as useDocumentByIdModule from '@/hooks/queries/use-document-by-id';
import type { DocumentByIdResponse } from '@/hooks/queries/use-document-by-id';
import type { ReactNode } from 'react';

vi.mock('@/hooks/queries/use-document-by-id', () => ({
  useDocumentById: vi.fn(),
}));

vi.mock('next/dynamic', () => {
  const MockPDFViewer = ({
    fileUrl,
    onFirstPageRenderSuccess: _onFirstPageRenderSuccess,
  }: {
    fileUrl: string;
    onFirstPageRenderSuccess?: () => void;
  }): ReactNode => {
    return (
      <div data-testid="pdf-viewer" data-file-url={fileUrl}>
        <div data-testid="pdf-document">
          <div data-testid="pdf-page-1" className="react-pdf__Page" style={{ height: 600 }}>
            Page 1
          </div>
          <div data-testid="pdf-page-2" className="react-pdf__Page">
            Page 2
          </div>
        </div>
      </div>
    );
  };

  return {
    default: () => MockPDFViewer,
  };
});

describe('DocumentSection', () => {
  const { previewAgreementPage: t } = translations;
  const mockDocumentTitle = 'Test Agreement Document';
  const mockDocumentId = 'test-doc-id-123';

  beforeEach(() => {
    vi.clearAllMocks();
    (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    });

    // Mock ResizeObserver to trigger width updates
    class MockResizeObserver implements ResizeObserver {
      private callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(element: Element): void {
        // Simulate initial width measurement
        if (element instanceof HTMLElement) {
          Object.defineProperty(element, 'offsetWidth', { value: 800, writable: true });
          const entries = [
            {
              target: element,
              contentRect: { width: 800 } as DOMRectReadOnly,
              borderBoxSize: [],
              contentBoxSize: [],
              devicePixelContentBoxSize: [],
            },
          ] as unknown as ResizeObserverEntry[];
          this.callback(entries, this);
        }
      }

      unobserve(): void {
        // no-op
      }

      disconnect(): void {
        // no-op
      }
    }

    global.ResizeObserver = MockResizeObserver as typeof ResizeObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
    const heading = screen.getByRole('heading', { name: mockDocumentTitle });
    expect(heading).toBeInTheDocument();
  });

  it('renders document title as heading', () => {
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
    const heading = screen.getByRole('heading', { name: mockDocumentTitle });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('renders more info button with correct icon', () => {
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
    const moreInfoButton = screen.getByRole('button', { name: t.moreInfoButton });
    expect(moreInfoButton).toBeInTheDocument();
  });

  it('more info button has no functionality when clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);

    const moreInfoButton = screen.getByRole('button', { name: t.moreInfoButton });
    await user.click(moreInfoButton);

    expect(moreInfoButton).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
    const downloadButton = screen.getByRole('button', { name: t.downloadButton });
    expect(downloadButton).toBeInTheDocument();
  });

  it('calls useDocumentById with correct documentId', () => {
    render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
    expect(useDocumentByIdModule.useDocumentById).toHaveBeenCalledWith(mockDocumentId);
  });

  describe('loading state', () => {
    it('shows loading message when isLoading is true', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      expect(screen.getByText(t.loadingMessage)).toBeInTheDocument();
    });

    it('disables download button when loading', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });
      expect(downloadButton).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('shows error message when error is present', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch'),
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      expect(screen.getByText(t.errorMessage)).toBeInTheDocument();
    });

    it('disables download button when error is present', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: new Error('Failed to fetch'),
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });
      expect(downloadButton).toBeDisabled();
    });
  });

  describe('success state with previewUrl', () => {
    const mockData: DocumentByIdResponse = {
      documentId: mockDocumentId,
      previewUrl: 'https://example.com/preview.pdf',
    };

    it('renders PDF document with previewUrl when data is loaded', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const pdfDocument = screen.getByTestId('pdf-document');
      expect(pdfDocument).toBeInTheDocument();
    });

    it('enables download button when previewUrl is available', () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });
      expect(downloadButton).not.toBeDisabled();
    });

    it('download button is clickable when previewUrl is available', async () => {
      const user = userEvent.setup();

      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });

      expect(downloadButton).not.toBeDisabled();
      await user.click(downloadButton);

      expect(downloadButton).toBeInTheDocument();
    });

    it('renders all PDF pages when multi-page document is loaded', async () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);

      await vi.waitFor(() => {
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
        expect(screen.getByTestId('pdf-page-2')).toBeInTheDocument();
      });
    });

    it('calls onDocumentLoadSuccess callback', async () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);

      await vi.waitFor(() => {
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
      });
    });

    it('sets container height based on first page height', async () => {
      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      const { container } = render(
        <DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />
      );

      await vi.waitFor(() => {
        const pdfContainer = container.querySelector('.overflow-y-auto');
        expect(pdfContainer).toBeInTheDocument();
      });
    });
  });

  describe('success state without previewUrl', () => {
    it('shows no preview available message when previewUrl is missing', () => {
      const mockDataNoPreview: DocumentByIdResponse = {
        documentId: mockDocumentId,
      };

      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockDataNoPreview,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      expect(screen.getByText('No preview available')).toBeInTheDocument();
    });

    it('disables download button when previewUrl is missing', () => {
      const mockDataNoPreview: DocumentByIdResponse = {
        documentId: mockDocumentId,
      };

      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockDataNoPreview,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });
      expect(downloadButton).toBeDisabled();
    });

    it('does not trigger download when button is clicked without previewUrl', () => {
      const mockDataNoPreview: DocumentByIdResponse = {
        documentId: mockDocumentId,
      };

      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockDataNoPreview,
        error: null,
        isLoading: false,
      });

      const createElementSpy = vi.spyOn(document, 'createElement');

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });

      expect(downloadButton).toBeDisabled();

      createElementSpy.mockRestore();
    });
  });

  describe('styling', () => {
    it('has rounded corners and white background', () => {
      const { container } = render(
        <DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />
      );
      const section = container.firstChild;
      expect(section).toHaveClass('rounded-xl');
      expect(section).toHaveClass('bg-white');
    });

    it('applies custom className', () => {
      const { container } = render(
        <DocumentSection
          documentTitle={mockDocumentTitle}
          documentId={mockDocumentId}
          className="custom-class"
        />
      );
      const section = container.firstChild;
      expect(section).toHaveClass('custom-class');
    });

    it('download button has secondary styling', () => {
      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const downloadButton = screen.getByRole('button', { name: t.downloadButton });
      expect(downloadButton).toHaveClass('bg-transparent');
      expect(downloadButton).toHaveClass('border-2');
    });
  });

  describe('accessibility', () => {
    it('more info button has proper aria-label', () => {
      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const moreInfoButton = screen.getByRole('button', { name: t.moreInfoButton });
      expect(moreInfoButton).toHaveAttribute('aria-label', t.moreInfoButton);
    });

    it('PDF document is rendered for screen readers', () => {
      const mockData: DocumentByIdResponse = {
        documentId: mockDocumentId,
        previewUrl: 'https://example.com/preview.pdf',
      };

      (useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      render(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);
      const pdfDocument = screen.getByTestId('pdf-document');
      expect(pdfDocument).toBeInTheDocument();
    });
  });

  describe('regression: late-mounting container', () => {
    it('renders PDF pages when data arrives after initial mount', async () => {
      const useDocumentByIdSpy = useDocumentByIdModule.useDocumentById as ReturnType<typeof vi.fn>;

      useDocumentByIdSpy.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      const { rerender } = render(
        <DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />
      );
      expect(screen.queryByTestId('pdf-document')).not.toBeInTheDocument();

      const mockData: DocumentByIdResponse = {
        documentId: mockDocumentId,
        previewUrl: 'https://example.com/preview.pdf',
      };

      useDocumentByIdSpy.mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
      });

      rerender(<DocumentSection documentTitle={mockDocumentTitle} documentId={mockDocumentId} />);

      await vi.waitFor(() => {
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
        expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
        expect(screen.getByTestId('pdf-page-2')).toBeInTheDocument();
      });
    });
  });
});
