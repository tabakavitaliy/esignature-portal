'use client';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { ROUTES } from '@/constants/routes';
import { isInvalidCredentialError, isServiceOutageError } from '@/lib/api';

interface QueryProviderProps {
  children: ReactNode;
}

export const ERROR_RETURN_PATH_KEY = 'errorReturnPath';

export function handleGlobalRequestError(
  error: unknown,
  pathname: string,
  redirectToInvalidCredential: () => void,
  redirectToOutage: () => void
): void {
  // Prevent redirect loops if the user is already on one of the error pages.
  if (pathname === ROUTES.ERROR_PAGE || pathname === ROUTES.INVALID_CREDENTIAL) {
    return;
  }

  if (isInvalidCredentialError(error)) {
    redirectToInvalidCredential();
    return;
  }

  if (isServiceOutageError(error)) {
    // Remember where the user was so Refresh can return them there.
    sessionStorage.setItem(ERROR_RETURN_PATH_KEY, pathname);
    redirectToOutage();
  }
}

/**
 * TanStack Query Provider
 *
 * Wraps the application with QueryClientProvider for data fetching
 * Includes ReactQueryDevtools in development mode
 */
export function QueryProvider({ children }: QueryProviderProps): ReactNode {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (typeof window === 'undefined') {
              return;
            }

            handleGlobalRequestError(
              error,
              window.location.pathname,
              () => {
                window.location.assign(ROUTES.INVALID_CREDENTIAL);
              },
              () => {
                window.location.assign(ROUTES.ERROR_PAGE);
              }
            );
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (typeof window === 'undefined') {
              return;
            }

            handleGlobalRequestError(
              error,
              window.location.pathname,
              () => {
                window.location.assign(ROUTES.INVALID_CREDENTIAL);
              },
              () => {
                window.location.assign(ROUTES.ERROR_PAGE);
              }
            );
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
