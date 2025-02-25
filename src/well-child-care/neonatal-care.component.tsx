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
import { useVisit } from '@openmrs/esm-framework';
import styles from './well-child-care-component.scss';
import NewbornMonitoring from './components/newborn-monitoring/newborn-monitoring.component';
import NeonatalSummary from './components/neonatal summary/neonatal-summary.component';
interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(patientUuid);
  const isInPatient = currentVisit?.visitType?.display?.toLowerCase() === 'inpatient';

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
            <Tab renderIcon={Friendship}>{t('vitalsNewborn', 'Signos Vitales del Recién Nacido')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('atencionInmediata', 'Atención Inmediata y Cuidado Perinatal')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('evaluacionInmediata', 'Evaluación Inicial y Consejería')}</Tab>
          </TabList>

          <TabPanels className={styles.flexContainer}>
            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NeonatalSummary patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>{'prueba'}</TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
