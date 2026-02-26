import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToken } from './use-token';
import { useMatterDetails, type Signatory } from './use-matter-details';

export interface AddNewSignatoryBody {
  signatory: Signatory;
}

interface AddNewSignatoryResponse {
  success: boolean;
}

interface UseAddNewSignatoryReturn {
  addNewSignatory: (body: AddNewSignatoryBody) => Promise<AddNewSignatoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export function useAddNewSignatory(): UseAddNewSignatoryReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();
  const queryClient = useQueryClient();

  const mutation = useMutation<AddNewSignatoryResponse, Error, AddNewSignatoryBody>({
    mutationFn: async (body: AddNewSignatoryBody) => {
      const matterId = matterData?.matterId;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      return apiClient<AddNewSignatoryResponse>(
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
    addNewSignatory: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
