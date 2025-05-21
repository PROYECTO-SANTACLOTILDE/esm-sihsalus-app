import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  DataTableSkeleton,
} from '@carbon/react';
import {
  CardHeader,
  EmptyState,
  ErrorState,
  useVisitOrOfflineVisit,
  launchStartVisitPrompt,
} from '@openmrs/esm-patient-common-lib';
import { launchWorkspace, useLayoutType } from '@openmrs/esm-framework';
import styles from './patient-observation-group-table.scss';

interface DataHookResponse<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate?: () => Promise<any>;
}

export interface ObservationRow {
  id: string;
  category: { content: string };
  value: { content: string };
}

export interface ObservationGroup {
  title: string;
  rows: ObservationRow[];
}

interface PatientObservationGroupTableProps<T> {
  patientUuid: string;
  headerTitle: string;
  displayText: string;
  dataHook: (patientUuid: string) => DataHookResponse<T>;
  groupsConfig: ObservationGroup[];
  formWorkspace?: string;
  onFormLaunch?: (patientUuid: string) => void;
  mutate?: () => void;
}

const PatientObservationGroupTable = <T,>({
  patientUuid,
  headerTitle,
  displayText,
  dataHook,
  groupsConfig,
  formWorkspace,
  onFormLaunch,
}: PatientObservationGroupTableProps<T>) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { data, isLoading, error, mutate } = dataHook(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const launchForm = useCallback(() => {
    try {
      if (!currentVisit) {
        launchStartVisitPrompt();
      } else {
        if (formWorkspace && typeof launchWorkspace === 'function') {
          launchWorkspace(formWorkspace, { patientUuid });
        } else if (onFormLaunch) {
          onFormLaunch(patientUuid);
        }
        if (mutate) {
          setTimeout(() => mutate(), 1000);
        }
      }
    } catch (err) {
      console.error('Failed to launch form:', err);
    }
  }, [patientUuid, currentVisit, formWorkspace, onFormLaunch, mutate]);

  // Listen for esm-form-saved event and call mutate
  React.useEffect(() => {
    if (!mutate) return;
    const handler = () => {
      mutate();
    };
    window.addEventListener('esm-form-saved', handler);
    return () => {
      window.removeEventListener('esm-form-saved', handler);
    };
  }, [mutate]);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (data && data.length > 0) {
    return (
      <div className={styles.widgetCard} role="region" aria-label={headerTitle}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
          {(formWorkspace || onFormLaunch) && (
            <Button onClick={launchForm} kind="ghost">
              {t('edit', 'Edit')}
            </Button>
          )}
        </CardHeader>

        {groupsConfig.map((group) => (
          <div className={styles.widgetCard} style={{ marginBottom: 20 }} key={`table-${group.title}`}>
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
  }

  return (
    <EmptyState
      headerTitle={headerTitle}
      displayText={displayText}
      launchForm={formWorkspace || onFormLaunch ? launchForm : undefined}
    />
  );
};

export default React.memo(PatientObservationGroupTable) as <T>(
  props: PatientObservationGroupTableProps<T>,
) => JSX.Element;
