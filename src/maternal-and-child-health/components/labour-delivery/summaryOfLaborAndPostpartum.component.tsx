import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useSummaryOfLaborAndPostpartum } from '../../../hooks/useSummaryOfLaborAndPostpartum';
import type { ConfigObject } from '../../../config-schema';

interface SummaryOfLaborAndPostpartumProps {
  patientUuid: string;
}

const SummaryOfLaborAndPostpartum: React.FC<SummaryOfLaborAndPostpartumProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { prenatalEncounter, isValidating, error, mutate } = useSummaryOfLaborAndPostpartum(patientUuid);
  const headerTitle = t('resumenPartoPuerperio', 'Resumen de Parto y Puerperio');

  const handleLaunchForm = () => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: headerTitle,
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.SummaryOfLaborAndPostpartum,
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

export default SummaryOfLaborAndPostpartum;
