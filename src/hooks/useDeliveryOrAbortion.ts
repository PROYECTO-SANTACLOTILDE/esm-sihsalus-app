import { useConfig } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import { useFilteredEncounter } from './useFilteredEncounter';

export const useDeliveryOrAbortion = (
  patientUuid: string,
) => {
  const config = useConfig<ConfigObject>();
  return useFilteredEncounter(
    patientUuid,
    config?.encounterTypes?.hospitalization,
    config?.formsList?.deliveryOrAbortion
  );
};
