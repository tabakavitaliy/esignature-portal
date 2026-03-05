import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useDocumentById } from './use-document-by-id';
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

describe('useDocumentById', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-token-123';
  const mockMatterId = 'matter-123';
  const mockDocumentId = 'document-456';
  const mockObjectUrl = 'blob:http://localhost:3000/mock-object-url';
  const mockCreateObjectURL = vi.fn();
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    vi.clearAllMocks();

    mockCreateObjectURL.mockReturnValue(mockObjectUrl);

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

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns data on successful fetch', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({
      documentId: mockDocumentId,
      previewUrl: mockObjectUrl,
    });
    expect(result.current.error).toBeNull();
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it('returns error on failed fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
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

    renderHook(() => useDocumentById(mockDocumentId), {
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

    renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not fetch when documentId is missing', () => {
    renderHook(() => useDocumentById(undefined), {
      wrapper: createWrapper(),
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('passes correct Authorization header', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    renderHook(() => useDocumentById(mockDocumentId), {
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

  it('calls correct URL with matterId and documentId', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api/lb/matter/${mockMatterId}/document/${mockDocumentId}/getPreviewDocument`
        ),
        expect.any(Object)
      );
    });
  });

  it('uses correct query key with matterId and documentId', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({
      documentId: mockDocumentId,
      previewUrl: mockObjectUrl,
    });
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Network error');
  });

  it('caches data based on matterId and documentId', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    const { result, rerender } = renderHook(
      ({ docId }) => useDocumentById(docId),
      {
        wrapper: createWrapper(),
        initialProps: { docId: mockDocumentId },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.documentId).toEqual(mockDocumentId);
    expect(result.current.data?.previewUrl).toEqual(mockObjectUrl);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Re-render with same documentId should use cache
    rerender({ docId: mockDocumentId });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Re-render with different documentId should trigger new fetch
    const mockBlob2 = new Blob(['mock-pdf-data-2'], { type: 'application/pdf' });
    const mockObjectUrl2 = 'blob:http://localhost:3000/mock-object-url-2';
    mockCreateObjectURL.mockReturnValueOnce(mockObjectUrl2);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob2,
    });

    rerender({ docId: 'document-789' });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('revokes object URL on cleanup', async () => {
    const mockBlob = new Blob(['mock-pdf-data'], { type: 'application/pdf' });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    });

    const { result, unmount } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.previewUrl).toEqual(mockObjectUrl);

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockObjectUrl);
  });

  it('handles blob conversion errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => {
        throw new Error('Failed to convert to blob');
      },
    });

    const { result } = renderHook(() => useDocumentById(mockDocumentId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to convert to blob');
  });
});
