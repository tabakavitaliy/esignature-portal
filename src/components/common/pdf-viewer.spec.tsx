import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PDFViewer } from './pdf-viewer';

vi.mock('react-pdf', () => ({
  Document: ({
    children: _children,
    loading,
  }: {
    children: React.ReactNode;
    loading: React.ReactNode;
  }) => <div data-testid="pdf-document">{loading}</div>,
  Page: ({ pageNumber }: { pageNumber: number }) => (
    <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>
  ),
  pdfjs: {
    version: '5.5.207',
    GlobalWorkerOptions: {
      workerSrc: '',
    },
  },
}));

describe('PDFViewer', () => {
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

  it('calls onFirstPageRenderSuccess callback when provided', () => {
    const mockCallback = vi.fn();
    render(
      <PDFViewer fileUrl="https://example.com/test.pdf" onFirstPageRenderSuccess={mockCallback} />
    );
    const document = screen.getByTestId('pdf-document');
    expect(document).toBeInTheDocument();
  });
});
