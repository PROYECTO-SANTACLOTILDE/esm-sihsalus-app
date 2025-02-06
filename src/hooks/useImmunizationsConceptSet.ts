import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { ImmunizationWidgetConfigObject,  OpenmrsConcept } from '../inmunization-plan/fhir-immunization-domain';
import useSWR from 'swr';

export function useImmunizationsConceptSet(config: ImmunizationWidgetConfigObject): { immunizationsConceptSet: OpenmrsConcept | undefined; isLoading: boolean } {
  const conceptRepresentation =
    'custom:(uuid,display,answers:(uuid,display),conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';

  const { data, error, isLoading } = useSWR<{ data: { results: Array<OpenmrsConcept> } }, Error>(
    `${restBaseUrl}/concept?references=${config.immunizationConceptSet}&v=${conceptRepresentation}`,
    openmrsFetch,
  );
  return {
    immunizationsConceptSet: data && data.data.results[0],
    isLoading,
  };
}
