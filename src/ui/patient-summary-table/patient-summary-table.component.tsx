import React, { useCallback, useMemo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import { launchWorkspace, useLayoutType } from '@openmrs/esm-framework';
import styles from './patient-summary-table.scss';

// Tipar la respuesta del dataHook
interface DataHookResponse<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate?: () => Promise<any>;
}

interface RowConfig {
  id: string;
  label: string;
  dataKey: string;
  defaultValue?: string;
}

interface PatientSummaryTableProps<T> {
  patientUuid: string;
  headerTitle: string;
  displayText: string;
  dataHook: (patientUuid: string) => DataHookResponse<T>;
  rowConfig: RowConfig[];
  formWorkspace?: string;
  onFormLaunch?: (patientUuid: string) => void;
  headers?: [string, string];
  actionButtonText?: string;
  actionButtonIcon?: ReactNode;
  className?: string;
}

/**
 * A reusable table component for displaying patient summary data in a card format.
 * @template T - The shape of the data returned by the dataHook
 */
const PatientSummaryTable = <T,>({
  patientUuid,
  headerTitle,
  displayText,
  dataHook,
  rowConfig,
  formWorkspace,
  onFormLaunch,
  headers = ['field', 'value'],
  actionButtonText = 'update',
  actionButtonIcon = <Add size={16} />,
  className,
}: PatientSummaryTableProps<T>) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { data, isLoading, error, mutate } = dataHook(patientUuid);

  const launchForm = useCallback(() => {
    try {
      if (formWorkspace && typeof launchWorkspace === 'function') {
        launchWorkspace(formWorkspace, { patientUuid });
      } else if (onFormLaunch) {
        onFormLaunch(patientUuid);
      }
      if (mutate) {
        setTimeout(() => mutate(), 1000);
      }
    } catch (err) {
      console.error('Failed to launch form:', err);
    }
  }, [patientUuid, formWorkspace, onFormLaunch, mutate]);

  const tableRows = useMemo(() => {
    console.log('Data received in PatientSummaryTable:', data);

    if (!data || data.length === 0) return [];

    const latestData = data[0];
    return rowConfig.map(({ id, label, dataKey, defaultValue = 'N/A' }) => {
      const rawValue = latestData[dataKey as keyof T];
      // Manejar valores que sean objetos (e.g., { uuid, display, name })
      const value =
        rawValue && typeof rawValue === 'object' && 'display' in rawValue
          ? (rawValue as { display: string }).display
          : rawValue !== undefined && rawValue !== null
            ? String(rawValue)
            : defaultValue;
      return {
        id,
        label: t(id, label),
        value,
      };
    });
  }, [data, rowConfig, t]);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (data && data.length > 0) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
          {(formWorkspace || onFormLaunch) && (
            <Button
              kind="ghost"
              renderIcon={(props) => actionButtonIcon && React.cloneElement(actionButtonIcon as any, props)}
              onClick={launchForm}
              aria-label={t(actionButtonText)}
            >
              {t(actionButtonText)}
            </Button>
          )}
        </CardHeader>
        <DataTable
          rows={tableRows}
          headers={[
            { key: 'label', header: t(headers[0]) },
            { key: 'value', header: t(headers[1]) },
          ]}
          size="sm"
          useZebraStyles
        >
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()} aria-label={t('dataTable', 'Data table')}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
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
        </DataTable>
      </div>
    );
  }

  return (
    <EmptyState
      displayText={displayText}
      headerTitle={headerTitle}
      launchForm={formWorkspace || onFormLaunch ? launchForm : undefined}
    />
  );
};

export default React.memo(PatientSummaryTable) as <T>(props: PatientSummaryTableProps<T>) => JSX.Element;
