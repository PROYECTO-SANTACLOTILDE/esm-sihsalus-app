import React, { useCallback, useMemo } from 'react';
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
import {
  CardHeader,
  EmptyState,
  ErrorState,
  usePaginationInfo,
  PatientChartPagination,
} from '@openmrs/esm-patient-common-lib';
import {
  launchWorkspace,
  useLayoutType,
  usePagination,
  formatDate,
  parseDate,
  isOmrsDateStrict,
} from '@openmrs/esm-framework';
import styles from './patient-summary-table.scss';

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
  pageSize?: number; // Tamaño inicial de página
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

    return data.flatMap((item, index) =>
      rowConfig.map(({ id, label, dataKey, defaultValue = 'N/A' }) => {
        const rawValue = item[dataKey as keyof T];
        const dateValue = item['date' as keyof T] || item['encounterDatetime' as keyof T]; // Ajusta según el campo real
        let value: string;
        let date: string;

        const isDateLike = (val: any): boolean => {
          if (!val) return false;
          const strVal = String(val);
          if (isOmrsDateStrict(strVal)) return true;
          try {
            const parsed = parseDate(strVal);
            return !isNaN(parsed.getTime());
          } catch (e) {
            return false;
          }
        };

        if (rawValue && typeof rawValue === 'object' && 'display' in rawValue) {
          value = (rawValue as { display: string }).display;
        } else if (Array.isArray(rawValue)) {
          value = rawValue.join(', ');
        } else if (rawValue !== undefined && rawValue !== null) {
          const strValue = String(rawValue);
          if (isDateLike(rawValue)) {
            value = formatDate(parseDate(strValue), { mode: 'wide', time: true });
          } else {
            value = strValue;
          }
        } else {
          value = defaultValue;
        }

        if (dateValue && isDateLike(dateValue)) {
          date = formatDate(parseDate(String(dateValue)), { mode: 'wide', time: true });
        } else {
          date = 'N/A';
        }

        return {
          id: `${id}-${index}`,
          label: t(id, label),
          value,
          date, // Nueva propiedad para la fecha
        };
      }),
    );
  }, [data, rowConfig, t]);

  const { results: paginatedData, goTo, currentPage } = usePagination(tableRows, pageSize);

  const { pageSizes } = usePaginationInfo(pageSize, tableRows.length, currentPage, paginatedData.length);

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
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              onClick={launchForm}
              aria-label={t('update')}
            >
              {t('update')}
            </Button>
          )}
        </CardHeader>
        <DataTable
          rows={paginatedData}
          headers={[
            { key: 'label', header: t('field') },
            { key: 'value', header: t('value') },
            { key: 'date', header: t('lastUpdated', 'Last Updated') }, // Nueva columna
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
        {tableRows.length > pageSize && (
          <PatientChartPagination
            pageNumber={currentPage}
            totalItems={tableRows.length}
            currentItems={paginatedData.length}
            pageSize={pageSize}
            onPageNumberChange={({ page }) => goTo(page)}
          />
        )}
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
