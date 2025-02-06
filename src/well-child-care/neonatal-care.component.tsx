import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel, TabPanels, InlineLoading, Layer } from '@carbon/react';
import { EncounterList } from '../ui/encounter-list/encounter-list.component';
import { getObsFromEncounter } from '../ui/encounter-list/encounter-list-utils';
import {
  neonatalWeightConcept,
  neonatalApgarScoreConcept,
  neonatalFeedingStatusConcept,
  neonatalConsultation,
  neonatal,
} from './concepts/wcc-concepts';
import { useConfig, formatDate, parseDate } from '@openmrs/esm-framework';
import { neonatalConceptMap } from './concept-maps/neonatal-care-concepts-map';
import styles from './well-child-care-component.scss';

interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('neonatalCare', 'Cuidado Neonatal');
  const NeonatalEncounterTypeUUID = neonatalConsultation;
  const NeonatalEncounterFormUUID = neonatal;

  const columns = useMemo(
    () => [
      {
        key: 'visitDate',
        header: t('visitDate', 'Fecha de Visita'),
        getValue: (encounter) => formatDate(parseDate(encounter.encounterDatetime)),
      },
      {
        key: 'weight',
        header: t('weight', 'Peso (kg)'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalWeightConcept),
      },
      {
        key: 'apgarScore',
        header: t('apgarScore', 'Puntaje Apgar'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalApgarScoreConcept),
      },
      {
        key: 'feedingStatus',
        header: t('feedingStatus', 'Estado de Alimentación'),
        getValue: (encounter) => getObsFromEncounter(encounter, neonatalFeedingStatusConcept),
      },
      {
        key: 'facility',
        header: t('facility', 'Centro de Atención'),
        getValue: (encounter) => encounter.location.name,
      },
      {
        key: 'actions',
        header: t('actions', 'Acciones'),
        getValue: (encounter) => [
          {
            form: { name: 'Formulario Neonatal', package: 'maternal_health' },
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
      name: t('summaryMonitoring', 'Resumen y Monitoreo'),
      component: <div>Resumen y Monitoreo Content</div>,
    },
    {
      name: t('newbornCare', 'Atención del Recién Nacido'),
      component: (
        <EncounterList
          patientUuid={patientUuid}
          encounterType={NeonatalEncounterTypeUUID}
          formList={[{ name: 'Formulario Neonatal' }]}
          columns={columns}
          description={headerTitle}
          headerTitle={headerTitle}
          launchOptions={{
            displayText: t('add', 'Añadir'),
            moduleName: 'MCH Clinical View',
          }}
          filter={(encounter) => encounter.form.uuid == NeonatalEncounterFormUUID}
          formConceptMap={neonatalConceptMap}
        />
      ),
    },
    {
      name: t('evaluationOrdersNotes', 'Valoración, Órdenes y Exámenes'),
      component: <div>Valoración, Órdenes y Exámenes Content</div>,
    },
    {
      name: t('epicrisis', 'Epicrisis'),
      component: <div>Epicrisis Content</div>,
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

export default NeonatalCare;
