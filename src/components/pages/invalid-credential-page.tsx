'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { BackgroundPattern } from '@/components/common/background-pattern';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/common/button';
import translations from '@/i18n/en.json';
import { ROUTES } from '@/constants/routes';

/**
 * InvalidCredentialPage is displayed when the API rejects the user's credential
 * (401 – not found / 403 – expired or already responded to).
 * "Back" returns to the credential entry screen keeping the stored token so the
 * user can correct the value; "Close" wipes the session entirely.
 */
export function InvalidCredentialPage(): ReactNode {
  const { invalidCredentialPage: t } = translations;
  const router = useRouter();

  const handleBack = (): void => {
    router.push(ROUTES.HOME);
  };

  const handleClose = (): void => {
    sessionStorage.clear();
    router.push(ROUTES.HOME);
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <BackgroundPattern />
      <Header text={t.headerText} subtitle={t.subtitle} />

      <main className="flex flex-1 flex-col px-6 py-8">
        <div className="flex flex-1 items-center">
          <ContentWrapper>
            <section
              className={cn(
                'rounded-2xl px-4 py-8 text-center',
                'bg-[var(--login-card-bg)] backdrop-blur-sm'
              )}
            >
              <div className="flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
              <p className="mt-4 text-base font-medium leading-5 text-white/90">{t.messageLine1}</p>
              <p className="mt-4 text-base font-medium leading-5 text-white/90">{t.messageLine2}</p>
            </section>
          </ContentWrapper>
        </div>

        <ContentWrapper className="flex flex-col gap-4 pb-2">
          <Button text={t.backButton} kind="secondary" onClick={handleBack} />
          <Button text={t.closeButton} onClick={handleClose} />
        </ContentWrapper>
      </main>
    </div>
  );
}
