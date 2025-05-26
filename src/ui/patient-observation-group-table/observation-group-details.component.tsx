import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import styles from './observation-group-details.scss';

export interface ObservationRow {
  id: string;
  category: { content: string };
  value: { content: string };
}

export interface ObservationGroup {
  id: string;
  title: string;
  date: string;
  count: number;
  rows: ObservationRow[];
  encounterUuid: string;
}

interface ObservationGroupDetailsProps {
  group: ObservationGroup;
}

const ObservationGroupDetails: React.FC<ObservationGroupDetailsProps> = ({ group }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.detailsContainer}>
      <DataTable
        rows={group.rows}
        headers={[
          { key: 'category', header: t('observation', 'Observación') },
          { key: 'value', header: t('value', 'Valor') },
        ]}
        size="sm"
        useZebraStyles
      >
        {({ rows, headers, getTableProps, getHeaderProps }) => (
          <TableContainer>
            <Table {...getTableProps()} className={styles.detailsTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}
                      className={header.key === 'category' ? styles.observationColumn : styles.valueColumn}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell, index) => (
                      <TableCell key={cell.id} className={index === 0 ? styles.observationColumn : styles.valueColumn}>
                        {cell.value?.content ?? cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default ObservationGroupDetails;
