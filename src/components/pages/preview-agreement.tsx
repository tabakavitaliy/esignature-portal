'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Button } from '@/components/common/button';
import { BackgroundPattern } from '@/components/common/background-pattern';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { DocumentSection } from '@/components/common/document-section';
import { usePollPreview } from '@/hooks/queries/use-poll-preview';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

/**
 * PreviewAgreement component displays the agreement preview page
 * @returns ReactNode
 */
export function PreviewAgreement(): ReactNode {
  const { previewAgreementPage: t } = translations;
  const router = useRouter();
  const { data, isLoading, error } = usePollPreview();

  const handleBackClick = (): void => {
    router.push(ROUTES.CONFIRM_SIGNATORY);
  };

  const handleSignClick = (): void => {
    // No-op for now
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <BackgroundPattern />
      <Header text={t.headerText} />

      <main className={cn('flex flex-1 flex-col px-6 py-12')}>
        <ContentWrapper className="flex flex-1 flex-col gap-8">
          <ProgressStepper stepCount={4} currentStep={4} className="self-center" />

          <div className={cn('flex-1 flex flex-col gap-6')}>
            {isLoading && (
              <div className="rounded-xl bg-white p-6">
                <p className="text-center text-sm text-gray-600">{t.loadingMessage}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-white p-6">
                <p className="text-center text-sm text-red-600">{t.errorMessage}</p>
              </div>
            )}

            {!isLoading && !error && data?.documents && data.documents.length > 0 && (
              <>
                {data.documents.map((doc) => (
                  <DocumentSection
                    key={doc.documentId}
                    documentTitle={doc.displayName}
                    documentId={doc.documentId}
                  />
                ))}
              </>
            )}

            {!isLoading && !error && (!data?.documents || data.documents.length === 0) && (
              <div className="rounded-xl bg-white p-6">
                <p className="text-center text-sm text-gray-600">No documents available</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              text=""
              kind="secondary"
              iconBefore={<ArrowLeft className="h-5 w-5" />}
              onClick={handleBackClick}
              aria-label={t.backButtonLabel}
              className="w-auto px-6"
            />
            <Button
              text={t.signButton}
              kind="primary"
              iconAfter={<ArrowRight className="h-5 w-5" />}
              onClick={handleSignClick}
            />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
