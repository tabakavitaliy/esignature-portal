'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { BackgroundPattern } from '@/components/common/background-pattern';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { Button } from '@/components/common/button';
import { ClockIcon } from '@/icons';
import translations from '@/i18n/en.json';
import { ROUTES } from '@/constants/routes';

/**
 * ExpiredSession page shown when user's session expires due to inactivity.
 * Prompts user to re-enter their credential to log back in.
 * @returns ReactNode
 */
export function ExpiredSession(): ReactNode {
  const { expiredSessionPage: t } = translations;
  const router = useRouter();

  const handleLogin = (): void => {
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

      <main className={cn('flex flex-1 flex-col items-center justify-center px-6 py-12')}>
        <ContentWrapper className="flex flex-col items-center gap-6 text-center">
          <div
            className={cn(
              'w-full rounded-2xl px-8 py-12 flex flex-col items-center justify-center gap-6',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <ClockIcon size={48} stroke={'var(--expired-session-icon-stroke)'} />
            <p className="text-base leading-[22px] font-medium text-white">{t.message}</p>
            <Button text={t.loginButton} onClick={handleLogin} className="max-w-[200px]" />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
