import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useMaternalHistory } from '../../../hooks/useMaternalHistory';
import type { ConfigObject } from '../../../config-schema';

// UUID del encounterType del formulario "Atención Inmediata del Recién Nacido"
export const maternaHistoryEncounterTypeUuid = '.';

interface MaternalHistoryProps {
  patientUuid: string;
}

const MaternalHistory: React.FC<MaternalHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('maternaHistory', 'Antecedente de Historia Materna');

  const { prenatalEncounter, isLoading, error, mutate } = useMaternalHistory(patientUuid);

  const handleLaunchForm = () => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: headerTitle,
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.maternalHistory,
        additionalProps: {},
      },
    });
  };

  const dataHook = () => ({
    data: prenatalEncounter,
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
      displayText={t('noDataAvailableDescription', 'No data available')}
      dataHook={dataHook}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default MaternalHistory;
