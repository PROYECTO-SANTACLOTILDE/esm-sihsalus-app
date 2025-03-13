import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel, TabPanels, InlineLoading, Layer } from '@carbon/react';
import { EncounterList } from '../ui/encounter-list/encounter-list.component';
import type { EncounterListColumn } from '../ui/encounter-list/encounter-list.component';
import { getObsFromEncounter } from '../ui/encounter-list/encounter-list-utils';
import {
  followUpDateConcept,
  hivTestResultConcept,
  ancVisitNumberConcept,
  partnerHivStatus,
} from './concepts/mch-concepts';
import { useConfig, formatDate, parseDate } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import { ancConceptMap } from './concept-maps/antenatal-care-concepts-map';
import styles from './maternal-health-component.scss';
import PrenatalCareChart from './tables/prenatalCareChart.component';
import PatientAppointmentsBase from '../ui/patient-appointments/patient-appointments-base.component';
import MaternalHistoryTable from './tables/maternalHistory.component';
import CurrentPregnancyTable from './tables/currentPregnancy.component';
interface AntenatalCareProps {
  patientUuid: string;
}

const AntenatalCare: React.FC<AntenatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('antenatalCare', 'Antenatal Care');
  const {
    encounterTypes: { prenatalControl },
    formsList: { antenatal },
  } = useConfig<ConfigObject>();

  const tabPanels = [
    {
      name: t('Antecedentes', 'Antecedentes'),
      component: <MaternalHistoryTable patientUuid={patientUuid} />,
    },
    {
      name: t('EmbarazoActual', 'Embarazo Actual'),
      component: <CurrentPregnancyTable patientUuid={patientUuid} />,
    },
    {
      name: t('AtencionesPrenatales', 'Atenciones Prenatales'),
      component: <PrenatalCareChart patientUuid={patientUuid} />,
    },
    /*{
      name: t('CronogramaPrenatal', 'Cronograma Prenatal'),
      component: <PatientAppointmentsBase patientUuid={patientUuid} />,
    },
    {
      name: t('GraficasObstétricas', 'Graficas Obstétricas'),
      component: <div>Graficas Obstétricas Content</div>,
    },*/
  ];

  return (
    <div className={styles.referralsList} data-testid="referralsList-list">
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

export default AntenatalCare;
