import React from 'react';
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  InlineLoading,
} from '@carbon/react';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import styles from './patient-observation-group-table.scss';

export interface ObservationRow {
  id: string;
  category: { content: string };
  value: { content: string };
}

export interface ObservationGroup {
  title: string;
  rows: ObservationRow[];
}

interface PatientObservationGroupTableProps {
  groups: ObservationGroup[];
  isLoading?: boolean;
  onAdd?: () => void;
  mutate?: () => Promise<any>;
  editLabel?: string;
  emptyHeaderTitle?: string;
  emptyDisplayText?: string;
}

const PatientObservationGroupTable: React.FC<PatientObservationGroupTableProps> = ({
  groups,
  isLoading = false,
  onAdd,
  mutate,
  editLabel = 'Editar',
  emptyHeaderTitle = 'Sin datos',
  emptyDisplayText = 'No hay datos disponibles',
}) => {
  const handleAdd = () => {
    if (onAdd) {
      onAdd();
      if (mutate) setTimeout(() => mutate(), 1000);
    }
  };

  if (!groups?.length) {
    return <EmptyState headerTitle={emptyHeaderTitle} displayText={emptyDisplayText} launchForm={onAdd} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 15 }}>
        {onAdd && (
          <Button onClick={handleAdd} kind="ghost">
            {editLabel}
          </Button>
        )}
      </div>
      {groups.map((group) => (
        <div className={styles.widgetCard} style={{ marginBottom: 20 }} key={`table-${group.title}`}>
          <CardHeader title={group.title}>{isLoading && <InlineLoading />}</CardHeader>
          <DataTable
            rows={group.rows}
            headers={[
              { key: 'category', header: 'Categoría' },
              { key: 'value', header: 'Valor' },
            ]}
            isSortable
            size="sm"
            useZebraStyles
          >
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer style={{ width: '100%' }}>
                <Table aria-label={`Tabla de ${group.title}`} {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader key={header.key} {...getHeaderProps({ header, isSortable: header.isSortable })}>
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
      ))}
    </div>
  );
};

export default PatientObservationGroupTable;
