import React, { useMemo } from 'react';
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
import { ChevronLeft, Add } from '@carbon/react/icons';
import { useImmunizations } from '../../../hooks/useImmunizations';
import { launchWorkspace, useConfig, usePatient, age } from '@openmrs/esm-framework';
import styles from './vaccination-schedule.scss';
import { type ConfigObject } from '../../../config-schema';

// Tipos
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
  months: number; // Edad en meses para cálculos
}

interface VaccinationScheduleProps {
  patientUuid: string;
}

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

// Componente de información del paciente
const PatientInfoTile: React.FC<{
  patientData: { fileNumber: string; age: string; hasAntecedents: string; hasRestrictions: string };
  isLoading: boolean;
  onAddVaccination: () => void;
}> = ({ patientData, isLoading, onAddVaccination }) => {
  const { t } = useTranslation();
  return (
    <Tile className={styles.patientInfoTile}>
      <div className={styles.patientInfoHeader}>
        <div className={styles.patientInfo}>
          <div>
            <p className={styles.infoLabel}>{t('fileNumber', 'Ficha Nro')}:</p>
            <p className={styles.infoValue}>{patientData.fileNumber}</p>
          </div>
          <div>
            <p className={styles.infoLabel}>{t('age', 'Edad')}:</p>
            <p className={styles.infoValue}>{patientData.age}</p>
          </div>
        </div>
        <div className={styles.patientInfoCenter}>
          <p className={styles.infoLabel}>{t('antecedents', 'Antecedentes')}:</p>
          <p className={styles.infoValue}>{patientData.hasAntecedents}</p>
        </div>
        <div className={styles.patientInfoCenter}>
          <p className={styles.infoLabel}>{t('restrictions', 'Restricciones e insumos')}:</p>
          <p className={styles.infoValue}>{patientData.hasRestrictions}</p>
        </div>
        <div className={styles.actionButtons}>
          {isLoading && <InlineLoading description={t('refreshing', 'Actualizando...')} status="active" />}
          <Button onClick={onAddVaccination} kind="ghost" renderIcon={Add}>
            {t('addVaccination', 'Añadir Vacuna')}
          </Button>
        </div>
      </div>
    </Tile>
  );
};

// Componente de leyenda
const LegendTile: React.FC<{ onAddVaccination: () => void }> = ({ onAddVaccination }) => {
  const { t } = useTranslation();
  return (
    <Tile className={styles.legendTile}>
      <div className={styles.legendContainer}>
        <div className={styles.legendItem}>
          <Tag type="blue" size="sm">
            {t('date', 'Fecha')}
          </Tag>
          <span className={styles.legendText}>{t('pending', 'Programada (pendiente de vacunación)')}</span>
        </div>
        <div className={styles.legendItem}>
          <Tag type="red" size="sm">
            {t('date', 'Fecha')}
          </Tag>
          <span className={styles.legendText}>{t('overdue', 'Vacuna atrasada')}</span>
        </div>
        <div className={styles.legendItem}>
          <Tag type="green" size="sm">
            {t('date', 'Fecha')}
          </Tag>
          <span className={styles.legendText}>{t('administered', 'Administrado')}</span>
        </div>
        <div className={styles.legendItem}>
          <Tag type="teal" size="sm">
            {t('date', 'Fecha')}
          </Tag>
          <span className={styles.legendText}>{t('nextDose', 'Próxima dosis a aplicar')}</span>
        </div>
        <div className={styles.legendItem}>
          <Tag type="gray" size="sm">
            {t('notApplicable', 'No Aplica')}
          </Tag>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button kind="tertiary" renderIcon={ChevronLeft} onClick={() => window.history.back()}>
          {t('back', 'REGRESAR')}
        </Button>
        <Button kind="primary" renderIcon={Add} onClick={onAddVaccination}>
          {t('addVaccination', 'AÑADIR VACUNA')}
        </Button>
      </div>
    </Tile>
  );
};

