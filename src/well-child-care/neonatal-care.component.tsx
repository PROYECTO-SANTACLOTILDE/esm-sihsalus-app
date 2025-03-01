import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import { Column, Row, Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { age, usePatient, useVisit, useConfig } from '@openmrs/esm-framework';
import type { ConfigObject } from '../ui/growth-chart/config-schema';

import styles from './well-child-care.scss';
import NeonatalSummary from './components/neonatal summary/neonatal-summary.component';
import NeonatalEvaluation from './components/neonatal evalution/neonatal-evaluation.component';
import NeonatalCounseling from './components/neonatal counseling/neonatal-consuling.component';
import NeonatalAttention from './components/neonatal attention/neonatal-attention.component';
import NewbornBiometricsBase from './components/newborn-monitoring/newborn biometrics/biometrics-base.component';
import VitalsOverview from './components/newborn-monitoring/newborn vitals/vitals-overview.component';
import BalanceOverview from './components/newborn-monitoring/newborn balance/balance-overview.component';
import GrowthChartOverview from '../ui/growth-chart/charts/extensions/GrowthChart/growthchart-overview';

interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit, isLoading: isVisitLoading } = useVisit(patientUuid);
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const config = useConfig();
  const pageSize = 10;

  // Memoize patient age in days
  const patientAgeInDays = useMemo(() => {
    if (!patient?.birthDate) return null;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    const diffTime = today.getTime() - birthDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  }, [patient?.birthDate]);

  // Memoize whether the patient is over 90 days
  const isOver90Days = useMemo(() => patientAgeInDays !== null && patientAgeInDays > 90, [patientAgeInDays]);

  // Define tab configuration
  const tabs = useMemo(
    () => [
      {
        label: t('vitalsNewborn', 'Monitoreo del Recién Nacido'),
        icon: Activity,
        content: (
          <>
            <Row className={styles.row}>
              <Column lg={8} md={4}>
                <VitalsOverview patientUuid={patientUuid} pageSize={pageSize} />
              </Column>
              <Column lg={8} md={4}>
                <NewbornBiometricsBase patientUuid={patientUuid} pageSize={pageSize} />
              </Column>
            </Row>
            <Row className={styles.row}>
              <Column lg={8} md={4}>
                <BalanceOverview patientUuid={patientUuid} pageSize={pageSize} />
              </Column>
            </Row>
            <Row className={styles.row}>
              <Column lg={8} md={4}>
                <GrowthChartOverview patientUuid={patientUuid} config={config} />
              </Column>
            </Row>
          </>
        ),
      },
      {
        label: t('perinatal', 'Inscripción Materno Perinatal'),
        icon: UserFollow,
        content: <NeonatalSummary patientUuid={patientUuid} />,
      },
      {
        label: t('atencionInmediata', 'Atención Inmediata del RN'),
        icon: CloudMonitoring,
        content: <NeonatalAttention patientUuid={patientUuid} />,
      },
      {
        label: t('evaluacionInmediata', 'Evaluación del Recién Nacido'),
        icon: Stethoscope,
        content: <NeonatalEvaluation patientUuid={patientUuid} />,
      },
      {
        label: t('consejeriaLactancia', 'Consejería Lactancia Materna'),
        icon: WatsonHealthCobbAngle,
        content: <NeonatalCounseling patientUuid={patientUuid} />,
      },
    ],
    [t, patientUuid, pageSize, config, styles],
  );

  // Handle loading state
  if (isVisitLoading || isPatientLoading) {
    return (
      <Layer>
        <Tile>
          <p>{t('loading', 'Cargando datos...')}</p>
        </Tile>
      </Layer>
    );
  }

  return (
    <div className={styles.neonatalCareContainer}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('neonatalCare', 'Cuidado del Recién Nacido')}</h4>
            <div>
              {patientAgeInDays !== null && (
                <span className={styles.ageDisplay}>
                  {t('age', 'Edad')}: {age(patient?.birthDate) ?? '--'} {t('days', 'días')}
                </span>
              )}
              {isOver90Days && <span className={styles.ageStatus}>{t('over90Days', 'Mayor de 90 días')}</span>}
            </div>
          </div>
        </Tile>
      </Layer>

      <Layer className={styles.tabContainer}>
        <Tabs>
          <TabList
            contained
            activation="manual"
            aria-label={t('neonatalCareTabs', 'Lista de pestañas de cuidado neonatal')}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} renderIcon={tab.icon}>
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index}>{tab.content}</TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
