import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel, TabPanels, InlineLoading, Layer } from '@carbon/react';
import { VaccinationSchedule } from './vaccination-schema-widget/vaccinationSchedule.component';
import { VaccinationAppointment } from './vaccination-schema-widget/vaccinationAppointment.component';

import styles from './well-child-care-component.scss';

interface VaccinationProps {
  patientUuid: string;
}

const ChildImmunizationSchedule: React.FC<VaccinationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('childImmunizationSchedule', 'Calendario de Vacunación Infantil');

  const tabPanels = [
    {
      name: t('vaccineCalendar', 'Calendario de Vacunas del Niño'),
      component: <VaccinationSchedule patientUuid={patientUuid} />,
    },
    {
      name: t('scheduleVaccination', 'Programar Cita de Vacunas'),
      component: <VaccinationAppointment patientUuid={patientUuid} />,
    },
  ];

  return (
    <div className={styles.referralsList} data-testid="vaccination-schedule">
      <h2>{headerTitle}</h2>
      <Tabs selected={0} role="navigation">
        <div className={styles.tabsContainer}>
          <TabList aria-label="Content Switcher as Tabs" contained>
            {tabPanels.map((tab, index) => (
              <Tab key={index}>{tab.name}</Tab>
            ))}
          </TabList>
        </div>

        <TabPanels>
          {tabPanels.map((tab, index) => (
            <TabPanel key={index}>
              <Layer>{tab.component}</Layer>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ChildImmunizationSchedule;
