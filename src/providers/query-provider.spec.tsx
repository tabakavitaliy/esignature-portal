import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiClientError } from '@/lib/api';
import { ROUTES } from '@/constants/routes';
import { QueryProvider, handleGlobalRequestError, ERROR_RETURN_PATH_KEY } from './query-provider';

describe('QueryProvider', () => {
  it('renders children correctly', () => {
    render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('wraps children with QueryClientProvider', () => {
    const { container } = render(
      <QueryProvider>
        <div data-testid="child">Content</div>
      </QueryProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('renders multiple children', () => {
    render(
      <QueryProvider>
        <div>First Child</div>
        <div>Second Child</div>
      </QueryProvider>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('redirects when query/mutation error is a network outage', () => {
    const redirect = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('Network error', { isNetworkError: true }),
      ROUTES.CONFIRM_NAME,
      redirect
    );

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('redirects when error is a 5xx API failure', () => {
    const redirect = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 503 Service Unavailable', { status: 503 }),
      ROUTES.CONFIRM_NAME,
      redirect
    );

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('does not redirect when error is a 4xx API failure', () => {
    const redirect = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 400 Bad Request', { status: 400 }),
      ROUTES.CONFIRM_NAME,
      redirect
    );

    expect(redirect).not.toHaveBeenCalled();
  });

  it('does not redirect when already on error page', () => {
    const redirect = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 503 Service Unavailable', { status: 503 }),
      ROUTES.ERROR_PAGE,
      redirect
    );

    expect(redirect).not.toHaveBeenCalled();
  });

  it('saves return path to sessionStorage before redirecting', () => {
    const redirect = vi.fn();
    sessionStorage.clear();

    handleGlobalRequestError(
      new ApiClientError('Network error', { isNetworkError: true }),
      '/confirm-name',
      redirect
    );

    expect(sessionStorage.getItem(ERROR_RETURN_PATH_KEY)).toBe('/confirm-name');
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('does not redirect for non-Error objects', () => {
    const redirect = vi.fn();

    handleGlobalRequestError('plain string error', ROUTES.CONFIRM_NAME, redirect);

    expect(redirect).not.toHaveBeenCalled();
  });
});

describe('QueryProvider cache onError wiring', () => {
  let assignSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignSpy, pathname: '/confirm-name' },
      writable: true,
      configurable: true,
    });
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('queryCache.onError redirects to error page on outage error', async () => {
    function FailingQuery(): null {
      useQuery({
        queryKey: ['cache-test-query'],
        queryFn: (): Promise<never> =>
          Promise.reject(new ApiClientError('fail', { isNetworkError: true })),
        retry: false,
      });
      return null;
    }

    render(
      <QueryProvider>
        <FailingQuery />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(ROUTES.ERROR_PAGE);
    });
  });

  it('mutationCache.onError redirects to error page on outage error', async () => {
    const user = userEvent.setup();

    function TriggerMutation(): React.ReactElement {
      const { mutate } = useMutation({
        mutationFn: (): Promise<never> =>
          Promise.reject(new ApiClientError('fail', { isNetworkError: true })),
      });
      return <button onClick={() => mutate()}>trigger</button>;
    }

    render(
      <QueryProvider>
        <TriggerMutation />
      </QueryProvider>
    );

    await user.click(screen.getByRole('button', { name: 'trigger' }));

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(ROUTES.ERROR_PAGE);
    });
  });
});
