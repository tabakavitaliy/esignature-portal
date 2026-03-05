import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useContinueToSign } from './use-continue-to-sign';
import * as useTokenModule from './use-token';
import * as useMatterDetailsModule from './use-matter-details';
import type { MatterDetails } from './use-matter-details';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useContinueToSign', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-token-123';
  const mockMatterId = 'matter-123';
  const mockSignatoryId = 'signatory-456';
  const mockGetItem = vi.fn();
  const mockSetItem = vi.fn();
  const mockRemoveItem = vi.fn();

  const mockMatterData: MatterDetails = {
    hasSignedMatter: false,
    matterId: mockMatterId,
    matterReference: 'REF123',
    matterStatus: 'Active',
    privacyPolicyUrl: 'https://example.com/privacy',
    matterDocumentId: 'doc-123',
    propertyAddresses: [],
    signatories: [],
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: mockToken,
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });

    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: mockMatterData,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      },
      writable: true,
    });

    mockGetItem.mockReturnValue(mockSignatoryId);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully makes POST request with correct URL and headers', async () => {
    const mockResponse = { success: true };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();

    expect(mockFetch).toHaveBeenCalledWith(
      `https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/api/lb/matter/${mockMatterId}/signatory/${mockSignatoryId}/continueToSign`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('retries on 404 error multiple times', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(result.current.data).toEqual({ success: true });
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 10000 }
    );
  });

  it('surfaces non-404 error immediately without retry', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain('500');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('throws error when matterId is not available', async () => {
    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Matter ID is not available');
    });
  });

  it('throws error when signatoryId is not available', async () => {
    mockGetItem.mockReturnValue(null);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Signatory ID is not available');
    });
  });

  it('passes custom token in Authorization header', async () => {
    const customToken = 'custom-token-789';
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: customToken,
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${customToken}`,
        }),
      })
    );
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });
  });

  it('handles missing token gracefully', async () => {
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: null,
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer null',
        }),
      })
    );
  });

  it('exposes mutation state correctly', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();

    result.current.continueToSign();

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({ success: true });
      expect(result.current.error).toBeNull();
    });
  });

  it('does not retry on 403 error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain('403');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess callback when mutation succeeds', async () => {
    const mockResponse = { success: true };
    const onSuccessMock = vi.fn();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign({ onSuccess: onSuccessMock });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockResponse);
    });

    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onSuccess callback when mutation fails', async () => {
    const onSuccessMock = vi.fn();

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useContinueToSign(), {
      wrapper: createWrapper(),
    });

    result.current.continueToSign({ onSuccess: onSuccessMock });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
