import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { useMemo } from 'react';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

type Obs = {
  uuid: string;
  display: string;
  groupMembers?: Obs[];
};

type ObsEncounter = {
  encounterDatetime: string;
  form: {
    uuid: string;
    display: string;
  };
  obs: Obs[];
};

interface MaternalHistoryResult {
  prenatalEncounter: ObsEncounter | null;
  error: any;
  isValidating: boolean;
  mutate: () => Promise<any>;
}

export function useMaternalHistory(patientUuid: string): MaternalHistoryResult {
  const encounterType = 'Control Prenatal';
  const encounterUrl = useMemo(
    () => `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterType}`,
    [patientUuid]
  );

  const { data, error, isValidating, mutate } = useSWR(
    patientUuid ? encounterUrl : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data;
    }
  );

  const encounterUuids = useMemo(
    () => (data?.results ? data.results.map((e: { uuid: string }) => e.uuid) : []),
    [data]
  );

  const { data: detailedEncounters, error: detailedError } = useSWRImmutable(
    encounterUuids.length > 0
      ? encounterUuids.map(
          (uuid) =>
            `${restBaseUrl}/encounter/${uuid}?v=custom:(encounterDatetime,form:(uuid,display),obs:(uuid,display))`
        )
      : null,
    async (urls: string[]) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    }
  );

  const mostRecentEncounter = useMemo(() => {
    if (!detailedEncounters) return null;
    const filtered = detailedEncounters.filter(
      (enc: any) => enc?.form?.display === 'OBST-001-ANTECEDENTES'
    );
    if (!filtered.length) return null;
    return filtered.sort(
      (a: any, b: any) => new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime()
    )[0];
  }, [detailedEncounters]);

  const obsUuids = useMemo(
    () => (mostRecentEncounter?.obs ? mostRecentEncounter.obs.map((obs: Obs) => obs.uuid) : []),
    [mostRecentEncounter]
  );

  const { data: obsDetails, error: obsError } = useSWRImmutable(
    obsUuids.length > 0
      ? obsUuids.map(
          (uuid) =>
            `${restBaseUrl}/obs/${uuid}?v=custom:(uuid,display,groupMembers:(uuid,display))`
        )
      : null,
    async (urls: string[]) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    }
  );

  const prenatalEncounter = useMemo(() => {
    if (!mostRecentEncounter) return null;
    if (!obsDetails) return mostRecentEncounter;
    return {
      ...mostRecentEncounter,
      obs: mostRecentEncounter.obs.map((obs: Obs) => {
        const detail = obsDetails.find((d: Obs) => d.uuid === obs.uuid);
        return detail || obs;
      }),
    };
  }, [mostRecentEncounter, obsDetails]);

  return {
    prenatalEncounter,
    error: error || detailedError || obsError,
    isValidating,
    mutate: async () => {
      await mutate();
    },
  };
}
