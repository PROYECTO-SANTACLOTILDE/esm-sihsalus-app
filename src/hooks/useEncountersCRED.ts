import useSWR from 'swr';
import { useConfig, restBaseUrl, openmrsFetch, formatDate } from '@openmrs/esm-framework';
import type { Encounter } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';

export interface CredEncounter {
  id: string;
  title: string;
  date: string;
  type: 'CRED' | 'Complementaria';
}

export default function useEncountersCRED(patientUuid: string) {
  const config = useConfig() as ConfigObject;

  const encounterUrl = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${config.encounterTypes.healthyChildControl}&v=custom:(uuid,encounterType,encounterDatetime)`;

  const { data, error, isLoading } = useSWR<{ data: { results: Encounter[] } }>(encounterUrl, openmrsFetch);

  const encounters: CredEncounter[] =
    data?.data?.results?.map((encounter) => ({
      id: encounter.uuid,
      title: encounter.encounterType?.name ?? '',
      date: formatDate(new Date(encounter.encounterDatetime ?? '')),
      type: encounter.encounterType?.name?.includes('CRED') ? 'CRED' : 'Complementaria',
    })) || [];

  return {
    encounters,
    isLoading,
    error,
  };
}
