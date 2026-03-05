import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { usePollPreview, type PollPreviewResponse } from './use-poll-preview';
import * as useTokenModule from './use-token';
import * as useMatterDetailsModule from './use-matter-details';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePollPreview', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-token-123';
  const mockMatterId = 'matter-123';
  const mockSignatoryId = 'signatory-456';

  const mockPollPreviewResponse: PollPreviewResponse = {
    documents: [
      {
        documentId: 'doc-1',
        displayName: 'Document 1',
        fileName: 'document1.pdf',
      },
      {
        documentId: 'doc-2',
        displayName: 'Document 2',
        fileName: 'document2.pdf',
      },
    ],
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();

    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: mockToken,
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });

    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: {
        hasSignedMatter: false,
        matterId: mockMatterId,
        matterReference: 'REF-123',
        matterStatus: 'Active',
        privacyPolicyUrl: 'https://example.com/privacy',
        matterDocumentId: 'doc-123',
        propertyAddresses: [],
        signatories: [],
      },
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(mockSignatoryId),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns loading state initially', () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        })
    );

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns data on successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPollPreviewResponse,
    });

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPollPreviewResponse);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failed fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('API Error');
  });

  it('does not fetch when token is missing', () => {
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: null,
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });

    renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not fetch when matterId is missing', () => {
    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not fetch when signatoryId is missing', () => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('passes correct Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPollPreviewResponse,
    });

    renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  it('calls correct URL with matterId and signatoryId', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPollPreviewResponse,
    });

    renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api/lb/matter/${mockMatterId}/signatory/${mockSignatoryId}/pollPreview`
        ),
        expect.any(Object)
      );
    });
  });

  it('uses correct query key with matterId and signatoryId', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPollPreviewResponse,
    });

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPollPreviewResponse);
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Network error');
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
        json: async () => mockPollPreviewResponse,
      });

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(result.current.data).toEqual(mockPollPreviewResponse);
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

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('500');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 403 error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    const { result } = renderHook(() => usePollPreview(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('403');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
