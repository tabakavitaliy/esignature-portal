import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiClientError } from '@/lib/api';
import { useToken } from './use-token';
import { useMatterDetails } from './use-matter-details';

export interface PollPreviewDocument {
  documentId: string;
  displayName: string;
  fileName: string;
}

export interface PollPreviewResponse {
  documents: PollPreviewDocument[];
}

interface UsePollPreviewReturn {
  data: PollPreviewResponse | undefined;
  error: Error | null;
  isLoading: boolean;
}

export function usePollPreview(): UsePollPreviewReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();

  const matterId = matterData?.matterId;
  const signatoryId =
    typeof window !== 'undefined' ? sessionStorage.getItem('selectedSignatoryId') : null;

  const { data, error, isLoading } = useQuery<PollPreviewResponse, Error>({
    queryKey: ['pollPreview', matterId, signatoryId],
    queryFn: async () => {
      if (!matterId || !signatoryId) {
        throw new Error('Matter ID or Signatory ID is not available');
      }

      return apiClient<PollPreviewResponse>(
        `/api/lb/matter/${matterId}/signatory/${signatoryId}/pollPreview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    enabled: !!token && !!matterId && !!signatoryId,
    retry: (_, error) => {
      return error instanceof ApiClientError && error.status === 404;
    },
    retryDelay: 2000,
  });

  return {
    data,
    error,
    isLoading,
  };
}
