import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import type { ConfigObject } from '../config-schema';

type Obs = {
  uuid: string;
  display: string;
  groupMembers?: Obs[];
};

type ObsEncounter = {
  uuid: string;
  encounterDatetime: string;
  form: {
    uuid: string;
    display: string;
  };
  obs: Obs[];
};

type EncounterResponse = {
  results: ObsEncounter[];
};

export const useCurrentPregnancy = (
  patientUuid: string,
): { prenatalEncounter: ObsEncounter | null; error: any; isLoading: boolean; mutate: () => void } => {
  const config = useConfig<ConfigObject>();

  // Usar prenatalControl y maternalHistory para todos
  const customRepresentation =
    'custom:(uuid,encounterDatetime,form:(uuid,display),obs:(uuid,display,groupMembers:(uuid,display)))';

  const url = useMemo(() => {
    if (!patientUuid || !config?.encounterTypes?.prenatalControl || !config?.formsList?.currentPregnancy) {
      console.error('Missing required configuration parameters');
      return null;
    }

    const params = new URLSearchParams({
      patient: patientUuid,
      encounterType: config.encounterTypes.prenatalControl,
      v: customRepresentation
    });

    return `${restBaseUrl}/encounter?${params}`;
  }, [patientUuid, config]);

  const fetcher = async (url: string): Promise<EncounterResponse> => {
    const response = await openmrsFetch<EncounterResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<EncounterResponse>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const mostRecentPrenatalEncounter = useMemo(() => {
    try {
      if (!data?.results?.length) return null;

      const validEncounters = data.results.filter(enc =>
        enc?.uuid &&
        enc.encounterDatetime &&
        enc.form?.uuid &&
        Array.isArray(enc.obs)
      );

      return validEncounters.sort((a, b) =>
        new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime()
      )[0] || null;

    } catch (error) {
      console.error('Error processing encounters:', error);
      return null;
    }
  }, [data]);

  return {
    prenatalEncounter: mostRecentPrenatalEncounter,
    error,
    isLoading,
    mutate
  };
};
