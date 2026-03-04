import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToken } from './use-token';
import { useRecaptcha } from '../common/use-recaptcha';

export interface Address {
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  addressLine4?: string | null;
  town: string | null;
  county: string | null;
  postcode: string | null;
}

export type AddressAssociation = 'Owner' | 'Landlord' | 'LegalTenant';
export type AgreementShareMethod = 'Unspecified';

export interface Signatory {
  signatoryId: string;
  envelopeId: string;
  title: string;
  firstname: string;
  surname: string;
  addressAssociation: AddressAssociation;
  emailAddress: string;
  mobile: string | null;
  agreementShareMethod: AgreementShareMethod;
  correspondenceAddress: Address;
}

export interface MatterDetails {
  hasSignedMatter: boolean;
  matterId: string;
  matterReference: string;
  matterStatus: string;
  privacyPolicyUrl: string;
  matterDocumentId: string;
  propertyAddresses: Address[];
  signatories: Signatory[];
}

interface UseMatterDetailsReturn {
  data: MatterDetails | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
}

export function useMatterDetails(): UseMatterDetailsReturn {
  const { token } = useToken();
  const { getToken } = useRecaptcha();

  const { data, error, isLoading, refetch } = useQuery<MatterDetails, Error>({
    queryKey: ['matterDetails'],
    queryFn: async () => {
      const recaptchaToken = await getToken('matterDetails');

      return apiClient<MatterDetails>('/api/lb/matter/matterDetails', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:3002',
        },
        recaptchaToken,
      });
    },
    enabled: !!token,
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
