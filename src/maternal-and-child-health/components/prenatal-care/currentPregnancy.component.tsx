import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useCurrentPregnancy } from '../../../hooks/useCurrentPregnancy';
import type { ConfigObject } from '../../../config-schema';

interface CurrentPregnancyProps {
  patientUuid: string;
}

const CurrentPregnancy: React.FC<CurrentPregnancyProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('currentPregnancy', 'Embarazo Actual');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.currentPregnancy;
  const { prenatalEncounter, isValidating, error, mutate } = useCurrentPregnancy(patientUuid);

  const dataHook = () => ({
    data: prenatalEncounter,
    isLoading: isValidating,
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

export default CurrentPregnancy;
