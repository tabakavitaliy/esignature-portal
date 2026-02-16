'use client';

import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Select } from '@/components/common/select';
import { Checkbox } from '@/components/common/checkbox';
import { Button } from '@/components/common/button';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMatterDetails } from '@/hooks/queries/use-matter-details';

/**
 * ConfirmName component displays the name selection page
 * @returns ReactNode
 */
export function ConfirmName(): ReactNode {
const [selectedOption, setSelectedOption] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { confirmNamePage: t } = translations;
  const router = useRouter();
  const { data, isLoading: _isLoading, error: _error } = useMatterDetails();


  const options = useMemo(() => {
    const names = data?.signatories?.map((signatory) => ({
      value: signatory.signatoryId,
      label: `${signatory.firstname} ${signatory.surname}`,
    })) ?? [];
    const noNameExistsOption = {
      value: 'no-name-exists',
      label: t.noNameExistsLabel,
    };
    return [...names, noNameExistsOption]
  }, [data]);

  const handleBackClick = (): void => {
    router.push('/');
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
              options={options}
              value={selectedOption}
              onChange={setSelectedOption}
            />
            {
              !!selectedOption && selectedOption !== 'no-name-exists' && (
                <Checkbox
                label={t.confirmCheckboxLabel}
                value={isConfirmed}
                onChange={setIsConfirmed}
                className="mt-6"
              />
              )
            }
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
