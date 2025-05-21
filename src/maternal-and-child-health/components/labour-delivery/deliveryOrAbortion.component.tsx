import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import type { ConfigObject } from '../../../config-schema';
import { useDeliveryOrAbortion } from '../../../hooks/useDeliveryOrAbortion';

interface DeliveryOrAbortionProps {
  patientUuid: string;
}

const DeliveryOrAbortion: React.FC<DeliveryOrAbortionProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { prenatalEncounter, isValidating, error, mutate } = useDeliveryOrAbortion(patientUuid);
  const headerTitle = t('deliveryOrAbortion', 'Parto o aborto');

  const handleLaunchForm = () => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: headerTitle,
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.deliveryOrAbortion,
        additionalProps: {},
      },
    });
  };

  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

  const dataHook = () => ({
    data: prenatalEncounter ? [parseDisplay] : [],
    isLoading: isValidating,
    error,
    mutate: async () => {
      await Promise.resolve(mutate());
    },
  });

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

export default DeliveryOrAbortion;
