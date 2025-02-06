import React from 'react';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import styles from './vaccinationScheduleTable.style.scss';

const headers = [
  { key: 'age', header: 'Edad' },
  { key: 'vaccines', header: 'Vacunas' },
];

const rows = [
  { id: '1', age: '2 meses', vaccines: 'BCG, Hepatitis B' },
  { id: '2', age: '4 meses', vaccines: 'Pentavalente, Polio, Rotavirus' },
  { id: '3', age: '6 meses', vaccines: 'Pentavalente, Polio, Rotavirus' },
  { id: '4', age: '12 meses', vaccines: 'SPR (sarampión, paperas, rubéola)' },
  { id: '5', age: '18 meses', vaccines: 'Refuerzo SPR, Polio, DPT' },
  { id: '6', age: '4 años', vaccines: 'Refuerzo Polio, DPT' },
];

const VaccinationScheduleTable: React.FC = () => {
  return (
    <div className={styles.vaccinationTableContainer}>
      <h2>Esquema Regular de Vacunación</h2>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </div>
  );
};

export default VaccinationScheduleTable;
