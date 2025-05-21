import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useMaternalHistory } from '../../../hooks/useMaternalHistory';
import type { ConfigObject } from '../../../config-schema';

interface MaternalHistoryProps {
  patientUuid: string;
}

const MaternalHistory: React.FC<MaternalHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('maternaHistory', 'Antecedente de Historia Materna');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.maternalHistory;
  const { prenatalEncounter, isLoading, error, mutate } = useMaternalHistory(patientUuid);

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
      displayText={displayText}
      dataHook={dataHook}
      formWorkspace={formWorkspace}
    />
  );
};

export default MaternalHistory;
