import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useSummaryOfLaborAndPostpartum } from '../../../hooks/useSummaryOfLaborAndPostpartum';
import type { ConfigObject } from '../../../config-schema';

interface SummaryOfLaborAndPostpartumProps {
  patientUuid: string;
}

const SummaryOfLaborAndPostpartum: React.FC<SummaryOfLaborAndPostpartumProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('resumenPartoPuerperio', 'Resumen de Parto y Puerperio');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.SummaryOfLaborAndPostpartum;

  const { prenatalEncounter: data, isLoading, error, mutate } = useSummaryOfLaborAndPostpartum(patientUuid);

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

export default SummaryOfLaborAndPostpartum;
