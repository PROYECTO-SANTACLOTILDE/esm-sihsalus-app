import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type SchemasWidgetConfigObject, type OpenmrsConcept } from '../types/fhir-immunization-domain';
import useSWR from 'swr';

export function useSchemasConceptSet(config: SchemasWidgetConfigObject) {
  const conceptRepresentation =
    'custom:(uuid,display,answers:(uuid,display),conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';

  const { data, error, isLoading } = useSWR<{ data: { results: Array<OpenmrsConcept> } }, Error>(
    `${restBaseUrl}/concept?references=${config.schemasConceptSet}&v=${conceptRepresentation}`,
    openmrsFetch,
  );
  return {
    schemasConceptSet: data && data.data.results[0],
    isLoading,
  };
}
