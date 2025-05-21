import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import type { ConfigObject } from '../../../config-schema';
import { useDeliveryOrAbortion } from '../../../hooks/useDeliveryOrAbortion';

interface DeliveryOrAbortionProps {
  patientUuid: string;
}

const DeliveryOrAbortion: React.FC<DeliveryOrAbortionProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('deliveryOrAbortion', 'Parto o Aborto');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.deliveryOrAbortion;
  const { prenatalEncounter: data, isLoading, error, mutate } = useDeliveryOrAbortion(patientUuid);

  const dataHook = () => ({
    data,
    isLoading,
    error,
    mutate: async () => {
      await Promise.resolve(mutate());
    },
  });

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={displayText}
      dataHook={dataHook}
      formWorkspace={formWorkspace}
    />
  );
};

export default DeliveryOrAbortion;
