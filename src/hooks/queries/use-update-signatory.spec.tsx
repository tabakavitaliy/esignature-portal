import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useUpdateSignatory, type UpdateSignatoryBody } from './use-update-signatory';
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

describe('useUpdateSignatory', () => {
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

  const mockSignatoryBody: UpdateSignatoryBody = {
    signatory: {
      signatoryId: mockSignatoryId,
      envelopeId: 'envelope-123',
      title: 'Mr',
      firstname: 'John',
      surname: 'Doe',
      addressAssociation: 'Owner',
      emailAddress: 'john.doe@example.com',
      mobile: '07700900000',
      agreementShareMethod: 'Unspecified',
      correspondenceAddress: {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4',
        addressLine3: '',
        addressLine4: '',
        town: 'London',
        county: 'Greater London',
        postcode: 'SW1A 1AA',
      },
    },
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: mockToken,
      setToken: vi.fn(),
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

  it('successfully updates signatory with correct request', async () => {
    const mockResponse = { success: true };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.updateSignatory(mockSignatoryBody);

    expect(response).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/api/lb/matter/${mockMatterId}/signatory/${mockSignatoryId}/updateSignatory`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(mockSignatoryBody),
      })
    );
  });

  it('returns error on failed request', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.updateSignatory(mockSignatoryBody)).rejects.toThrow(
      'API Error: 500 Internal Server Error'
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  it('throws error when matterId is not available', async () => {
    vi.spyOn(useMatterDetailsModule, 'useMatterDetails').mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.updateSignatory(mockSignatoryBody)).rejects.toThrow(
      'Matter ID is not available'
    );
  });

  it('throws error when signatoryId is not available', async () => {
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.updateSignatory(mockSignatoryBody)).rejects.toThrow(
      'Signatory ID is not available'
    );
  });

  it('passes correct Authorization header', async () => {
    const customToken = 'custom-token-789';
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: customToken,
      setToken: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await result.current.updateSignatory(mockSignatoryBody);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${customToken}`,
        }),
      })
    );
  });

  it('invalidates matterDetails query on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const wrapper = ({ children }: { children: ReactNode }): ReactNode => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateSignatory(), { wrapper });

    await result.current.updateSignatory(mockSignatoryBody);

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['matterDetails'] }));
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

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const promise = result.current.updateSignatory(mockSignatoryBody);

    await waitFor(() => expect(result.current.isPending).toBe(true));

    await promise;

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.updateSignatory(mockSignatoryBody)).rejects.toThrow('Network error');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Network error');
    });
  });

  it('handles missing token gracefully', async () => {
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: null,
      setToken: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useUpdateSignatory(), {
      wrapper: createWrapper(),
    });

    await result.current.updateSignatory(mockSignatoryBody);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer null',
        }),
      })
    );
  });
});
