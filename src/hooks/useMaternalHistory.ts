import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useConfig } from '@openmrs/esm-framework';
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

export const useMaternalHistory = (
  patientUuid: string,
): { prenatalEncounter: ObsEncounter | null; error: any; isLoading: boolean; mutate: () => void } => {
  const config = useConfig<ConfigObject>();

  const attentionssUrl = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${config.encounterTypes.postnatalControl}&form=${config.formsList.maternalHistory}}&v=custom:(uuid,encounterDatetime,form:(uuid,display),obs:(uuid,display))`;

  const { data, error, isValidating, mutate } = useSWR<EncounterResponse>(
    patientUuid ? attentionssUrl : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data;
    },
  );

  // Obtener el encuentro prenatal más reciente con el formulario específico
  const mostRecentPrenatalEncounter = useMemo(() => {
    if (!data || !data.results) return null;

    const sortedEncounters = [...data.results].sort((a, b) => {
      return new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime();
    });

    return sortedEncounters[0] || null;
  }, [data]);

  // Obtener UUIDs de las observaciones
  const obsUuids = useMemo(() => {
    if (!mostRecentPrenatalEncounter?.obs) return [];
    return mostRecentPrenatalEncounter.obs.map((obs) => obs.uuid);
  }, [mostRecentPrenatalEncounter]);

  // Obtener detalles de las observaciones (incluyendo groupMembers)
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

  // Combinar encuentro con observaciones detalladas
  const prenatalEncounter = useMemo(() => {
    if (!mostRecentPrenatalEncounter) return null;
    if (!obsDetails) return mostRecentPrenatalEncounter;

    return {
      ...mostRecentPrenatalEncounter,
      obs: mostRecentPrenatalEncounter.obs.map((obs) => {
        const detailedObs = obsDetails.find((detail) => detail.uuid === obs.uuid);
        return detailedObs || obs;
      }),
    };
  }, [mostRecentPrenatalEncounter, obsDetails]);

  const isObsLoading = obsUuids.length > 0 && (!obsDetails || obsDetails.length !== obsUuids.length);
  const isLoading = isValidating || isValidatingObs || isObsLoading;

  return {
    prenatalEncounter,
    error: error || obsError,
    isLoading,
    mutate,
  };
};