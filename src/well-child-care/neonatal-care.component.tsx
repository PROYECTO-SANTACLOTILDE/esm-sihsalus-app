import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { usePatient, useVisit, useConfig, ExtensionSlot } from '@openmrs/esm-framework';

import styles from './well-child-care.scss';

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

  const isOver90Days = useMemo(() => patientAgeInDays !== null && patientAgeInDays > 90, [patientAgeInDays]);

  const tabs = useMemo(
    () => [
      {
        label: t('vitalsNewborn', 'Monitoreo del Recién Nacido'),
        icon: Activity,
        slotName: 'neonatal-vitals-slot',
      },
      {
        label: t('perinatal', 'Inscripción Materno Perinatal'),
        icon: UserFollow,
        slotName: 'neonatal-perinatal-slot',
      },
      {
        label: t('atencionInmediata', 'Atención Inmediata del RN'),
        icon: CloudMonitoring,
        slotName: 'neonatal-attention-slot',
      },
      {
        label: t('evaluacionInmediata', 'Evaluación del Recién Nacido'),
        icon: Stethoscope,
        slotName: 'neonatal-evaluation-slot',
      },
      {
        label: t('consejeriaLactancia', 'Consejería Lactancia Materna'),
        icon: WatsonHealthCobbAngle,
        slotName: 'neonatal-counseling-slot',
      },
    ],
    [t],
  );

  const state = useMemo(
    () => ({ patient, patientUuid, patientAgeInDays, isOver90Days }),
    [patient, patientUuid, patientAgeInDays, isOver90Days],
  );

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
    <div className={styles.widgetCard}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('neonatalCare', 'Cuidado del Recién Nacido')}</h4>
            <div>
              {isOver90Days && <span className={styles.overdueIndicator}>{t('over90Days', 'Mayor de 90 días')}</span>}
            </div>
          </div>
        </Tile>
      </Layer>

      <Layer>
        <Tabs>
          <TabList
            className={styles.tabList}
            aria-label={t('neonatalCareTabs', 'Lista de pestañas de cuidado neonatal')}
          >
            {tabs.map((tab, index) => (
              <Tab className={styles.tab} key={index} renderIcon={tab.icon}>
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index} className={styles.tabPanelContainer}>
                <ExtensionSlot
                  name={tab.slotName}
                  state={{ patientUuid, currentVisit, pageSize: 10 }}
                  className={styles.extensionSlot}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
