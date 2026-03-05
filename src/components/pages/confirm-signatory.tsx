'use client';

import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { RadioGroup } from '@/components/common/radio-group';
import { Button } from '@/components/common/button';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMatterDetails } from '@/hooks/queries/use-matter-details';
import { useReadyToSign } from '@/hooks/queries/use-ready-to-sign';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import type { Address } from '@/hooks/queries/use-matter-details';
import { ROUTES } from '@/constants/routes';

/**
 * Formats an address object into a human-readable string
 * @param address - Address object
 * @returns Formatted address string
 */
function formatAddress(address: Address): string {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.addressLine3,
    address.addressLine4,
    address.town,
    address.county,
    address.postcode,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * ConfirmSignatory component displays the authority confirmation page
 * @returns ReactNode
 */
export function ConfirmSignatory(): ReactNode {
  const [selectedAuthority, setSelectedAuthority] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { confirmSignatoryPage: t } = translations;
  const router = useRouter();
  const { data, isLoading: _isLoading, error: _error } = useMatterDetails();
  const { sign, isLoading } = useReadyToSign();

  const addresses = useMemo(() => {
    return data?.propertyAddresses?.map((address) => formatAddress(address)) ?? [];
  }, [data]);

  const addressCount = addresses.length;
  const addressCountText = addressCount === 1 ? t.addressCountSingular : t.addressCountPlural;

  const authorityOptions = useMemo(
    () => [
      { value: 'yes', label: t.authorityYes },
      { value: 'no', label: t.authorityNo },
    ],
    [t]
  );

  const handleBackClick = (): void => {
    router.push(ROUTES.CONFIRM_DETAILS);
  };

  const handleNextClick = (): void => {
    setErrorMessage('');

    if (selectedAuthority === '') {
      setErrorMessage(t.selectAuthorityError);
      return;
    }

    if (selectedAuthority === 'yes') {
      sign({ onSuccess: () => router.push(ROUTES.PREVIEW_AGREEMENT) });
    } else {
      router.push(ROUTES.NOT_AUTHORIZED_SIGNATORY);
    }
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
          <ProgressStepper stepCount={4} currentStep={3} className="self-center" />

          <div
            className={cn(
              'flex-1 rounded-2xl px-8 py-10',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <p className="text-sm text-white mb-6">
              <strong>
                {addressCount} {addressCountText}
              </strong>{' '}
              {t.addressCountSuffix}
            </p>

            <div className={cn('bg-white rounded-xl max-h-[300px] overflow-y-auto mb-6', 'p-6')}>
              {addresses.map((address, index) => (
                <div key={index}>
                  <p className="text-sm text-[#1a1a1a]">{address}</p>
                  {index < addresses.length - 1 && <div className="h-px bg-gray-200 my-4 -mx-6" />}
                </div>
              ))}
            </div>

            <p className="text-sm text-white mb-6">{t.authorityQuestion}</p>

            <RadioGroup
              label=""
              options={authorityOptions}
              value={selectedAuthority}
              onChange={setSelectedAuthority}
              disabled={isLoading}
            />
          </div>

          {errorMessage && <ButtonErrorLabel message={errorMessage} />}

          <div className="flex gap-4">
            <Button
              text=""
              kind="secondary"
              iconBefore={<ArrowLeft className="h-5 w-5" />}
              onClick={handleBackClick}
              aria-label={t.backButtonLabel}
              className="w-auto px-6"
              disabled={isLoading}
            />
            <Button
              text={selectedAuthority === 'no' ? t.nextButtonNoAuth : t.nextButton}
              kind="primary"
              iconAfter={<ArrowRight className="h-5 w-5" />}
              onClick={handleNextClick}
              disabled={isLoading}
            />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
