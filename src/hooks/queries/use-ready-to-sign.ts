import { useMutation } from '@tanstack/react-query';
import { useToken } from './use-token';
import { useMatterDetails } from './use-matter-details';
import { HttpError } from '@/lib/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net';

interface ReadyToSignResponse {
  success: boolean;
}

interface UseReadyToSignReturn {
  error: Error | null;
  data: ReadyToSignResponse | undefined;
  isLoading: boolean;
  sign: (options?: { onSuccess?: () => void }) => void;
}

export function useReadyToSign(): UseReadyToSignReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();

  const mutation = useMutation<ReadyToSignResponse, Error, void>({
    mutationFn: async () => {
      const matterId = matterData?.matterId;
      const signatoryId =
        typeof window !== 'undefined' ? sessionStorage.getItem('selectedSignatoryId') : null;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      if (!signatoryId) {
        throw new Error('Signatory ID is not available');
      }

      const url = `${API_BASE_URL}/api/lb/matter/${matterId}/signatory/${signatoryId}/readyToSign`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new HttpError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      return response.json() as Promise<ReadyToSignResponse>;
    },
    retry: (_, error) => {
      return error instanceof HttpError && error.status === 404;
    },
    retryDelay: 2000,
  });

  return {
    error: mutation.error,
    data: mutation.data,
    isLoading: mutation.isPending,
    sign: (options?: { onSuccess?: () => void }) => mutation.mutate(undefined, options),
  };
}
