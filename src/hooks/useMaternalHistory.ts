import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

type Encounter = {
  uuid: string;
  display: string;
  links: { uri: string }[];
};

type EncounterResponse = {
  results: Encounter[];
};

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

export const useMaternalHistory = (
  patientUuid: string,
): { prenatalEncounter: ObsEncounter | null; error: any; isLoading: boolean; mutate: () => void } => {
  const atencionPrenatal = 'Control Prenatal';
  const attentionssUrl = useMemo(() => {
    return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${atencionPrenatal}`;
  }, [patientUuid]);

  const { data, error, isValidating, mutate } = useSWR<EncounterResponse>(
    patientUuid ? attentionssUrl : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data;
    },
  );

  const encounterUuids = useMemo(() => {
    if (!data || !data.results) return [];
    return data.results.map((encounter: Encounter) => encounter.uuid);
  }, [data]);

  const {
    data: detailedEncounters,
    error: detailedError,
    isValidating: isValidatingDetails,
  } = useSWRImmutable(
    encounterUuids.length > 0
      ? encounterUuids.map(
          (uuid) =>
            `${restBaseUrl}/encounter/${uuid}?v=custom:(encounterDatetime,form:(uuid,display),obs:(uuid,display))`,
        )
      : null,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    },
  );

  // Get the most recent prenatal encounter
  const mostRecentPrenatalEncounter = useMemo(() => {
    if (!detailedEncounters) return null;

    // Filter encounters with the specific form
    const filteredEncounters = detailedEncounters.filter(
      (encounter) => encounter?.form?.display === 'OBST-001-ANTECEDENTES',
    );

    // Sort encounters by date in descending order (most recent first)
    const sortedEncounters = filteredEncounters.sort((a, b) => {
      const dateA = new Date(a.encounterDatetime);
      const dateB = new Date(b.encounterDatetime);
      return dateB.getTime() - dateA.getTime();
    });

    // Return only the most recent encounter, or null if none exists
    return sortedEncounters.length > 0 ? sortedEncounters[0] : null;
  }, [detailedEncounters]);

  // Extract observation UUIDs from the most recent encounter
  const obsUuids = useMemo(() => {
    if (!mostRecentPrenatalEncounter || !mostRecentPrenatalEncounter.obs) return [];
    return mostRecentPrenatalEncounter.obs.map((obs) => obs.uuid);
  }, [mostRecentPrenatalEncounter]);

  // Fetch group members for each observation
  const {
    data: obsDetails,
    error: obsError,
    isValidating: isValidatingObs,
  } = useSWRImmutable(
    obsUuids.length > 0
      ? obsUuids.map((uuid) => `${restBaseUrl}/obs/${uuid}?v=custom:(uuid,display,groupMembers:(uuid,display))`)
      : null,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    },
  );

  // Combine the encounter with detailed observations
  const prenatalEncounter = useMemo(() => {
    if (!mostRecentPrenatalEncounter) return null;
    if (!obsDetails) return mostRecentPrenatalEncounter;

    // Create a copy of the encounter
    const enhancedEncounter = { ...mostRecentPrenatalEncounter };

    // Replace each observation with its detailed version including group members
    enhancedEncounter.obs = enhancedEncounter.obs.map((obs) => {
      const detailedObs = obsDetails.find((detail) => detail.uuid === obs.uuid);
      return detailedObs || obs;
    });

    return enhancedEncounter;
  }, [mostRecentPrenatalEncounter, obsDetails]);

  // Nueva lógica: loading global
  const isObsLoading = obsUuids.length > 0 && (!obsDetails || obsDetails.length !== obsUuids.length);
  const isLoading = isValidating || isValidatingDetails || isValidatingObs || isObsLoading;

  return {
    prenatalEncounter,
    error: error || detailedError || obsError,
    isLoading,
    mutate,
  };
};
