import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers';
import { InactivityProvider } from '@/components/common/inactivity-provider';
import { ConsentMode } from '@/components/common/consent-mode';
import { OneTrust } from '@/components/common/one-trust';
import { GA4 } from '@/components/common/ga4';
import { PageTracker } from '@/components/common/page-tracker';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'eSignature Portal',
  description: 'Document signing application',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ConsentMode />
        <OneTrust />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <InactivityProvider>
            {children}
          </InactivityProvider>
        </QueryProvider>
        <GA4 />
        <PageTracker />
      </body>
    </html>
  );
}
