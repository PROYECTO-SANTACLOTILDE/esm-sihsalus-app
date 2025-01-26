import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getPatientUuidFromStore } from '@openmrs/esm-patient-common-lib';

interface ActiveProgramsConfigObject {
  vaccinationProgramConceptSet: string;
  baseUrl?: string;
}

interface ProgramResponse {
  uuid: string;
  display: string;
}

export function useActivePrograms(config: ActiveProgramsConfigObject) {
  const baseUrl = config.baseUrl || restBaseUrl;
  const patientUuid = getPatientUuidFromStore();

  const { data, error, isLoading } = useSWR<{ data: { results: Array<ProgramResponse> } }, Error>(
    `${baseUrl}/program?patient=${patientUuid}&v=default`,
    (url) =>
      openmrsFetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
  );

  const activePrograms = useMemo(() => {
    if (!data?.data.results) {
      return [];
    }

    return data.data.results.map((program) => ({
      uuid: program.uuid,
      display: program.display,
    }));
  }, [data]);

  return {
    activePrograms,
    isLoading,
    error: error?.message,
  };
}
