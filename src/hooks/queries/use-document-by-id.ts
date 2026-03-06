import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useToken } from './use-token';
import { useMatterDetails } from './use-matter-details';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://lb-signatureapi-dev-cbcbc8dxf4gpevfa.westeurope-01.azurewebsites.net';

export interface DocumentByIdResponse {
  documentId: string;
  previewUrl?: string;
}

interface UseDocumentByIdReturn {
  data: DocumentByIdResponse | undefined;
  error: Error | null;
  isLoading: boolean;
}

export function useDocumentById(documentId: string | undefined): UseDocumentByIdReturn {
  const { token } = useToken();
  const { data: matterData } = useMatterDetails();

  const matterId = matterData?.matterId;

  const { data, error, isLoading } = useQuery<DocumentByIdResponse, Error>({
    queryKey: ['documentById', matterId, documentId],
    queryFn: async () => {
      if (!matterId || !documentId) {
        throw new Error('Matter ID or Document ID is not available');
      }

      const url = `${API_BASE_URL}/api/lb/matter/${matterId}/document/${documentId}/getPreviewDocument`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      return {
        documentId,
        previewUrl: objectUrl,
      };
    },
    enabled: !!token && !!matterId && !!documentId,
  });

  useEffect(() => {
    return () => {
      if (data?.previewUrl) {
        URL.revokeObjectURL(data.previewUrl);
      }
    };
  }, [data?.previewUrl]);

  return {
    data,
    error,
    isLoading,
  };
}
