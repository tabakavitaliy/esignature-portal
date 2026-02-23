import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToken } from './use-token';
import { useMatterDetails, type Signatory } from './use-matter-details';

export interface AddSignatoryBody {
  signatory: Signatory;
}

interface AddSignatoryResponse {
  success: boolean;
}

interface UseAddSignatoryReturn {
  addSignatory: (body: AddSignatoryBody) => Promise<AddSignatoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export function useAddSignatory(): UseAddSignatoryReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();
  const queryClient = useQueryClient();

  const mutation = useMutation<AddSignatoryResponse, Error, AddSignatoryBody>({
    mutationFn: async (body: AddSignatoryBody) => {
      const matterId = matterData?.matterId;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      return apiClient<AddSignatoryResponse>(
        `/api/lb/matter/${matterId}/addSignatory`,
        {
          method: 'POST',
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
