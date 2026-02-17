import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { LoginPage } from '@/components/pages';

export default function HomePage(): ReactNode {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
