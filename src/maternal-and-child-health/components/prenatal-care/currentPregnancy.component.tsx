import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useCurrentPregnancy } from '../../../hooks/useCurrentPregnancy';
import type { ConfigObject } from '../../../config-schema';

interface CurrentPregnancyProps {
  patientUuid: string;
}

const CurrentPregnancy: React.FC<CurrentPregnancyProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { prenatalEncounter, isValidating, error, mutate } = useCurrentPregnancy(patientUuid);
  const headerTitle = t('currentPregnancy', 'Embarazo Actual');

  const handleLaunchForm = () => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: headerTitle,
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.currentPregnancy,
        additionalProps: {},
      },
    });
  };

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
      displayText={t('noDataAvailableDescription', 'No data available')}
      dataHook={dataHook}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default CurrentPregnancy;
