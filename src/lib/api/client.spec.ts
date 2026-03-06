import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ApiClientError,
  apiClient,
  isInvalidCredentialError,
  isServiceOutageError,
} from './client';

describe('apiClient', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('makes a successful GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiClient<typeof mockData>('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result).toEqual(mockData);
  });

  it('includes query parameters when provided', async () => {
    const mockData = { results: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/search', {
      params: { q: 'test', limit: '10' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/search?q=test&limit=10',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('merges custom headers with default headers', async () => {
    const mockData = { success: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/test', {
      headers: {
        Authorization: 'Bearer token123',
      },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
      }
    );
  });

  it('throws HttpError when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(apiClient('/not-found')).rejects.toThrow(ApiClientError);
    await expect(apiClient('/not-found')).rejects.toThrow('API Error: 404 Not Found');
  });

  it('passes through fetch options', async () => {
    const mockData = { created: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/create', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Item' }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/create',
      {
        method: 'POST',
        body: JSON.stringify({ name: 'New Item' }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('includes X-ReCaptcha-Token header when recaptchaToken is provided', async () => {
    const mockData = { success: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/test', {
      recaptchaToken: 'test-recaptcha-token',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-ReCaptcha-Token': 'test-recaptcha-token',
        }),
      })
    );
  });

  it('omits X-ReCaptcha-Token header when recaptchaToken is not provided', async () => {
    const mockData = { success: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/test');

    const calledHeaders = mockFetch.mock.calls[0]?.[1]?.headers as
      | Record<string, string>
      | undefined;
    expect(calledHeaders).not.toHaveProperty('X-ReCaptcha-Token');
  });

  it('handles empty params object', async () => {
    const mockData = { data: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/test', { params: {} });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test?',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('marks network errors as service outage', async () => {
    mockFetch.mockRejectedValue(new Error('Network down'));

    await expect(apiClient('/test')).rejects.toSatisfy((error: unknown) => {
      return error instanceof ApiClientError && isServiceOutageError(error);
    });
  });

  it('marks 5xx errors as service outage', () => {
    const error = new ApiClientError('API Error: 503 Service Unavailable', { status: 503 });
    expect(isServiceOutageError(error)).toBe(true);
  });

  it('does not mark 4xx errors as service outage', () => {
    const error = new ApiClientError('API Error: 400 Bad Request', { status: 400 });
    expect(isServiceOutageError(error)).toBe(false);
  });
});

describe('isInvalidCredentialError', () => {
  it('returns true for 401 ApiClientError', () => {
    const error = new ApiClientError('API Error: 401 Unauthorized', { status: 401 });
    expect(isInvalidCredentialError(error)).toBe(true);
  });

  it('returns true for 403 ApiClientError', () => {
    const error = new ApiClientError('API Error: 403 Forbidden', { status: 403 });
    expect(isInvalidCredentialError(error)).toBe(true);
  });

  it('returns false for 404 ApiClientError', () => {
    const error = new ApiClientError('API Error: 404 Not Found', { status: 404 });
    expect(isInvalidCredentialError(error)).toBe(false);
  });

  it('returns false for 5xx ApiClientError', () => {
    const error = new ApiClientError('API Error: 500 Internal Server Error', { status: 500 });
    expect(isInvalidCredentialError(error)).toBe(false);
  });

  it('returns false for non-ApiClientError', () => {
    expect(isInvalidCredentialError(new Error('generic error'))).toBe(false);
    expect(isInvalidCredentialError('string error')).toBe(false);
    expect(isInvalidCredentialError(null)).toBe(false);
  });

  it('returns false for network error (no status)', () => {
    const error = new ApiClientError('Network error', { isNetworkError: true });
    expect(isInvalidCredentialError(error)).toBe(false);
  });
});
