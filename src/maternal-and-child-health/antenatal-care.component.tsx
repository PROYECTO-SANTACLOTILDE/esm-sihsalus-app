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
interface AntenatalCareProps {
  patientUuid: string;
}

const AntenatalCare: React.FC<AntenatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('antenatalCare', 'Antenatal Care');
  const {
    encounterTypes: { mchMotherConsultation },
    formsList: { antenatal },
  } = useConfig<ConfigObject>();

  const ANCEncounterTypeUUID = mchMotherConsultation;
  const ANCEncounterFormUUID = antenatal;

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'visitDate',
        header: t('visitDate', 'Visit Date'),
        getValue: (encounter) => {
          return formatDate(parseDate(encounter.encounterDatetime));
        },
      },
      {
        key: 'ancVisitNumber',
        header: t('ancVisitNumber', 'ANC Visit Number'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, ancVisitNumberConcept);
        },
      },
      {
        key: 'hivTestResults',
        header: t('hivTestResults', 'HIV Test Results'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, hivTestResultConcept);
        },
      },
      {
        key: 'partnerStatus',
        header: t('partnerStatus', 'HIV status of partner'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, partnerHivStatus);
        },
      },
      {
        key: 'followUpDate',
        header: t('followUpDate', 'Next follow-up date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, followUpDateConcept, true);
        },
      },
      {
        key: 'facility',
        header: t('facility', 'Facility'),
        getValue: (encounter) => {
          return encounter.location.name;
        },
      },
      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => [
          {
            form: { name: 'Antenatal Form', package: 'maternal_health' },
            encounterUuid: encounter.uuid,
            intent: '*',
            label: t('editForm', 'Edit Form'),
            mode: 'edit',
          },
        ],
      },
    ],
    [t],
  );

  const tabPanels = [
    {
      name: t('Antecedentes', 'Antecedentes'),
      component: (
        <EncounterList
          patientUuid={patientUuid}
          encounterType={ANCEncounterTypeUUID}
          formList={[{ name: 'Antenatal Form' }]}
          columns={columns}
          description={headerTitle}
          headerTitle={headerTitle}
          launchOptions={{
            displayText: t('add', 'Add'),
            moduleName: 'MCH Clinical View',
          }}
          filter={(encounter) => {
            return encounter.form.uuid == ANCEncounterFormUUID;
          }}
          formConceptMap={ancConceptMap}
        />
      ),
    },
    {
      name: t('AtencionesPrenatales', 'Atenciones Prenatales'),
      component: <PrenatalCareChart patientUuid={patientUuid} />,
    },
    {
      name: t('CronogramaPrenatal', 'Cronograma Prenatal'),
      component: <PatientAppointmentsBase patientUuid={patientUuid} />,
    },
    {
      name: t('GraficasObstétricas', 'Graficas Obstétricas'),
      component: <div>Graficas Obstétricas Content</div>,
    },
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
