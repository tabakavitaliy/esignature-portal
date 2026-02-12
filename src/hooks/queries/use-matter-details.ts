import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToken } from './use-token';

export interface Address {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  town: string;
  county: string;
  postcode: string;
}

export type AddressAssociation = 'Owner';
export type AgreementShareMethod = 'Unspecified';

export interface Signatory {
  signatoryId: string;
  envelopeId: string;
  title: string;
  firstname: string;
  surname: string;
  addressAssociation: AddressAssociation;
  emailAddress: string;
  mobile: string;
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
}

export function useMatterDetails(): UseMatterDetailsReturn {
  const { token } = useToken();

  const { data, error, isLoading } = useQuery<MatterDetails, Error>({
    queryKey: ['matterDetails'],
    queryFn: async () => {
      return apiClient<MatterDetails>('/api/lb/matter/matterDetails', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:3002'
        },
      });
    },
    enabled: !!token,
  });

  return {
    data,
    error,
    isLoading,
  };
}
