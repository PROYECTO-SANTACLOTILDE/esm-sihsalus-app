import React from 'react';
import ActiveProgramSummary from './active-program-summary.component';

export interface RootMedicationSummaryProps {
  patient: fhir.Patient;
}

//no hace nada
export default function RootActiveProgramSummary({ patient }: RootMedicationSummaryProps) {
  return (
    <div>
      <ActiveProgramSummary patient={patient} />
    </div>
  );
}