// Función para procesar datos de vacunación
const processVaccinationData = (
  immunizations: any[],
  vaccines: Vaccine[],
  ageRanges: AgeRange[],
  patientAgeInMonths: number,
) => {
  const schema = { ...NATIONAL_VACCINATION_SCHEMA };
  const completedDoses: Record<string, number> = {};

  if (immunizations) {
    immunizations.forEach((immunization) => {
      const vaccine = vaccines.find((v) => v.name === immunization.vaccineName);
      if (!vaccine || !immunization.existingDoses.length) return;

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
  }

  // Determinar overdue y scheduled
  Object.keys(schema).forEach((vaccineId) => {
    const expectedDoses = Object.keys(schema[vaccineId]).length;
    const completed = completedDoses[vaccineId] || 0;
    Object.entries(schema[vaccineId]).forEach(([rangeId, data]) => {
      const range = ageRanges.find((r) => r.id === rangeId);
      if (data.status === 'pending' && patientAgeInMonths > range.months + 1) {
        schema[vaccineId][rangeId].status = 'overdue';
      } else if (data.status === 'pending' && completed < expectedDoses && patientAgeInMonths >= range.months - 1) {
        schema[vaccineId][rangeId].status = 'scheduled';
      }
    });
  });

  return schema;
};

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { patient } = usePatient(patientUuid);
  const { data: immunizations, isLoading, error, mutate } = useImmunizations(patientUuid);

  const patientAge = patient?.birthDate ? age(patient.birthDate) : 'Desconocida';
  const patientAgeInMonths = patient?.birthDate
    ? Math.floor((Date.now() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 8;

  const patientData = {
    fileNumber: '10/01/23',
    age: patientAge,
    hasAntecedents: 'No',
    hasRestrictions: 'No',
  };

  const vaccinationData = useMemo(
    () => processVaccinationData(immunizations || [], VACCINES, AGE_RANGES, patientAgeInMonths),
    [immunizations, patientAgeInMonths],
  );

  const tableRows = useMemo(
    () =>
      VACCINES.map((vaccine) => {
        const row = {
          id: vaccine.id,
          vaccine: (
            <div className={styles.vaccineCell}>
              <span className={styles.vaccineIndicator}></span>
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
            '--'
          );
        });

        return row;
      }),
    [vaccinationData, t],
  );

  const tableHeaders = useMemo(
    () => [
      { key: 'vaccine', header: t('vaccine', 'Vacuna') },
      ...AGE_RANGES.map((range) => ({ key: range.id, header: range.name })),
    ],
    [t],
  );

  const handleAddVaccination = () => {
    launchWorkspace('immunization-form-workspace', {
      patientUuid,
      workspaceTitle: t('addVaccination', 'Añadir Vacuna'),
      mutateForm: mutate,
    });
  };

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Cargando datos de vacunación')} />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>{t('errorLoadingVaccinations', 'Error al cargar el calendario de vacunación')}</h3>
        <p>{error.message}</p>
        <Button onClick={() => mutate()}>{t('tryAgain', 'Intentar de nuevo')}</Button>
      </div>
    );
  }

  return (
    <div className={styles.vaccinationSchedule}>
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <PatientInfoTile patientData={patientData} isLoading={isLoading} onAddVaccination={handleAddVaccination} />
        </Column>
        <Column lg={16} md={8} sm={4}>
          <DataTable
            rows={tableRows}
            headers={tableHeaders}
            render={({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table {...getTableProps()} size="sm" useZebraStyles>
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
        </Column>
        <Column lg={16} md={8} sm={4}>
          <LegendTile onAddVaccination={handleAddVaccination} />
        </Column>
      </Grid>
    </div>
  );
};
// Funciones auxiliares
const getTagType = (status: VaccinationData['status']) => {
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

const getStatusLabel = (status: VaccinationData['status'], t: (key: string, defaultValue: string) => string) => {
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
