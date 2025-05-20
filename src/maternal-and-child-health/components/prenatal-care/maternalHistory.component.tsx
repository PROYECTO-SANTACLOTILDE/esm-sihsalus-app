import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import { useMaternalHistory } from '../../../hooks/useMaternalHistory';
import type { ConfigObject } from '../../../config-schema';

interface MaternalHistoryProps {
  patientUuid: string;
}

const MaternalHistory: React.FC<MaternalHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { prenatalEncounter, error, isValidating, mutate } = useMaternalHistory(patientUuid);
  const config = useConfig() as ConfigObject;

  const handleAdd = useCallback(() => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('Antecedentes', 'Antecedentes'),
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.maternalHistory,
        additionalProps: {},
      },
    });
  }, [t, config.formsList.maternalHistory]);

  // Utilidad para parsear display de observaciones
  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

  // Transforma las observaciones en grupos para la tabla
  const observationGroups = useMemo(() => {
    if (!prenatalEncounter?.obs) return [];
    return prenatalEncounter.obs.map((obs) => {
      const { category: title } = parseDisplay(obs.display);
      const rows =
        obs.groupMembers?.map((member, idx) => {
          const { category, value } = parseDisplay(member.display);
          return {
            id: `row-${member.uuid || idx}`,
            category: { content: category },
            value: { content: value },
          };
        }) || [];
      return { title, rows };
    });
  }, [prenatalEncounter]);

  if (error) {
    return <div>{t('error', 'Error loading maternal history data')}</div>;
  }

  if (isValidating && !prenatalEncounter) {
    return <div>{t('loading', 'Loading...')}</div>;
  }

  return (
    <PatientObservationGroupTable
      groups={observationGroups}
      isLoading={isValidating}
      onAdd={handleAdd}
      mutate={mutate}
      editLabel={t('edit', 'Editar')}
      emptyHeaderTitle={t('maternalHistory', 'Antecedentes Maternos')}
      emptyDisplayText={t('noDataAvailableDescription', 'No data available')}
    />
  );
};

export default MaternalHistory;
