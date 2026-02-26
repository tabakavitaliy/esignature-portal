'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/common/button';
import { ArrowLeft } from 'lucide-react';

interface SignatoryFormActionsProps {
  backButtonLabel: string;
  submitButtonText: string;
  onBackClick: () => void;
  onSubmitClick: () => void | Promise<void>;
  isPending?: boolean;
  dataHandlingText?: string;
}

export function SignatoryFormActions({
  backButtonLabel,
  submitButtonText,
  onBackClick,
  onSubmitClick,
  isPending = false,
  dataHandlingText,
}: SignatoryFormActionsProps): ReactNode {
  return (
    <>
      <div className="flex gap-4">
        <Button
          text=""
          kind="secondary"
          iconBefore={<ArrowLeft className="h-5 w-5" />}
          onClick={onBackClick}
          aria-label={backButtonLabel}
          className="w-auto px-6"
        />
        <Button
          text={submitButtonText}
          kind="primary"
          onClick={onSubmitClick}
          disabled={isPending}
        />
      </div>

      {dataHandlingText && (
        <p className="text-xs text-center text-white/80 pt-4">
          {dataHandlingText}
        </p>
      )}
    </>
  );
}
