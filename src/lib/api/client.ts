const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  recaptchaToken?: string;
}

interface ApiClientErrorOptions {
  status?: number;
  isNetworkError?: boolean;
}

export class ApiClientError extends Error {
  status: number | undefined;
  isNetworkError: boolean;

  constructor(message: string, options: ApiClientErrorOptions = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

export function isInvalidCredentialError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  return error.status === 401 || error.status === 403;
}

export function isServiceOutageError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  if (error.isNetworkError) {
    return true;
  }

  return typeof error.status === 'number' && error.status >= 500;
}

/**
 * Makes an HTTP request to the API
 * @param endpoint - API endpoint (relative to base URL)
 * @param options - Fetch options including params
 * @returns Promise with the response data
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, recaptchaToken, ...fetchOptions } = options;
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(recaptchaToken && { 'X-ReCaptcha-Token': recaptchaToken }),
        ...fetchOptions.headers,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    throw new ApiClientError(message, { isNetworkError: true });
  }

  if (!response.ok) {
    throw new ApiClientError(`API Error: ${response.status} ${response.statusText}`, {
      status: response.status,
    });
  }

  return response.json() as Promise<T>;
}

export default apiClient;
