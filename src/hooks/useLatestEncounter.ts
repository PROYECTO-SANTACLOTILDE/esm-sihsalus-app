import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export const useLatestEncounter = (patientUuid, encounterTypeUuid) => {
  const url = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=full&_sort=-encounterDatetime&_count=1`;
  const { data, isLoading, error, mutate } = useSWR(url, openmrsFetch);
  return {
    encounter: data?.data?.[0],
    isLoading,
    error,
    mutate,
  };
};