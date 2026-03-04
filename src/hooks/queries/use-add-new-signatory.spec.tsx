import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useAddNewSignatory, type AddNewSignatoryBody } from './use-add-new-signatory';
import * as useTokenModule from './use-token';
import * as useMatterDetailsModule from './use-matter-details';
import type { MatterDetails } from './use-matter-details';

const mockGetToken = vi.fn();
vi.mock('@/hooks/common/use-recaptcha', () => ({
  useRecaptcha: () => ({ getToken: mockGetToken }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAddNewSignatory', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-token-123';
  const mockMatterId = 'matter-123';
  const mockRecaptchaToken = 'mock-recaptcha-token';

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

  const mockAddNewSignatoryBody: AddNewSignatoryBody = {
    signatory: {
      signatoryId: 'signatory-456',
      envelopeId: 'envelope-123',
      title: 'Mr',
      firstname: 'Jane',
      surname: 'Smith',
      addressAssociation: 'Owner',
      emailAddress: 'jane.smith@example.com',
      mobile: '07700900001',
      agreementShareMethod: 'Unspecified',
      correspondenceAddress: {
        addressLine1: '456 High St',
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        town: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M1 1AA',
      },
    },
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
    mockGetToken.mockClear();
    mockGetToken.mockResolvedValue(mockRecaptchaToken);

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully adds new signatory with correct POST request', async () => {
    const mockResponse = { success: true };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.addNewSignatory(mockAddNewSignatoryBody);

    expect(response).toEqual(mockResponse);
    expect(mockGetToken).toHaveBeenCalledWith('addSignatory');
    expect(mockFetch).toHaveBeenCalledWith(
      `https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/api/lb/matter/${mockMatterId}/addSignatory`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
          'X-ReCaptcha-Token': mockRecaptchaToken,
        }),
        body: JSON.stringify(mockAddNewSignatoryBody),
      })
    );
  });

  it('blocks request and throws when reCAPTCHA token generation fails (fail-closed)', async () => {
    mockGetToken.mockRejectedValue(new Error('reCAPTCHA Enterprise script has not loaded yet.'));

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.addNewSignatory(mockAddNewSignatoryBody)).rejects.toThrow(
      'reCAPTCHA Enterprise script has not loaded yet.'
    );

    expect(mockFetch).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('returns error on failed request', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.addNewSignatory(mockAddNewSignatoryBody)).rejects.toThrow(
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

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.addNewSignatory(mockAddNewSignatoryBody)).rejects.toThrow(
      'Matter ID is not available'
    );
  });

  it('passes correct Authorization header', async () => {
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

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await result.current.addNewSignatory(mockAddNewSignatoryBody);

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

    const { result } = renderHook(() => useAddNewSignatory(), { wrapper });

    await result.current.addNewSignatory(mockAddNewSignatoryBody);

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['matterDetails'] })
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

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const promise = result.current.addNewSignatory(mockAddNewSignatoryBody);

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

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.addNewSignatory(mockAddNewSignatoryBody)).rejects.toThrow(
      'Network error'
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
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

    const { result } = renderHook(() => useAddNewSignatory(), {
      wrapper: createWrapper(),
    });

    await result.current.addNewSignatory(mockAddNewSignatoryBody);

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
