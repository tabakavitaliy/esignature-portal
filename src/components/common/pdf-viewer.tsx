'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import translations from '@/i18n/en.json';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  onFirstPageRenderSuccess?: () => void;
}

/**
 * PDFViewer component for rendering PDF documents
 * This component is dynamically imported to avoid SSR issues
 * @param fileUrl - URL of the PDF file to display
 * @param onFirstPageRenderSuccess - Callback when first page renders
 * @returns ReactNode
 */
export function PDFViewer({ fileUrl, onFirstPageRenderSuccess }: PDFViewerProps): ReactNode {
  const { previewAgreementPage: t } = translations;
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  }, []);

  const setContainerElement = useCallback((node: HTMLDivElement | null): void => {
    if (node) {
      setContainerWidth(node.offsetWidth);
    }
  }, []);

  return (
    <div ref={setContainerElement}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-gray-600">{t.loadingMessage}</p>
          </div>
        }
        error={
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-red-600">{t.errorMessage}</p>
          </div>
        }
      >
        {containerWidth > 0 &&
          Array.from({ length: numPages }, (_, i) => {
            const pageProps = {
              pageNumber: i + 1,
              width: containerWidth,
              renderTextLayer: true,
              renderAnnotationLayer: true,
              ...(i === 0 && { onRenderSuccess: onFirstPageRenderSuccess }),
            };
            return <Page key={`page_${i + 1}`} {...pageProps} />;
          })}
      </Document>
    </div>
  );
}
