import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PDFViewer } from './pdf-viewer';

let capturedOnLoadSuccess: ((args: { numPages: number }) => void) | undefined;

vi.mock('react-pdf', () => ({
  Document: ({
    children,
    loading,
    onLoadSuccess,
  }: {
    children: React.ReactNode;
    loading: React.ReactNode;
    onLoadSuccess?: (args: { numPages: number }) => void;
  }) => {
    capturedOnLoadSuccess = onLoadSuccess;
    return (
      <div data-testid="pdf-document">
        {loading}
        {children}
      </div>
    );
  },
  Page: ({
    pageNumber,
    onRenderSuccess,
  }: {
    pageNumber: number;
    width?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    onRenderSuccess?: () => void;
  }) => {
    if (onRenderSuccess) {
      setTimeout(onRenderSuccess, 0);
    }
    return <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>;
  },
  pdfjs: {
    version: '5.5.207',
    GlobalWorkerOptions: {
      workerSrc: '',
    },
  },
}));

describe('PDFViewer', () => {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 400,
    });
  });

  afterEach(() => {
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }
  });

  it('renders without crashing', () => {
    render(<PDFViewer fileUrl="https://example.com/test.pdf" />);
    const document = screen.getByTestId('pdf-document');
    expect(document).toBeInTheDocument();
  });

  it('passes fileUrl to Document component', () => {
    render(<PDFViewer fileUrl="https://example.com/test.pdf" />);
    const document = screen.getByTestId('pdf-document');
    expect(document).toBeInTheDocument();
  });

  it('renders loading message initially', () => {
    render(<PDFViewer fileUrl="https://example.com/test.pdf" />);
    const loadingMessage = screen.getByText('Loading document...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('renders pages after onDocumentLoadSuccess fires', () => {
    render(<PDFViewer fileUrl="https://example.com/test.pdf" />);

    act(() => {
      capturedOnLoadSuccess?.({ numPages: 2 });
    });

    expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-page-2')).toBeInTheDocument();
  });

  it('calls onFirstPageRenderSuccess on the first page only', async () => {
    const mockCallback = vi.fn();
    render(
      <PDFViewer fileUrl="https://example.com/test.pdf" onFirstPageRenderSuccess={mockCallback} />
    );

    act(() => {
      capturedOnLoadSuccess?.({ numPages: 2 });
    });

    await vi.waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render pages when container width is 0', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 0,
    });

    render(<PDFViewer fileUrl="https://example.com/test.pdf" />);

    act(() => {
      capturedOnLoadSuccess?.({ numPages: 3 });
    });

    expect(screen.queryByTestId('pdf-page-1')).not.toBeInTheDocument();
  });
});
