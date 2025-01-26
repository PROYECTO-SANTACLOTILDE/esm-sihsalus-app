import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import { useActivePrograms } from '../hooks/useActivePrograms';

export interface MedicationsSummaryProps {
  patient: fhir.Patient;
}

export default function ActiveProgramSummary({ patient }: MedicationsSummaryProps) {
  const { t } = useTranslation();

  // Obtener el UUID del paciente
  const patientUuid = patient.id;

  // Hook para obtener los programas activos
  const { activePrograms, isLoading, error } = useActivePrograms({
    vaccinationProgramConceptSet: 'some-uuid', // Reemplaza con el UUID correcto
  });

  if (isLoading) {
    return <DataTableSkeleton rowCount={3} />;
  }

  if (error) {
    return <ErrorState error={t('errorLoading', 'Error cargando los programas')} headerTitle={''} />;
  }

  if (activePrograms.length === 0) {
    return (
      <EmptyState
        displayText={t('programs', 'Programas')}
        headerTitle={t('noPrograms', 'No hay programas activos')}
        launchForm={() => alert(t('registerNewProgram', 'Registrar un nuevo programa'))}
      />
    );
  }

  return (
    <div>
      <h3>{t('activePrograms', 'Programas Activos')}</h3>
      <p>
        <strong>{t('patientUuid', 'UUID del Paciente')}:</strong> {patientUuid}
      </p>
      <ul>
        {activePrograms.map((program) => (
          <li key={program.uuid}>
            <strong>{t('program', 'Programa')}:</strong> {program.display}
          </li>
        ))}
      </ul>
    </div>
  );
}
