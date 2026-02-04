/**
 * API Client Configuration
 *
 * This module provides the base API client setup for making HTTP requests.
 * Configure the base URL and common headers here.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Makes an HTTP request to the API
 * @param endpoint - API endpoint (relative to base URL)
 * @param options - Fetch options including params
 * @returns Promise with the response data
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export default apiClient;
