import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { useVisit } from '@openmrs/esm-framework';
import styles from './well-child-care.scss';
import NewbornMonitoring from './components/newborn-monitoring/newborn-monitoring.component';
import NeonatalSummary from './components/neonatal summary/neonatal-summary.component';
import NeonatalEvaluation from './components/neonatal evalution/neonatal-evaluation.component';
import NeonatalCounseling from './components/neonatal counseling/neonatal-consuling.component';
import NeonatalAttention from './components/neonatal attention/neonatal-attention.component';
import NewbornBiometricsBase from './components/newborn-monitoring/newborn biometrics/biometrics-base.component';
import VitalsOverview from './components/newborn-monitoring/newborn vitals/vitals-overview.component';
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

          <TabPanels>
            <TabPanel>
              <VitalsOverview patientUuid={patientUuid} pageSize={10} />
              {''}
              <NewbornBiometricsBase patientUuid={patientUuid} pageSize={10} />
            </TabPanel>

            <TabPanel>
              <NeonatalSummary patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel>
              <NeonatalAttention patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel>
              <NeonatalEvaluation patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel>
              <NeonatalCounseling patientUuid={patientUuid} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
