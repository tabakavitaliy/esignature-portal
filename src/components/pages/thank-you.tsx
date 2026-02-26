'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { BackgroundPattern } from '@/components/common/background-pattern';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { CheckCircleIcon } from '@/icons';
import translations from '@/i18n/en.json';

/**
 * ThankYou page shown after successfully submitting an authorised signatory's details.
 * Informs the user that an email has been sent to the authorised party.
 * @returns ReactNode
 */
export function ThankYou(): ReactNode {
  const { thankYouPage: t } = translations;

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <BackgroundPattern />
      <Header text={t.headerText} subtitle={t.subtitle} />

      <main className={cn('flex flex-1 flex-col items-center justify-center px-6 py-12')}>
        <ContentWrapper className="flex flex-col items-center gap-6 text-center">
          <div
            className={cn(
              'w-full rounded-2xl px-8 py-12 flex flex-col items-center justify-center',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <CheckCircleIcon size={44} />
            <h2 className="text-base leading-[22px] font-medium text-white my-4">{t.heading}</h2>
            <p className="text-base leading-[22px] font-medium text-white">{t.body}</p>
            <p className="text-base leading-[22px] font-medium text-white">{t.closeWindowText}</p>
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
