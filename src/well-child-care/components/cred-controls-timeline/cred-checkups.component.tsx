import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, Tag } from '@carbon/react';
import {
  AddIcon,
  launchWorkspace,
  formatDate,
  restBaseUrl,
  openmrsFetch,
  useConfig,
} from '@openmrs/esm-framework';
import styles from './cred-schedule.scss';
import useEncountersCRED from '../../../hooks/useEncountersCRED';
import type { ConfigObject } from '../../../config-schema';
import useSWR from 'swr';
import type { Encounter } from '@openmrs/esm-framework';

interface CredEncounter {
  id: string;
  title: string;
  date: string;
  type: 'CRED' | 'Complementaria';
}

interface CredCheckupsProps {
  patientUuid: string;
}

const CredCheckups: React.FC<CredCheckupsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;

  const encounterUrl = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${config.encounterTypes.healthyChildControl}&v=custom:(uuid,encounterType,encounterDatetime)`;

  const {
    data,
    error,
    isLoading,
  } = useSWR<{ data: { results: Encounter[] } }>(encounterUrl, openmrsFetch);

  const fetchedEncounters: CredEncounter[] =
    data?.data?.results?.map((encounter) => ({
      id: encounter.uuid,
      title: encounter.encounterType?.name ?? '',
      date: formatDate(new Date(encounter.encounterDatetime ?? '')),
      type: encounter.encounterType?.name?.includes('CRED') ? 'CRED' : 'Complementaria',
    })) || [];

  const {
    encounters: credAppointments,
    isLoading: isLoadingAppointments,
  } = useEncountersCRED(patientUuid) as {
    encounters: any[];
    isLoading: boolean;
  };

  const handleAddCredControl = (checkup: any) => {
    launchWorkspace('wellchild-control-form', {
      workspaceTitle: `${t('newCredEncounter', 'Nuevo Control CRED')} - ${checkup.serviceName || checkup.name}`,
      additionalProps: {
        patientUuid,
        checkup,
        type: 'newControl',
      },
    });
  };

  return (
    <div className={styles.widgetCard}>
      <div className={styles.desktopHeading}>
        <h4>{t('credCheckups', 'Controles CRED')}</h4>
      </div>
      <div className={styles.checkups}>
        {isLoading ? (
          <InlineLoading description={t('loadingEncounters', 'Cargando encuentros...')} />
        ) : (
          fetchedEncounters.map((encounter) => (
            <div key={encounter.id} className={styles.checkupItem}>
              <span>{encounter.title}</span>
              <span>{encounter.date}</span>
              <Tag type={encounter.type === 'CRED' ? 'green' : 'purple'}>{encounter.type}</Tag>
            </div>
          ))
        )}

        <h5 className={styles.upcomingHeader}>{t('upcomingCheckups', 'Próximos controles')}</h5>
        {isLoadingAppointments ? (
          <InlineLoading description={t('loadingAppointments', 'Cargando citas...')} />
        ) : (
          credAppointments.map((appt: any) => (
            <div key={appt.uuid} className={styles.checkupItem}>
              <span>{appt.serviceName || appt.service?.name || 'CRED'}</span>
              <span className={styles.dueDate}>
                {t('dueAt', 'A los')}{' '}
                {appt.startDateTime ? formatDate(new Date(appt.startDateTime)) : appt.appointmentDate || ''}
              </span>
              <Tag type="blue">{appt.status || t('pending', 'Pendiente')}</Tag>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={AddIcon}
                iconDescription={t('addData', 'Agregar control')}
                onClick={() => handleAddCredControl(appt)}
              >
                {t('add', 'Agregar')}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CredCheckups;
