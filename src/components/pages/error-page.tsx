'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { MainLogo } from '@/components/common/main-logo';
import { BackgroundPattern } from '@/components/common/background-pattern';
import { Button } from '@/components/common/button';
import { WarningTriangleIcon } from '@/icons';
import translations from '@/i18n/en.json';
import { ROUTES } from '@/constants/routes';
import { ERROR_RETURN_PATH_KEY } from '@/providers/query-provider';

interface ErrorPageProps {
  onRefresh?: () => void;
}

export function ErrorPage({ onRefresh }: ErrorPageProps = {}): ReactNode {
  const { errorPage: t } = translations;
  const router = useRouter();

  const handleRefresh = (): void => {
    if (onRefresh) {
      onRefresh();
      return;
    }

    const returnPath = sessionStorage.getItem(ERROR_RETURN_PATH_KEY) ?? ROUTES.HOME;
    sessionStorage.removeItem(ERROR_RETURN_PATH_KEY);
    router.push(returnPath);
  };

  const handleBackToLogin = (): void => {
    sessionStorage.removeItem(ERROR_RETURN_PATH_KEY);
    router.push(ROUTES.HOME);
  };

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col justify-between overflow-hidden px-6 py-8',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <BackgroundPattern />

      <ContentWrapper className="flex flex-1 flex-col">
        <header className="flex flex-col items-center text-center">
          <MainLogo size="regular" />
          <h1 className="text-base pt-4 font-bold leading-normal text-white">{t.headerText}</h1>
          <p className="text-xs pt-[5px] font-normal leading-normal text-white/80">{t.subtitle}</p>
        </header>

        <section
          className={cn(
            'mt-6 rounded-2xl px-4 py-6 text-center',
            'bg-[var(--login-card-bg)] backdrop-blur-sm'
          )}
        >
          <div className="flex items-center justify-center">
            <WarningTriangleIcon />
          </div>
          <h2 className="mt-4 text-[32px] font-bold leading-normal text-white">{t.heading}</h2>
          <p className="mt-2 text-sm font-normal leading-5 text-white/90">{t.messageLine1}</p>
          <p className="mt-3 text-sm font-normal leading-5 text-white/90">{t.messageLine2}</p>
        </section>
      </ContentWrapper>

      <ContentWrapper className="flex flex-col gap-4 pb-2">
        <Button
          text={t.refreshButton}
          onClick={handleRefresh}
          iconBefore={<RefreshCw className="h-4 w-4" />}
        />
        <Button text={t.backToLoginButton} kind="secondary" onClick={handleBackToLogin} />
      </ContentWrapper>
    </main>
  );
}
