import { useEffect, useCallback } from 'react';
import { restBaseUrl, openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import sortBy from 'lodash/sortBy';
import type { ConfigObject } from '../config-schema';
import type { ObsRecord } from '@openmrs/esm-patient-common-lib';

const swrKeyNeedle = Symbol('prenatalAntecedents');

const prenatalAntecedentsRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),diagnoses:(uuid,diagnosis:(coded:(display))),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

export function usePrenatalAntecedents(patientUuid: string, formUuid: string) {
  const url = `${restBaseUrl}/encounter?patient=${patientUuid}&form=${formUuid}&v=${prenatalAntecedentsRepresentation}`;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: any[] } }, Error>(url, openmrsFetch);

  const sortedAntecedents = sortBy(data?.data?.results, 'encounterDatetime').reverse();

  useEffect(() => {
    prenatalAntecedentsMutates.set(patientUuid, mutate as KeyedMutator<any>);
    return () => {
      prenatalAntecedentsMutates.delete(patientUuid);
    };
  }, [mutate, patientUuid]);

  return {
    antecedentsData: sortedAntecedents,
    isLoading,
    error,
    mutate,
  };
}

export function usePrenatalConceptMetadata() {
  const { concepts } = useConfig<ConfigObject>();
  const prenatalConceptSetUuid = concepts.prenatalConceptSetUuid;

  const customRepresentation =
    'custom:(setMembers:(uuid,display,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units))';

  const apiUrl = `${restBaseUrl}/concept/${prenatalConceptSetUuid}?v=${customRepresentation}`;
  const { data, error, isLoading } = useSWRImmutable<{ data: { setMembers: any[] } }, Error>(apiUrl, openmrsFetch);

  const conceptMetadata = data?.data?.setMembers;

  return {
    data: conceptMetadata,
    error,
    isLoading,
  };
}

export function savePrenatalAntecedents(
  encounterTypeUuid: string,
  formUuid: string,
  concepts: ConfigObject['concepts'],
  patientUuid: string,
  antecedents: Record<string, any>,
  abortController: AbortController,
  location: string,
) {
  return openmrsFetch(`${restBaseUrl}/encounter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: JSON.stringify({
      patient: patientUuid,
      location,
      encounterType: encounterTypeUuid,
      form: formUuid,
      obs: createObsObject(antecedents, concepts),
    }),
  });
}

export function updatePrenatalAntecedents(
  concepts: ConfigObject['concepts'],
  patientUuid: string,
  antecedents: Record<string, any>,
  encounterDatetime: Date,
  abortController: AbortController,
  encounterUuid: string,
  location: string,
) {
  return openmrsFetch(`${restBaseUrl}/encounter/${encounterUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: JSON.stringify({
      encounterDatetime,
      location,
      patient: patientUuid,
      obs: createObsObject(antecedents, concepts),
      orders: [],
    }),
  });
}

function createObsObject(
  antecedents: Record<string, any>,
  concepts: ConfigObject['concepts'],
): Array<Omit<ObsRecord, 'effectiveDateTime' | 'conceptClass' | 'encounter'>> {
  return Object.entries(antecedents)
    .filter(([_, value]) => Boolean(value))
    .map(([name, value]) => ({
      concept: concepts[name + 'Uuid'],
      value: value.toString(),
    }));
}

const prenatalAntecedentsMutates = new Map<string, KeyedMutator<any>>();

export async function invalidateCachedPrenatalAntecedents(patientUuid: string) {
  const mutate = prenatalAntecedentsMutates.get(patientUuid);
  if (mutate) {
    await mutate();
  }
}
