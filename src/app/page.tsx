import type { ReactNode } from 'react';

export default function HomePage(): ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">eSignature Portal</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome to the eSignature Portal. Start building your document signing application.
        </p>
      </div>
    </main>
  );
}
