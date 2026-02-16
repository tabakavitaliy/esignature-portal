import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useMatterDetails, type MatterDetails } from './use-matter-details';
import * as useTokenModule from './use-token';

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

describe('useMatterDetails', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-token-123';

  beforeEach(() => {
    global.fetch = mockFetch;
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: mockToken,
      setToken: vi.fn(),
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on successful fetch', async () => {
    const mockData: MatterDetails = {
      hasSignedMatter: true,
      matterId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      matterReference: 'REF123',
      matterStatus: 'Active',
      privacyPolicyUrl: 'https://example.com/privacy',
      matterDocumentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      propertyAddresses: [
        {
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4',
          addressLine3: '',
          addressLine4: '',
          town: 'London',
          county: 'Greater London',
          postcode: 'SW1A 1AA',
        },
      ],
      signatories: [
        {
          signatoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          envelopeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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
      ],
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMatterDetails(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failed fetch', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useMatterDetails(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('API Error: 500');
  });

  it('shows loading state initially', () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({}),
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useMatterDetails(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('does not fetch when token is null', async () => {
    vi.spyOn(useTokenModule, 'useToken').mockReturnValue({
      token: null,
      setToken: vi.fn(),
    });

    const { result } = renderHook(() => useMatterDetails(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('passes correct Authorization header', async () => {
    const mockData: MatterDetails = {
      hasSignedMatter: false,
      matterId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      matterReference: 'REF456',
      matterStatus: 'Pending',
      privacyPolicyUrl: 'https://example.com/privacy',
      matterDocumentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      propertyAddresses: [],
      signatories: [],
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMatterDetails(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/api/lb/matter/matterDetails',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        }),
      })
    );
  });
});
