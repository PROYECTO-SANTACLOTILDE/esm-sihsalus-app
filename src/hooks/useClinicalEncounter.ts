import useSWR from 'swr';
import type { OpenmrsEncounter } from '../types';
import { openmrsFetch } from '@openmrs/esm-framework';
import { clinicalEncounterRepresentation } from '../utils/constants';
import sortBy from 'lodash/sortBy';

interface UseClinicalEncounterResult {
  encounters: OpenmrsEncounter[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  mutate: () => void;
}

export function useClinicalEncounter(
  encounterTypeUuid: string,
  formUuid: string,
  patientUuid: string,
  conceptUuid: string[],
): UseClinicalEncounterResult {
  const url = `/ws/rest/v1/encounter?formUuid=${formUuid}&patient=${patientUuid}&encounterType=${encounterTypeUuid}&conceptUuid=${conceptUuid.toString()}&v=${clinicalEncounterRepresentation}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: OpenmrsEncounter[] } }, Error>(
    url,
    openmrsFetch,
  );
  const sortedClinicalEncounter = sortBy(data?.data?.results, 'encounterDatetime').reverse();
  return {
    encounters: sortedClinicalEncounter,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
