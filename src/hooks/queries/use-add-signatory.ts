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

interface UseAddSignatoryReturn {
  addSignatory: (body: UpdateSignatoryBody) => Promise<UpdateSignatoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export function useAddSignatory(): UseAddSignatoryReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateSignatoryResponse, Error, UpdateSignatoryBody>({
    mutationFn: async (body: UpdateSignatoryBody) => {
      const matterId = matterData?.matterId;
      const signatoryId = body.signatory.signatoryId;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      if (!signatoryId) {
        throw new Error('Signatory ID is not available');
      }

      return apiClient<UpdateSignatoryResponse>(
        `/api/lb/matter/${matterId}/signatory/${signatoryId}/updateSignatory`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
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
    addSignatory: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
