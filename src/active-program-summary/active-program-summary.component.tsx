import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { EmptyState, ErrorState, useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';

export interface MedicationsSummaryProps {
  patient: fhir.Patient;
}

export default function ActiveProgramSummary({ patient }: MedicationsSummaryProps) {
  const { t } = useTranslation();

  return <div>Hola, get dolla</div>;
}
