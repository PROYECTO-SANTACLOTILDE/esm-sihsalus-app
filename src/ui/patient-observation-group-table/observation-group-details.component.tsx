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
    <div style={{ padding: '1rem', backgroundColor: '#f4f4f4' }}>
      <DataTable
        rows={group.rows}
        headers={[
          { key: 'category', header: t('category', 'Categoría') },
          { key: 'value', header: t('value', 'Valor') },
        ]}
        size="sm"
        useZebraStyles
      >
        {({ rows, headers, getTableProps, getHeaderProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
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
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
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
