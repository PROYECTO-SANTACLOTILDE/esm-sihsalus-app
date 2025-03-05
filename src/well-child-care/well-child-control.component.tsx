import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Friendship, ReminderMedical } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { usePatient, useVisit, useConfig, ExtensionSlot } from '@openmrs/esm-framework';
import styles from './well-child-care.scss';

interface WellChildCareProps {
  patientUuid: string;
}

const WellChildControl: React.FC<WellChildCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit, isLoading: isVisitLoading } = useVisit(patientUuid);
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const config = useConfig();
  const pageSize = 10;

  // Memoize patient age in months
  const patientAgeInMonths = useMemo(() => {
    if (!patient?.birthDate) return null;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  }, [patient?.birthDate]);

  const tabs = useMemo(
    () => [
      {
        label: t('comprehensiveCareFollowUp', 'Controles CRED'),
        icon: Friendship,
        slotName: 'cred-schedule-slot',
      },
      {
        label: t('nonCredControl', 'Controles No CRED'),
        icon: ReminderMedical,
        slotName: 'non-cred-control-slot',
      },
      {
        label: t('additionalHealthServices', 'Prestaciones de Salud'),
        icon: ReminderMedical,
        slotName: 'additional-health-services-slot',
      },
    ],
    [t, patientUuid, pageSize, config, styles],
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

  const state = useMemo(
    () => ({ patient, patientUuid, patientAgeInMonths }),
    [patient, patientUuid, patientAgeInMonths],
  );

  return (
    <div className={styles.widgetCard}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('postnatalCare', 'Cuidado del Niño Sano')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer>
        <Tabs>
          <TabList
            className={styles.tabList}
            aria-label={t('wellChildCareTabs', 'Lista de pestañas de cuidado del niño sano')}
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

export default WellChildControl;
