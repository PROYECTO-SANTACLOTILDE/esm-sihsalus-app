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
  const { prenatalEncounter, error, isValidating, mutate } = useDeliveryOrAbortion(patientUuid);

  const handleAdd = useCallback(() => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('deliveryOrAbortion', 'Parto o aborto'),
      formInfo: {
        encounterUuid: '',
        formUuid: config.formsList.deliveryOrAbortion,
        additionalProps: {},
      },
    });
  }, [t, config.formsList.deliveryOrAbortion]);

  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

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
    return <div>{t('error', 'Error loading delivery or abortion data')}</div>;
  }

  if (isValidating && !prenatalEncounter) {
    return <div>{t('loading', 'Loading...')}</div>;
  }

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      dataHook={() => ({ data: null, isLoading: false, error: null })}
      groupsConfig={observationGroups}
      onFormLaunch={handleAdd}
      headerTitle={t('deliveryOrAbortion', 'Parto o aborto')}
      displayText={t('noDataAvailableDescription', 'No data available')}
      mutate={mutate}
    />
  );
};

export default DeliveryOrAbortion;
