import React from 'react';
import ActiveProgramSummary from './active-program-summary.component';

export interface RootMedicationSummaryProps {
  patient: fhir.Patient;
}

export default function RootMedicationSummary({ patient }: RootMedicationSummaryProps) {
  return (
    <div>
      <ActiveProgramSummary patient={patient} />
    </div>
  );
}
