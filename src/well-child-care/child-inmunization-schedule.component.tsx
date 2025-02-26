import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel, TabPanels, Layer } from '@carbon/react';
import { VaccinationSchedule } from './components/vaccination-schema-widget/vaccinationSchedule.component';
import { VaccinationAppointment } from './components/vaccination-schema-widget/vaccinationAppointment.component';
import styles from './well-child-care-component.scss';

interface VaccinationProps {
  patientUuid: string;
}

const ChildImmunizationSchedule: React.FC<VaccinationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  // Definición de las pestañas y sus componentes asociados
  const tabPanels = [
    {
      name: t('vaccineCalendar', 'Calendario de Vacunas del Niño'),
      component: <VaccinationSchedule patientUuid={patientUuid} />,
    },
    {
      name: t('scheduleVaccination', 'Vacunas Suministradas'),
      component: <VaccinationAppointment patientUuid={patientUuid} />,
    },
  ];

  return (
    <div className={styles.referralsList} data-testid="referralsList-list">
      <Tabs selected={0} role="navigation">
        <div className={styles.tabsContainer}>
          {/* Lista de pestañas */}
          <TabList aria-label="Content Switcher as Tabs" contained>
            {tabPanels.map((tab, index) => (
              <Tab key={index}>{tab.name}</Tab>
            ))}
          </TabList>
        </div>

        {/* Paneles de contenido para cada pestaña */}
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
