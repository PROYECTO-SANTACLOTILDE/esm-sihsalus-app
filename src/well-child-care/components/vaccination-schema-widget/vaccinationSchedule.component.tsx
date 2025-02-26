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

export const VaccinationSchedule: React.FC<VaccinationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headers = [
    { key: 'vaccine', header: t('vaccine', 'Vacuna') },
    { key: 'dose', header: t('dose', 'Dosis') },
    { key: 'date', header: t('date', 'Fecha Programada') },
    { key: 'status', header: t('status', 'Estado') },
  ];

  const rows = [
    { id: '1', vaccine: 'BCG', dose: 'Única', date: '2025-02-10', status: 'Pendiente' },
    { id: '2', vaccine: 'Hepatitis B', dose: '1ra', date: '2025-02-15', status: 'Aplicada' },
  ];

  return (
    <div className={styles.vaccinationSchedule}>
      <h3>{t('vaccinationSchedule', 'Calendario de Vacunación')}</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader key={header.key}>{header.header}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.vaccine}</TableCell>
                <TableCell>{row.dose}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
