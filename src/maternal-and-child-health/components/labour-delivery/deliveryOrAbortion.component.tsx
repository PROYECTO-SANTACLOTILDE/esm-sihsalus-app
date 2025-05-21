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
  const headerTitle = t('deliveryOrAbortion', 'Parto o aborto');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.deliveryOrAbortion;

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={displayText}
      dataHook={useDeliveryOrAbortion}
      formWorkspace={formWorkspace}
    />
  );
};

export default DeliveryOrAbortion;
