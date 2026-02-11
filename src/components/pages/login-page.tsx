'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { MainLogo } from '@/components/common/main-logo';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { Recaptcha } from '@/components/common/recaptcha';
import translations from '@/i18n/en.json';
import { ArrowRight } from 'lucide-react';

/**
 * LoginPage component displays the eSignature credential entry page
 * @returns ReactNode
 */
export function LoginPage(): ReactNode {
  const { loginPage: t } = translations;
  const router = useRouter();
  const [credential, setCredential] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const handleNextClick = (): void => {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const isValid = pattern?.test(credential);
    setIsInvalid(!isValid);
    if (isValid) {
      router.push('/confirm-name');
    }
  };

  return (
    <main
      className={cn(
        'flex min-h-screen flex-col justify-between px-6 py-12',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <ContentWrapper className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <MainLogo size="regular" />
          <h1 className="text-base font-semibold text-white">
            {t.signaturePortal}
          </h1>
          <p className="text-xs text-white/90">{t.poweredBy}</p>
        </header>

        <div
          className={cn(
            'rounded-2xl px-8 py-10',
            'bg-[var(--login-card-bg)] backdrop-blur-sm'
          )}
        >
          <div className="flex flex-col gap-6">
            <p className="text-sm leading-relaxed text-white">
              {t.welcomeMessage}
            </p>

            <p className="text-sm leading-relaxed text-white/90">
              {t.credentialHint}
            </p>

            <hr className="mx-auto h-px w-[24px] border-0 bg-white/30" />

            <Input
              label={t.credentialLabel}
              placeholder={t.credentialPlaceholder}
              type="text"
              mask="****-****-****-****"
              value={credential}
              onChange={setCredential}
            />
          </div>
        </div>

        <Recaptcha />
      </ContentWrapper>

      <ContentWrapper>
        <Button
          text={t.nextButton}
          iconAfter={<ArrowRight className="h-5 w-5" />}
          onClick={handleNextClick}
        />
      </ContentWrapper>
    </main>
  );
}
