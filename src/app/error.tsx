'use client';

import type { ReactNode } from 'react';
import { ErrorPage } from '@/components/pages/error-page';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error: _error, reset }: GlobalErrorProps): ReactNode {
  return (
    <html lang="en">
      <body>
        <ErrorPage onRefresh={reset} />
      </body>
    </html>
  );
}
