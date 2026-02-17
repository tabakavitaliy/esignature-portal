'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMatterDetails } from '@/hooks/queries/use-matter-details';
import translations from '@/i18n/en.json';

interface CustomerPrivacyProps {
  className?: string;
}

/**
 * CustomerPrivacy component displays a link to the customer privacy notice
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function CustomerPrivacy({ className }: CustomerPrivacyProps): ReactNode {
  const { data } = useMatterDetails();
  const { customerPrivacy: t } = translations;

  if (!data?.privacyPolicyUrl) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-[34px] w-full items-center justify-center',
        'bg-[var(--login-card-bg)] backdrop-blur-sm',
        className
      )}
    >
      <a
        href={data.privacyPolicyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[hsl(var(--privacy-notice-text))] hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        aria-label={t.linkText}
      >
        {t.linkText}
      </a>
    </div>
  );
}
