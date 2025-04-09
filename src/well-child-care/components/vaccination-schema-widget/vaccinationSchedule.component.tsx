import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Grid,
  Column,
  Tile,
  InlineLoading,
} from '@carbon/react';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { ChevronLeft, Add } from '@carbon/react/icons';
import { useImmunizations } from '../../../hooks/useImmunizations';
import { launchWorkspace, useConfig, usePatient, age } from '@openmrs/esm-framework';
import styles from './vaccination-schedule.scss';
import { type ConfigObject } from '../../../config-schema';

// Types (unchanged)
interface VaccinationData {
  status: 'pending' | 'completed' | 'overdue' | 'scheduled' | 'not-applicable';
  date: string;
}

interface VaccineData {
  [ageRange: string]: VaccinationData;
}

interface Vaccine {
  id: string;
  name: string;
}

interface AgeRange {
  id: string;
  name: string;
  months: number;
}

interface VaccinationScheduleProps {
  patientUuid: string;
}

// Constants (unchanged)
// Esquema nacional predefinido
const NATIONAL_VACCINATION_SCHEMA: Record<string, Record<string, VaccinationData>> = {
  hib: { rn: { status: 'pending', date: '' } },
  bcg: { rn: { status: 'pending', date: '' } },
  pentavalent: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '6m': { status: 'pending', date: '' },
  },
  polio: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '6m': { status: 'pending', date: '' },
  },
  rotavirus: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
  },
  neumo: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '12m': { status: 'pending', date: '' },
  },
  influenza_p: {
    '6m': { status: 'pending', date: '' },
    '12m': { status: 'pending', date: '' },
  },
  srp: { '12m': { status: 'pending', date: '' } },
  varicela: { '12m': { status: 'pending', date: '' } },
};

// Rangos de edad
const AGE_RANGES: AgeRange[] = [
  { id: 'rn', name: 'R.N.', months: 0 },
  { id: '2m', name: '2 meses', months: 2 },
  { id: '4m', name: '4 meses', months: 4 },
  { id: '6m', name: '6 meses', months: 6 },
  { id: '12m', name: '12 meses', months: 12 },
  { id: '18m', name: '18 meses', months: 18 },
];

// Vacunas
const VACCINES: Vaccine[] = [
  { id: 'hib', name: 'HiB RN' },
  { id: 'bcg', name: 'BCG' },
  { id: 'pentavalent', name: 'Pentavalente (DPT, HB, Hib)' },
  { id: 'polio', name: 'Polio' },
  { id: 'rotavirus', name: 'Rotavirus' },
  { id: 'neumo', name: 'Neumococo' },
  { id: 'influenza_p', name: 'Influenza pediátrica' },
  { id: 'srp', name: 'SPR' },
  { id: 'varicela', name: 'Varicela' },
];

// LegendTile Component with improvements
const LegendTile: React.FC<{ onAddVaccination: () => void }> = ({ onAddVaccination }) => {
  const { t } = useTranslation();
  const legendItems = [
    { type: 'blue', text: 'pending', label: 'Programada (pendiente de vacunación)' },
    { type: 'red', text: 'overdue', label: 'Vacuna atrasada' },
    { type: 'green', text: 'administered', label: 'Administrado' },
    { type: 'teal', text: 'nextDose', label: 'Próxima dosis a aplicar' },
    { type: 'gray', text: 'notApplicable', label: 'No Aplica' },
  ];

  return (
    <Tile className={styles.legendTile} aria-label={t('legend', 'Legend')}>
      <h3 className={styles.legendTitle}>{t('legend', 'Leyenda')}</h3>
      <div className={styles.legendContainer}>
        {legendItems.map((item) => (
          <div key={item.type} className={styles.legendItem}>
            <Tag type={item.type} size="sm" aria-label={t(item.text, item.label)}>
              {t(item.text, item.label)}
            </Tag>
          </div>
        ))}
      </div>
      <Button kind="primary" renderIcon={Add} onClick={onAddVaccination} className={styles.addButton}>
        {t('addVaccination', 'Añadir Vacuna')}
      </Button>
    </Tile>
  );
};

