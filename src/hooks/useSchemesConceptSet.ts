import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type OpenmrsConcept } from '../types/fhir-immunization-domain';
import useSWR from 'swr';

interface VaccinationProgramConfigObject {
  vaccinationProgramConceptSet: string;
}

export function useSchemesConceptSet(config: VaccinationProgramConfigObject) {
  const conceptRepresentation =
    'custom:(uuid,display,answers:(uuid,display),conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';
  const { data, error, isLoading } = useSWR<{ data: { results: Array<OpenmrsConcept> } }, Error>(
    `${restBaseUrl}/concept?references=${config.vaccinationProgramConceptSet}&v=${conceptRepresentation}`,
    openmrsFetch,
  );

  const schemes = data?.data.results;

  return {
    vaccinationPrograms: schemes,
    isLoading,
  };
}
