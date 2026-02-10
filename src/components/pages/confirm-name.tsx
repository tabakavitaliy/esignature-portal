'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Select } from '@/components/common/select';
import { Button } from '@/components/common/button';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ConfirmName component displays the name selection page
 * @returns ReactNode
 */
export function ConfirmName(): ReactNode {
  const { confirmNamePage: t } = translations;

  const handleSelectChange = (value: string): void => {
    // eslint-disable-next-line no-console
    console.log('Select changed:', value);
  };

  const handleBackClick = (): void => {
    // eslint-disable-next-line no-console
    console.log('Back button clicked');
  };

  const handleNextClick = (): void => {
    // eslint-disable-next-line no-console
    console.log('Next button clicked');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header text={t.headerText} />

      <main
        className={cn(
          'flex flex-1 flex-col px-6 py-12',
          'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
        )}
      >
        <ContentWrapper className="flex flex-1 flex-col gap-8">
          <ProgressStepper stepCount={4} currentStep={1} className="self-center" />

          <div
            className={cn(
              'flex-1 rounded-2xl px-8 py-10',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <Select
              label={t.selectLabel}
              placeholder={t.selectPlaceholder}
              options={[]}
              onChange={handleSelectChange}
            />
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
              text={t.nextButton}
              kind="primary"
              iconAfter={<ArrowRight className="h-5 w-5" />}
              onClick={handleNextClick}
            />
          </div>
        </ContentWrapper>
      </main>
    </div>
  );
}
