'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { MainLogo } from '@/components/common/main-logo';
import { Input } from '@/components/common/input';
import translations from '@/i18n/en.json';

/**
 * LoginPage component displays the eSignature credential entry page
 * @returns ReactNode
 */
export function LoginPage(): ReactNode {
  const { loginPage: t } = translations;

  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center px-6 py-12',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <ContentWrapper className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <MainLogo size="regular" />
          <h1 className="text-4xl font-semibold text-white">
            {t.signaturePortal}
          </h1>
          <p className="text-xl text-white/90">{t.poweredBy}</p>
        </header>

        <div
          className={cn(
            'rounded-2xl px-8 py-10',
            'bg-[var(--login-card-bg)] backdrop-blur-sm'
          )}
        >
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-white">
              {t.welcomeMessage}
            </p>

            <p className="text-base leading-relaxed text-white/90">
              {t.credentialHint}
            </p>

            <hr className="mx-auto h-px w-16 border-0 bg-white/30" />

            <Input
              label={t.credentialLabel}
              placeholder={t.credentialPlaceholder}
              type="text"
            />
          </div>
        </div>
      </ContentWrapper>
    </main>
  );
}
