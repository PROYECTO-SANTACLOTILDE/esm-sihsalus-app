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

  // Utilidad para parsear display de observaciones
  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

  const dataHook = () => ({
    data: prenatalEncounter ? [parseDisplay] : [],
    isLoading,
    error,
    mutate,
  });

  // Transforma las observaciones en grupos para la tabla
  const groupsData = useMemo(() => {
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

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('noDataAvailableDescription', 'No data available')}
      dataHook={dataHook}
      groupsConfig={groupsData}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default MaternalHistory;
