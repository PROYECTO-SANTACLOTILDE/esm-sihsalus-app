import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from '@carbon/react';
import styles from './vaccination-schema-chart.scss';

interface VaccinationProps {
  patientUuid: string;
}

export const VaccinationAppointment: React.FC<VaccinationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.vaccinationAppointment}>
      <h3>{t('scheduleVaccination', 'Programar Cita de Vacunación')}</h3>
      <p>{t('selectDateAndTime', 'Selecciona una fecha y hora para la cita')}</p>
      <Button kind="primary">{t('confirmAppointment', 'Confirmar Cita')}</Button>
    </div>
  );
};
