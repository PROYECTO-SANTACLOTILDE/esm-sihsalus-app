import React from 'react';
import { useTranslation } from 'react-i18next';
import { Friendship, ReminderMedical } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import styles from './well-child-care-component.scss';
import CREDSchedule from './components/controls-timeline/controls-timeline';

interface WellChildCareProps {
  patientUuid: string;
}

const WellChildControl: React.FC<WellChildCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('postnatalCare', 'Cuidado del Niño Sano')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer style={{ backgroundColor: 'white', padding: '0 1rem' }}>
        <Tabs>
          <TabList contained activation="manual" aria-label="List of tabs">
            <Tab renderIcon={Friendship}>{t('comprehensiveCareFollowUp', 'Controles CRED')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('nonCredControl', 'Controles No CRED')}</Tab>
            <Tab renderIcon={ReminderMedical}>{t('additionalHealthServices', 'Prestaciones de Salud')}</Tab>
          </TabList>

          <TabPanels className={styles.flexContainer}>
            <TabPanel style={{ padding: '1rem' }}>
              <CREDSchedule patientUuid={patientUuid} />
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <div>Contenido de Control No CRED</div>
            </TabPanel>

            <TabPanel style={{ padding: '1rem' }}>
              <div>Contenido de Prestaciones Adicionales de Salud</div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default WellChildControl;
