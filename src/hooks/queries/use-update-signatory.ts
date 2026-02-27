import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToken } from './use-token';
import { useMatterDetails, type Signatory } from './use-matter-details';

export interface UpdateSignatoryBody {
  signatory: Signatory;
}

interface UpdateSignatoryResponse {
  success: boolean;
}

interface UseUpdateSignatoryReturn {
  updateSignatory: (body: UpdateSignatoryBody) => Promise<UpdateSignatoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export function useUpdateSignatory(): UseUpdateSignatoryReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateSignatoryResponse, Error, UpdateSignatoryBody>({
    mutationFn: async (body: UpdateSignatoryBody) => {
      const matterId = matterData?.matterId;
      const signatoryId = typeof window !== 'undefined' 
        ? sessionStorage.getItem('selectedSignatoryId')
        : null;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      if (!signatoryId) {
        throw new Error('Signatory ID is not available');
      }

      return apiClient<UpdateSignatoryResponse>(
        `/api/lb/matter/${matterId}/signatoryToChange/${signatoryId}/changeSignatory`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matterDetails'] });
    },
  });

  return {
    updateSignatory: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
