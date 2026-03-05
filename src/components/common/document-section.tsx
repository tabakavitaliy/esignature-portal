'use client';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { MoreInfoIcon } from '@/icons/more-info-icon';
import { useDocumentById } from '@/hooks/queries/use-document-by-id';
import translations from '@/i18n/en.json';
import { Download } from 'lucide-react';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentSectionProps {
  documentTitle: string;
  documentId: string;
  className?: string;
}

/**
 * DocumentSection component displays a document preview with download functionality
 * @param documentTitle - Document display name (required)
 * @param documentId - Document ID to fetch (required)
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function DocumentSection({
  documentTitle,
  documentId,
  className,
}: DocumentSectionProps): ReactNode {
  const { data, error, isLoading } = useDocumentById(documentId);
  const { previewAgreementPage: t } = translations;

  const [numPages, setNumPages] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Callback ref to measure container width when it mounts
  const setContainerElement = useCallback((node: HTMLDivElement | null): void => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    containerRef.current = node;
    
    if (node) {
      setContainerWidth(node.offsetWidth);
      observerRef.current = new ResizeObserver(() => {
        if (node) {
          setContainerWidth(node.offsetWidth);
        }
      });
      observerRef.current.observe(node);
    } else {
      setContainerWidth(0);
    }
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  }, []);

  const onFirstPageRenderSuccess = useCallback((): void => {
    if (containerRef.current) {
      const pageElement = containerRef.current.querySelector('.react-pdf__Page');
      if (pageElement) {
        setPageHeight(pageElement.clientHeight);
      }
    }
  }, []);

  const handleDownload = (): void => {
    if (!data?.previewUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = data.previewUrl;
    link.download = documentTitle || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn('rounded-xl bg-white p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">{documentTitle}</h2>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A238C] hover:bg-[#3A238C]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A238C] focus-visible:ring-offset-2 transition-all duration-200"
          aria-label={t.moreInfoButton}
        >
          <MoreInfoIcon size={13} />
        </button>
      </div>

      {isLoading && (
        <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-100">
          <p className="text-sm text-gray-600">{t.loadingMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex h-[400px] items-center justify-center rounded-lg bg-red-50">
          <p className="text-sm text-red-600">{t.errorMessage}</p>
        </div>
      )}

      {!isLoading && !error && data?.previewUrl && (
        <div
          ref={setContainerElement}
          className="mb-4 rounded-lg border border-gray-200 overflow-y-auto"
          style={{ maxHeight: pageHeight > 0 ? `${pageHeight}px` : '600px' }}
        >
          <Document
            file={data.previewUrl}
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
      )}

      {!isLoading && !error && !data?.previewUrl && (
        <div className="mb-4 flex h-[400px] items-center justify-center rounded-lg bg-gray-100">
          <p className="text-sm text-gray-600">No preview available</p>
        </div>
      )}

      <Button
        text={t.downloadButton}
        kind="secondary"
        iconBefore={<Download className="h-5 w-5" />}
        onClick={handleDownload}
        disabled={isLoading || !data?.previewUrl}
        className="w-full"
      />
    </div>
  );
}
