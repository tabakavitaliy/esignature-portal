import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from './client';

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

    expect(mockFetch).toHaveBeenCalledWith('https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

    expect(mockFetch).toHaveBeenCalledWith('https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/search?q=test&limit=10', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

    expect(mockFetch).toHaveBeenCalledWith('https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
    });
  });

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

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

    expect(mockFetch).toHaveBeenCalledWith('https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/create', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Item' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('handles empty params object', async () => {
    const mockData = { data: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient('/test', { params: {} });

    expect(mockFetch).toHaveBeenCalledWith('https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net/test?', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});
