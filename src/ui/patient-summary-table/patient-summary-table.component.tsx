import React, { useCallback, useMemo, useState, ReactNode } from 'react';
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
  Pagination,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, usePaginationInfo } from '@openmrs/esm-patient-common-lib';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';

import { launchWorkspace, useLayoutType, usePagination } from '@openmrs/esm-framework';
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
  pageSize?: number; // Nueva prop para tamaño inicial de página
}

/**
 * A reusable table component for displaying patient summary data in a card format with pagination.
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
  pageSize = 10,
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
    if (!data || data.length === 0) return [];

    // Mapear todos los datos, no solo el primero
    return data.flatMap((item, index) =>
      rowConfig.map(({ id, label, dataKey, defaultValue = 'N/A' }) => {
        const rawValue = item[dataKey as keyof T];
        let value: string;

        if (rawValue && typeof rawValue === 'object' && 'display' in rawValue) {
          value = (rawValue as { display: string }).display;
        } else if (Array.isArray(rawValue)) {
          value = rawValue.join(', ');
        } else if (rawValue !== undefined && rawValue !== null) {
          value = String(rawValue);
        } else {
          value = defaultValue;
        }

        return {
          id: `${id}-${index}`, // ID único por fila y entrada
          label: t(id, label),
          value,
        };
      }),
    );
  }, [data, rowConfig, t]);

  // Usar usePagination para manejar las filas paginadas
  const { results: paginatedData, goTo, currentPage } = usePagination(tableRows, pageSize);

  // Usar usePaginationInfo para obtener información adicional de paginación
  const { pageSizes } = usePaginationInfo(pageSize, tableRows.length, currentPage, paginatedData.length);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (data && data.length > 0) {
    return (
      <div className={`${styles.widgetCard} ${className || ''}`} role="region" aria-label={headerTitle}>
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
          rows={paginatedData}
          headers={[
            { key: 'label', header: t(headers[0]) },
            { key: 'value', header: t(headers[1]) },
          ]}
          size={isTablet ? 'lg' : 'sm'}
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
        <PatientChartPagination
          pageNumber={currentPage}
          totalItems={tableRows.length}
          currentItems={paginatedData.length}
          pageSize={pageSize}
          onPageNumberChange={({ page }) => goTo(page)}
        />
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
