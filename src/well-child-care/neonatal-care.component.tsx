import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  CloudMonitoring,
  Dashboard,
  Friendship,
  ReminderMedical,
  UserFollow,
  UserMultiple,
} from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useConfig, formatDate, parseDate, useVisit } from '@openmrs/esm-framework';
import { getObsFromEncounter } from '../ui/encounter-list/encounter-list-utils';
import styles from './well-child-care-component.scss';
import NewbornMonitoring from './newborn-monitoring/newborn-monitoring.component';

import {
  neonatalWeightConcept,
  neonatalApgarScoreConcept,
  neonatalFeedingStatusConcept,
  neonatalConsultation,
  neonatal,
} from './concepts/wcc-concepts';

interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(patientUuid);
  const isInPatient = currentVisit?.visitType?.display?.toLowerCase() === 'inpatient';

  const columns = useMemo(
    () => [
      {
        key: 'visitDate',
        header: t('visitDate', 'Fecha de Visita'),
        getValue: (encounter) => formatDate(parseDate(encounter.encounterDatetime)),
      },
      {
        key: 'weight',
        header: t('weight', 'Peso (kg)'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalWeightConcept),
      },
      {
        key: 'apgarScore',
        header: t('apgarScore', 'Puntaje Apgar'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalApgarScoreConcept),
      },
      {
        key: 'feedingStatus',
        header: t('feedingStatus', 'Estado de Alimentación'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalFeedingStatusConcept),
      },
      {
        key: 'facility',
        header: t('facility', 'Centro de Atención'),
        getValue: (encounter) => encounter.location?.name || '-',
      },
    ],
    [t],
  );

  return (
    <div>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('neonatalCare', 'Cuidado Neonatal')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer style={{ backgroundColor: 'white', padding: '0 1rem' }}>
        <Tabs>
          <TabList contained activation="manual" aria-label="List of tabs">
            <Tab renderIcon={Friendship}>{t('vitalsNewborn', 'Vitals Newborn')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('perinatal', 'perinatal')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('atencionInmediata', 'atencionInmediata')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('evaluacionInmediata', 'evaluacionInmediata')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('consejeriaMaterna', 'consejeriaMaterna')}</Tab>
          </TabList>

          <TabPanels className={styles.flexContainer}>
            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>{'hola'}</TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
