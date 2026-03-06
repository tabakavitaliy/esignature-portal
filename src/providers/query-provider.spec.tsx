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

  it('redirects to outage page when query/mutation error is a network outage', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('Network error', { isNetworkError: true }),
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToOutage).toHaveBeenCalledTimes(1);
    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
  });

  it('redirects to outage page when error is a 5xx API failure', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 503 Service Unavailable', { status: 503 }),
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToOutage).toHaveBeenCalledTimes(1);
    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
  });

  it('redirects to invalid credential page on 401 error', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 401 Unauthorized', { status: 401 }),
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).toHaveBeenCalledTimes(1);
    expect(redirectToOutage).not.toHaveBeenCalled();
  });

  it('redirects to invalid credential page on 403 error', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 403 Forbidden', { status: 403 }),
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).toHaveBeenCalledTimes(1);
    expect(redirectToOutage).not.toHaveBeenCalled();
  });

  it('does not redirect when error is a non-credential 4xx API failure', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 400 Bad Request', { status: 400 }),
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
    expect(redirectToOutage).not.toHaveBeenCalled();
  });

  it('does not redirect when already on error page', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 503 Service Unavailable', { status: 503 }),
      ROUTES.ERROR_PAGE,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
    expect(redirectToOutage).not.toHaveBeenCalled();
  });

  it('does not redirect when already on invalid credential page', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      new ApiClientError('API Error: 401 Unauthorized', { status: 401 }),
      ROUTES.INVALID_CREDENTIAL,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
    expect(redirectToOutage).not.toHaveBeenCalled();
  });

  it('saves return path to sessionStorage before redirecting to outage page', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();
    sessionStorage.clear();

    handleGlobalRequestError(
      new ApiClientError('Network error', { isNetworkError: true }),
      '/confirm-name',
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(sessionStorage.getItem(ERROR_RETURN_PATH_KEY)).toBe('/confirm-name');
    expect(redirectToOutage).toHaveBeenCalledTimes(1);
  });

  it('does not save return path to sessionStorage for invalid credential errors', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();
    sessionStorage.clear();

    handleGlobalRequestError(
      new ApiClientError('API Error: 401 Unauthorized', { status: 401 }),
      '/confirm-name',
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(sessionStorage.getItem(ERROR_RETURN_PATH_KEY)).toBeNull();
    expect(redirectToInvalidCredential).toHaveBeenCalledTimes(1);
  });

  it('does not redirect for non-Error objects', () => {
    const redirectToInvalidCredential = vi.fn();
    const redirectToOutage = vi.fn();

    handleGlobalRequestError(
      'plain string error',
      ROUTES.CONFIRM_NAME,
      redirectToInvalidCredential,
      redirectToOutage
    );

    expect(redirectToInvalidCredential).not.toHaveBeenCalled();
    expect(redirectToOutage).not.toHaveBeenCalled();
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

  it('queryCache.onError redirects to invalid credential page on 401', async () => {
    function FailingQuery(): null {
      useQuery({
        queryKey: ['cache-test-401'],
        queryFn: (): Promise<never> => Promise.reject(new ApiClientError('fail', { status: 401 })),
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
      expect(assignSpy).toHaveBeenCalledWith(ROUTES.INVALID_CREDENTIAL);
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

  it('mutationCache.onError redirects to invalid credential page on 403', async () => {
    const user = userEvent.setup();

    function TriggerMutation(): React.ReactElement {
      const { mutate } = useMutation({
        mutationFn: (): Promise<never> =>
          Promise.reject(new ApiClientError('fail', { status: 403 })),
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
      expect(assignSpy).toHaveBeenCalledWith(ROUTES.INVALID_CREDENTIAL);
    });
  });
});
