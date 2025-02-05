import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EncounterListColumn } from '../ui/encounter-list/encounter-list.component';
import { EncounterList } from '../ui/encounter-list/encounter-list.component';
import { getObsFromEncounter } from '../ui/encounter-list/encounter-list-utils';
import {
  neonatalVisitDateConcept,
  neonatalWeightConcept,
  neonatalApgarScoreConcept, // Commented out because it is not exported from the module
  neonatalFeedingStatusConcept,
  neonatalConsultation,
  neonatal,
} from './concepts/wcc-concepts';
import { useConfig, formatDate, parseDate } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import { neonatalConceptMap } from './concept-maps/neonatal-care-concepts-map';

interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('neonatalCare', 'Neonatal Care');

  const NeonatalEncounterTypeUUID = neonatalConsultation;
  const NeonatalEncounterFormUUID = neonatal;

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
        key: 'weight',
        header: t('weight', 'Weight (kg)'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, neonatalWeightConcept);
        },
      },
      {
        key: 'apgarScore',
        header: t('apgarScore', 'Apgar Score'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, neonatalApgarScoreConcept);
        },
      },
      {
        key: 'feedingStatus',
        header: t('feedingStatus', 'Feeding Status'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, neonatalFeedingStatusConcept);
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
            form: { name: 'Neonatal Form', package: 'maternal_health' },
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

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={NeonatalEncounterTypeUUID}
      formList={[{ name: 'Neonatal Form' }]}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      launchOptions={{
        displayText: t('add', 'Add'),
        moduleName: 'MCH Clinical View',
      }}
      filter={(encounter) => {
        return encounter.form.uuid == NeonatalEncounterFormUUID;
      }}
      formConceptMap={neonatalConceptMap}
    />
  );
};

export default NeonatalCare;
