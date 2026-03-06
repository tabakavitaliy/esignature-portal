import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useRecaptcha } from '@/hooks/common/use-recaptcha';
import { useToken } from './use-token';
import { useMatterDetails, type Signatory } from './use-matter-details';

export interface ChangeSignatoryBody {
  signatory: Signatory;
}

interface ChangeSignatoryResponse {
  success: boolean;
}

interface UseChangeSignatoryReturn {
  changeSignatory: (body: ChangeSignatoryBody) => Promise<ChangeSignatoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export function useChangeSignatory(): UseChangeSignatoryReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();
  const { getToken } = useRecaptcha();
  const queryClient = useQueryClient();

  const mutation = useMutation<ChangeSignatoryResponse, Error, ChangeSignatoryBody>({
    mutationFn: async (body: ChangeSignatoryBody) => {
      const matterId = matterData?.matterId;
      const signatoryToChangeId =
        typeof window !== 'undefined' ? sessionStorage.getItem('selectedSignatoryId') : null;

      if (!matterId) {
        throw new Error('Matter ID is not available');
      }

      if (!signatoryToChangeId) {
        throw new Error('Signatory to change ID is not available');
      }

      const recaptchaToken = await getToken('changeSignatory');

      return apiClient<ChangeSignatoryResponse>(
        `/api/lb/matter/${matterId}/signatoryToChange/${signatoryToChangeId}/changeSignatory`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          recaptchaToken,
          body: JSON.stringify(body),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matterDetails'] });
    },
  });

  return {
    changeSignatory: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
