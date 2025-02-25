import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useVisit } from '@openmrs/esm-framework';
import styles from './well-child-care-component.scss';
import NewbornMonitoring from './components/newborn-monitoring/newborn-monitoring.component';
import NeonatalSummary from './components/neonatal summary/neonatal-summary.component';
import NeonatalEvaluation from './components/neonatal evalution/neonatal-evaluation.component';
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
            <h4>{t('neonatalCare', 'Cuidado del Recién Nacido')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer style={{ backgroundColor: 'white', padding: '0 1rem' }}>
        <Tabs>
          <TabList contained activation="manual" aria-label="List of tabs">
            <Tab renderIcon={Activity}>{t('vitalsNewborn', 'Monitoreo del Recién Nacido')}</Tab>
            <Tab renderIcon={UserFollow}>{t('perinatal', 'Inscripción Materno Perinatal')}</Tab>
            <Tab renderIcon={CloudMonitoring}>{t('atencionInmediata', 'Atención Inmediata del RN')}</Tab>
            <Tab renderIcon={Stethoscope}>{t('evaluacionInmediata', 'Evaluación del Recién Nacido')}</Tab>
            <Tab renderIcon={WatsonHealthCobbAngle}>{t('consejeriaLactancia', 'Consejería Lactancia Materna')}</Tab>
          </TabList>

          <TabPanels className={styles.flexContainer}>
            <TabPanel style={{ padding: '1rem' }}>
              <NewbornMonitoring patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NeonatalSummary patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NeonatalEvaluation patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NeonatalSummary patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <NeonatalEvaluation patientUuid={patientUuid} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
