import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';
import type { Provider } from '../types';

export function useProviders(): {
  providers: Provider[];
  isLoading: boolean;
  error: Error | undefined;
  isValidating: boolean;
} {
  const apiUrl = `${restBaseUrl}/provider`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Array<Provider> } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  return {
    providers: data ? data.data?.results : [],
    isLoading,
    error,
    isValidating,
  };
}
