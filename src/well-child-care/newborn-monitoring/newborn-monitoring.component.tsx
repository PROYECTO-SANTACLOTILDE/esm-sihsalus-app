import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTableSkeleton,
  Dropdown,
  InlineLoading,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { AddIcon, usePagination, useConfig } from '@openmrs/esm-framework';
import {
  EmptyState,
  ErrorState,
  PatientChartPagination,
  launchPatientWorkspace,
  CardHeader,
} from '@openmrs/esm-patient-common-lib';
import styles from './newborn-monitoring.scss';
import type { ConfigObject } from '../../config-schema';
import { useVitalNewBorn } from '../../hooks/useVitalNewBorn';

type NewbornMonitoringProps = {
  patientUuid: string;
};

const NewbornMonitoring: React.FC<NewbornMonitoringProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { vitals, error, isLoading, isValidating } = useVitalNewBorn(patientUuid);
  const [filter, setFilter] = useState<'All' | 'Recent'>('All');
  const { results: paginatedData, goTo, currentPage } = usePagination(vitals ?? [], 9);

  const tableHeaders = useMemo(
    () => [
      { key: 'concept', header: t('concept', 'Concept') },
      { key: 'value', header: t('value', 'Value') },
      { key: 'datetime', header: t('datetime', 'Date & Time') },
      { key: 'interpretation', header: t('interpretation', 'Interpretation') },
    ],
    [t],
  );

  const handleAddObservation = useCallback(() => {
    launchPatientWorkspace('clinical-forms-workspace', {
      workspaceTitle: t('newbornMonitoringForm', 'Newborn Balance Record'),
      additionalProps: { patientUuid },
    });
  }, [patientUuid, t]);

  const handleFilterChange = ({ selectedItem }: { selectedItem: 'All' | 'Recent' }) => {
    setFilter(selectedItem);
  };

  if (isLoading) return <DataTableSkeleton role="progressbar" compact zebra />;
  if (error) return <ErrorState error={error} headerTitle={t('newbornBalanceHeader', 'Newborn Balance')} />;

  return (
    <div className={styles.widgetCard}>
      {vitals?.length > 0 ? (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHeader key={header.key}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((vital) => (
                  <TableRow key={vital.id}>
                    {tableHeaders.map((header) => (
                      <TableCell key={header.key}>{vital[header.key]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PatientChartPagination
            currentItems={paginatedData.length}
            onPageNumberChange={({ page }) => goTo(page)}
            pageNumber={currentPage}
            pageSize={9}
            totalItems={vitals.length}
          />
        </>
      ) : (
        <EmptyState
          displayText={t('noData', 'No data available')}
          headerTitle={t('newbornBalanceHeader', 'Newborn Balance')}
          launchForm={handleAddObservation}
        />
      )}
    </div>
  );
};

export default NewbornMonitoring;
