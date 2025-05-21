import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

type ObsEncounter = {
  encounterDatetime: string;
  form: {
    uuid: string;
    display: string;
  };
  obs: Array<{
    uuid: string;
    display: string;
    groupMembers?: Array<{
      uuid: string;
      display: string;
    }>;
  }>;
};

export function useCurrentPregnancy(patientUuid: string) {
  const prenatalEncounterUrl = useMemo(
    () => `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=Control Prenatal`,
    [patientUuid]
  );

  const { data: encounters, error: encountersError, isLoading, mutate } = useSWR(
    patientUuid ? prenatalEncounterUrl : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data?.results || [];
    }
  );

  const mostRecentEncounterId = useMemo(() => {
    if (!encounters?.length) return null;

    const prenatalEncounters = encounters.filter(
      (encounter) => encounter?.form?.display === 'OBST-002-EMBARAZO ACTUAL'
    );

    if (!prenatalEncounters.length) return null;

    return prenatalEncounters.sort((a, b) =>
      new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime()
    )[0].uuid;
  }, [encounters]);

  const { data: encounter, error: encounterError } = useSWRImmutable(
    mostRecentEncounterId
      ? `${restBaseUrl}/encounter/${mostRecentEncounterId}?v=custom:(encounterDatetime,form:(uuid,display),obs:(uuid,display,groupMembers:(uuid,display)))`
      : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data as ObsEncounter;
    }
  );

  return {
    data: encounter,
    isLoading,
    error: encountersError || encounterError,
    mutate: async () => {
      await Promise.resolve(mutate());
    },
  };
}
