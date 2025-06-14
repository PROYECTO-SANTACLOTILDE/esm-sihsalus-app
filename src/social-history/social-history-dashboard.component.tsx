import { InlineLoading } from '@carbon/react';
import { useConfig, usePatient } from '@openmrs/esm-framework';
import { EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OutPatientSocialHistory from '../clinical-encounter/summary/out-patient-summary/patient-social-history.component';
import type { ConfigObject } from '../config-schema';
import { useClinicalEncounter } from '../hooks/useClinicalEncounter';
import {
  Alcohol_Use_Duration_UUID,
  Alcohol_Use_UUID,
  Other_Substance_Abuse_UUID,
  Smoking_Duration_UUID,
  Smoking_UUID,
} from '../utils/constants';

interface SocialHistoryDashboardProps {
  patientUuid: string;
}

const SocialHistoryDashboard: React.FC<SocialHistoryDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { patient } = usePatient(patientUuid);
  const {
    clinicalEncounterUuid,
    formsList: { clinicalEncounterFormUuid },
  } = useConfig<ConfigObject>();

  // Conceptos relacionados con historia social
  const socialHistoryConcepts = [
    Alcohol_Use_UUID,
    Alcohol_Use_Duration_UUID,
    Smoking_UUID,
    Smoking_Duration_UUID,
    Other_Substance_Abuse_UUID,
  ];

  const { encounters, isLoading, error, isValidating, mutate } = useClinicalEncounter(
    clinicalEncounterUuid,
    clinicalEncounterFormUuid,
    patientUuid,
    socialHistoryConcepts,
  );

  if (isLoading) {
    return <InlineLoading status="active" iconDescription="Loading" description="Loading social history..." />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('socialHistory', 'Social History')} />;
  }

  if (!encounters || encounters.length === 0) {
    return (
      <EmptyState
        displayText={t('socialHistory', 'Social History')}
        headerTitle={t('socialHistory', 'Social History')}
      />
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <OutPatientSocialHistory
        patientUuid={patientUuid}
        encounters={encounters}
        isLoading={isLoading}
        error={error}
        isValidating={isValidating}
        mutate={mutate}
      />
    </div>
  );
};

export default SocialHistoryDashboard;
