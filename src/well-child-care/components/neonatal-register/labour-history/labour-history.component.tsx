import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, useConfig } from '@openmrs/esm-framework';
import {
  MchEncounterType_UUID,
  ModeOfDelivery_UUID,
  GestationalSize_UUID,
  BloodLoss_UUID,
  GivenVitaminK_UUID,
} from '../../../../utils/constants';
import { getObsFromEncounter } from '../../../../ui/encounter-list/encounter-list-utils';
import {
  EmptyState,
  ErrorState,
  launchStartVisitPrompt,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import { OverflowMenu, OverflowMenuItem, InlineLoading } from '@carbon/react';
import { useNeonatalSummary } from '../../../../hooks/useNeonatalSummary';
import SummaryCard from '../../summary-card/summary-card.component';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import type { ConfigObject } from '../../../../config-schema';
import styles from './labour-history.scss';

interface NeonatalSummaryProps {
  patientUuid: string;
}

const LabourHistory: React.FC<NeonatalSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { encounters, isLoading, error, mutate } = useNeonatalSummary(patientUuid, MchEncounterType_UUID);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const config = useConfig() as ConfigObject;

  const formAntenatalUuid = config.formsList.currentPregnancy;

  const handleOpenOrEditNeonatalSummaryForm = (encounterUUID = '') => {
    if (!currentVisit) {
      launchStartVisitPrompt();
      return;
    }

    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('antecedentesNatales', 'Antecedentes Natales'),
      mutateForm: mutate,
      formInfo: {
        encounterUuid: encounterUUID,
        formUuid: formAntenatalUuid,
        additionalProps: {},
        patientUuid,
        visitTypeUuid: currentVisit?.visitType?.uuid || '',
        visitUuid: currentVisit?.uuid || '',
      },
    });
  };

  const tableRows = useMemo(() => {
    return encounters?.map((encounter) => ({
      id: encounter.uuid,
      encounterDate: formatDate(new Date(encounter.encounterDatetime)),
      deliveryDate: formatDate(new Date(encounter.encounterDatetime)),
      modeOfDelivery: getObsFromEncounter(encounter, ModeOfDelivery_UUID) || '--',
      gestationalSize: getObsFromEncounter(encounter, GestationalSize_UUID) || '--',
      birthInjuriesTrauma: '--',
      neonatalAbnormalities: '--',
      bloodLoss: getObsFromEncounter(encounter, BloodLoss_UUID) || '--',
      neonatalProblems: '--',
      babyGivenVitaminK: getObsFromEncounter(encounter, GivenVitaminK_UUID) || '--',

      actions: (
        <OverflowMenu aria-label="overflow-menu">
          <OverflowMenuItem
            onClick={() => handleOpenOrEditNeonatalSummaryForm(encounter.uuid)}
            itemText={t('edit', 'Edit')}
          />
          <OverflowMenuItem itemText={t('delete', 'Delete')} isDelete />
        </OverflowMenu>
      ),
    }));
  }, [encounters, t]);

  if (isLoading) {
    return (
      <InlineLoading
        status="active"
        iconDescription={t('loading', 'Loading')}
        description={t('loadingData', 'Loading data...')}
      />
    );
  }
  if (error) {
    return <ErrorState error={error} headerTitle={t('neonatalSummary', 'Neonatal Summary')} />;
  }
  if (!encounters?.length) {
    return (
      <EmptyState
        displayText={t('neonatalSummary', 'Neonatal Summary')}
        headerTitle={t('neonatalSummary', 'Neonatal Summary')}
        launchForm={handleOpenOrEditNeonatalSummaryForm}
      />
    );
  }

  return (
    <div className={styles.cardContainer}>
      <SummaryCard title={t('dateOfDelivery', 'Date of Delivery')} value={tableRows[0]?.encounterDate} />
      <SummaryCard title={t('modeOfDelivery', 'Mode of Delivery')} value={tableRows[0]?.modeOfDelivery} />
      <SummaryCard title={t('gestationalSize', 'Gestational Size')} value={tableRows[0]?.gestationalSize} />
      <SummaryCard
        title={t('birthInjuriesTrauma', 'Birth Injuries/Trauma')}
        value={tableRows[0]?.birthInjuriesTrauma}
      />
      <SummaryCard
        title={t('neonatalAbnormalities', 'Neonatal Abnormalities')}
        value={tableRows[0]?.neonatalAbnormalities}
      />
      <SummaryCard title={t('bloodLoss', 'Blood Transfusion Done')} value={tableRows[0]?.bloodLoss} />
      <SummaryCard title={t('neonatalProblems', 'Neonatal Problems')} value={tableRows[0]?.neonatalProblems} />
      <SummaryCard title={t('babyGivenVitaminK', 'Baby Given Vitamin K')} value={tableRows[0]?.babyGivenVitaminK} />
    </div>
  );
};

export default LabourHistory;
