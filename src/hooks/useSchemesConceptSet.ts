import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type OpenmrsConcept } from '../types/fhir-immunization-domain';
import useSWR from 'swr';
import { useMemo } from 'react';

interface VaccinationProgramConfigObject {
  vaccinationProgramConceptSet: string;
  baseUrl?: string;
}

interface ProgramResponse {
  uuid: string;
  display: string;
  concept: OpenmrsConcept;
}

export function useSchemesConceptSet(config: VaccinationProgramConfigObject) {
  const baseUrl = config.baseUrl || restBaseUrl;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<ProgramResponse> } }, Error>(
    `${baseUrl}/program?v=default`,
    (url) => openmrsFetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );

  const vaccinationPrograms = useMemo(() => {
    if (!data?.data.results) {
      return [];
    }

    return data.data.results.map((program) => ({
      uuid: program.uuid,
      display: program.display,
      ...program.concept,
    }));
  }, [data]);

  return {
    vaccinationPrograms,
    isLoading,
    error: error?.message,
  };
}
