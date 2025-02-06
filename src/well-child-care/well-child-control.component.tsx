import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel, TabPanels, Layer } from '@carbon/react';
import { EncounterList } from '../ui/encounter-list/encounter-list.component';
import { getObsFromEncounter } from '../ui/encounter-list/encounter-list-utils';
import {
  hivTestResultConcept,
  MotherNextVisitDate,
  motherGeneralConditionConcept,
  pphConditionConcept,
} from './concepts/wcc-concepts';
import { useConfig, formatDate, parseDate } from '@openmrs/esm-framework';
import { pncConceptMap } from './concept-maps/well-child-care-concepts-map';
import styles from './well-child-care-component.scss';

interface PostnatalCareProps {
  patientUuid: string;
}

const WellChildControl: React.FC<PostnatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('postnatalCare', 'Postnatal Care');

  const {
    encounterTypes: { mchMotherConsultation },
    formsList: { postnatal },
  } = useConfig();

  const MotherPNCEncounterTypeUUID = mchMotherConsultation;
  const MotherPNCEncounterFormUUID = postnatal;

  const columns = useMemo(
    () => [
      {
        key: 'visitDate',
        header: t('visitDate', 'Fecha de Visita'),
        getValue: (encounter) => formatDate(parseDate(encounter.encounterDatetime)),
      },
      {
        key: 'hivTestResults',
        header: t('hivTestResults', 'Estado VIH'),
        getValue: (encounter) => getObsFromEncounter(encounter, hivTestResultConcept),
      },
      {
        key: 'motherGeneralCondition',
        header: t('motherGeneralCondition', 'Condición General'),
        getValue: (encounter) => getObsFromEncounter(encounter, motherGeneralConditionConcept, true),
      },
      {
        key: 'pphCondition',
        header: t('pphCondition', 'Presencia de PPH'),
        getValue: (encounter) => getObsFromEncounter(encounter, pphConditionConcept),
      },
      {
        key: 'uterusCondition',
        header: t('uterusCondition', 'Condición del Útero'),
        getValue: (encounter) => getObsFromEncounter(encounter, pphConditionConcept),
      },
      {
        key: 'nextVisitDate',
        header: t('nextVisitDate', 'Fecha de Próxima Visita'),
        getValue: (encounter) => getObsFromEncounter(encounter, MotherNextVisitDate, true),
      },
      {
        key: 'actions',
        header: t('actions', 'Acciones'),
        getValue: (encounter) => [
          {
            form: { name: 'Formulario Postnatal Materno', package: 'maternal_health' },
            encounterUuid: encounter.uuid,
            intent: '*',
            label: t('editForm', 'Editar Formulario'),
            mode: 'edit',
          },
        ],
      },
    ],
    [t],
  );

  const tabPanels = [
    {
      name: t('comprehensiveCareFollowUp', 'Seguimiento de Atención Integral'),
      component: <div>Contenido de Seguimiento de Atención Integral</div>,
    },
    {
      name: t('credControl', 'Control CRED'),
      component: (
        <EncounterList
          patientUuid={patientUuid}
          encounterType={MotherPNCEncounterTypeUUID}
          formList={[{ name: 'Formulario Postnatal Materno' }]}
          columns={columns}
          description={headerTitle}
          headerTitle={headerTitle}
          launchOptions={{
            displayText: t('add', 'Añadir'),
            moduleName: 'MCH Clinical View',
          }}
          filter={(encounter) => encounter.form.uuid == MotherPNCEncounterFormUUID}
          formConceptMap={pncConceptMap}
        />
      ),
    },
    {
      name: t('nonCredControl', 'Control No CRED'),
      component: <div>Contenido de Control No CRED</div>,
    },
    {
      name: t('additionalHealthServices', 'Prestaciones Adicionales de Salud'),
      component: <div>Contenido de Prestaciones Adicionales de Salud</div>,
    },
  ];

  return (
    <div className={styles.tabs} data-testid="referralsList-list">
      <Tabs selected={0} role="navigation">
        <div className={styles.tabsContainer}>
          <TabList aria-label="Content Switcher as Tabs" className={styles.tabList}>
            {tabPanels.map((tab, index) => (
              <Tab className={styles.tab} key={index}>
                {tab.name}
              </Tab>
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

export default WellChildControl;