// Improved processVaccinationData function with better type safety
const processVaccinationData = (
  immunizations: any[] | null,
  vaccines: Vaccine[],
  ageRanges: AgeRange[],
  patientAgeInMonths: number,
): Record<string, Record<string, VaccinationData>> => {
  const schema = JSON.parse(JSON.stringify(NATIONAL_VACCINATION_SCHEMA));
  const completedDoses: Record<string, number> = {};

  immunizations?.forEach((immunization) => {
    const vaccine = vaccines.find((v) => v.name === immunization.vaccineName);
    if (!vaccine || !immunization.existingDoses?.length) return;

    const dose = immunization.existingDoses[0];
    const date = new Date(dose.occurrenceDateTime);
    const ageAtDose = Math.floor(
      (date.getTime() - new Date(immunization.patientBirthDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    const ageRange = ageRanges.find((range) => Math.abs(ageAtDose - range.months) <= 1)?.id || 'rn';

    if (schema[vaccine.id]?.[ageRange]) {
      schema[vaccine.id][ageRange] = {
        status: 'completed',
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      };
      completedDoses[vaccine.id] = (completedDoses[vaccine.id] || 0) + 1;
    }
  });

  Object.keys(schema).forEach((vaccineId) => {
    const expectedDoses = Object.keys(schema[vaccineId]).length;
    const completed = completedDoses[vaccineId] || 0;
    Object.entries<VaccinationData>(schema[vaccineId]).forEach(([rangeId, data]) => {
      const range = ageRanges.find((r) => r.id === rangeId);
      if (!range) return;

      if (data.status === 'pending' && patientAgeInMonths > range.months + 1) {
        schema[vaccineId][rangeId].status = 'overdue';
      } else if (data.status === 'pending' && completed < expectedDoses && patientAgeInMonths >= range.months - 1) {
        schema[vaccineId][rangeId].status = 'scheduled';
      }
    });
  });

  return schema;
};

// Main Component with improvements
const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { patient } = usePatient(patientUuid);
  const { data: immunizations, isLoading, error, mutate } = useImmunizations(patientUuid);

  const patientAge = patient?.birthDate ? age(patient.birthDate) : t('unknown', 'Desconocida');
  const patientAgeInMonths = patient?.birthDate
    ? Math.floor((Date.now() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 8;

  const vaccinationData = useMemo(
    () => processVaccinationData(immunizations, VACCINES, AGE_RANGES, patientAgeInMonths),
    [immunizations, patientAgeInMonths],
  );

  const tableHeaders = useMemo(
    () => [
      { key: 'vaccine', header: t('vaccine', 'Vacuna') },
      ...AGE_RANGES.map((range) => ({ key: range.id, header: range.name })),
    ],
    [t],
  );

  const tableRows = useMemo(
    () =>
      VACCINES.map((vaccine) => {
        const row: Record<string, React.ReactNode> = {
          id: vaccine.id,
          vaccine: (
            <div className={styles.vaccineCell}>
              <span className={styles.vaccineIndicator} aria-hidden="true" />
              <span>{vaccine.name}</span>
            </div>
          ),
        };

        AGE_RANGES.forEach((range) => {
          const vaccineData = vaccinationData[vaccine.id]?.[range.id];
          row[range.id] = vaccineData ? (
            <Tag
              type={getTagType(vaccineData.status)}
              size="sm"
              title={getStatusLabel(vaccineData.status, t)}
              className={styles.vaccineStatusTag}
            >
              {vaccineData.date || '--'}
            </Tag>
          ) : (
            <span aria-label={t('notApplicable', 'No Aplica')}>--</span>
          );
        });

        return row;
      }),
    [vaccinationData, t],
  );

  const handleAddVaccination = useCallback(() => {
    launchWorkspace('immunization-form-workspace', {
      patientUuid,
      workspaceTitle: t('addVaccination', 'Añadir Vacuna'),
      mutateForm: mutate,
    });
  }, [patientUuid, t, mutate]);

  if (isLoading) {
    return (
      <DataTableSkeleton
        role="progressbar"
        aria-label={t('loadingData', 'Cargando datos de vacunación')}
        headers={tableHeaders}
      />
    );
  }

  if (error) {
    return (
      <Tile className={styles.errorContainer}>
        <h3>{t('errorLoadingVaccinations', 'Error al cargar el calendario de vacunación')}</h3>
        <p>{error.message}</p>
        <Button onClick={() => mutate()} kind="primary">
          {t('tryAgain', 'Intentar de nuevo')}
        </Button>
      </Tile>
    );
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('vaccinationSchedule', 'Calendario de Vacunación')}>
        <Button
          kind="ghost"
          renderIcon={Add}
          onClick={handleAddVaccination}
          aria-label={t('updateVaccinations', 'Actualizar vacunas')}
        >
          {t('update', 'Actualizar')}
        </Button>
      </CardHeader>
      <DataTable
        rows={tableRows}
        headers={tableHeaders}
        size="sm"
        useZebraStyles
        render={({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()} aria-label={t('vaccinationTable', 'Tabla de vacunaciones')}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} isSortable={false}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    </div>
  );
};

// Helper functions (unchanged except for typo fix)
const getTagType = (status: VaccinationData['status']): string => {
  switch (status) {
    case 'pending':
      return 'blue';
    case 'completed':
      return 'green';
    case 'overdue':
      return 'red';
    case 'scheduled':
      return 'teal';
    case 'not-applicable':
      return 'gray';
    default:
      return 'gray';
  }
};

const getStatusLabel = (
  status: VaccinationData['status'],
  t: (key: string, defaultValue: string) => string,
): string => {
  const statusLabels = {
    pending: t('pending', 'Programada'),
    completed: t('completed', 'Administrado'),
    overdue: t('overdue', 'Atrasada'),
    scheduled: t('scheduled', 'Próxima dosis'),
    'not-applicable': t('notApplicable', 'No aplica'),
  };
  return statusLabels[status] || status;
};

export default VaccinationSchedule;
