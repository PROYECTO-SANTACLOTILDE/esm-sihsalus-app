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
import { newbornDayPeriodSlots } from '../../utils/constants';
import { useVitalNewBorn } from '../../hooks/useVitalNewBorn';

type NewbornMonitoringProps = {
  patientUuid: string;
};

const NewbornMonitoring: React.FC<NewbornMonitoringProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { results: paginatedData, goTo, currentPage } = usePagination([], 9);
  const { vitals, error, isLoading, isValidating } = useVitalNewBorn(patientUuid);
  const [filter, setFilter] = useState<'All' | 'Recent'>('All');

  const tableRows = useMemo(
    () =>
      vitals?.map((vital, index) => ({
        ...vital,
        id: `${index}`,
        weight: vital.weight ?? '--',
        depositionsCount: vital.depositionsCount ?? '--',
        urinationCount: vital.urinationCount ?? '--',
        vomitCount: vital.vomitCount ?? '--',
      })),
    [vitals],
  );

  const tableHeaders = useMemo(
    () => [
      { key: 'weight', header: t('weight', 'Weight') },
      { key: 'depositionsCount', header: t('depositionsCount', 'Depositions Count') },
      { key: 'urinationCount', header: t('urinationCount', 'Urination Count') },
      { key: 'vomitCount', header: t('vomitCount', 'Vomit Count') },
    ],
    [t],
  );

  const handleAddObservation = useCallback(() => {
    launchPatientWorkspace('newborn-monitoring-form', {
      workspaceTitle: t('newbornMonitoringForm', 'Newborn Balance Record'),
      additionalProps: { patientUuid },
    });
  }, [patientUuid, t]);

  const handleFilterChange = ({ selectedItem }) => setFilter(selectedItem);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact zebra />;
  if (error) return <ErrorState error={error} headerTitle={t('newbornBalanceHeader', 'Newborn Balance')} />;

  if (vitals?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={t('newbornBalanceHeader', 'Newborn Balance')}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
          <div className={styles.rightMostFlexContainer}>
            <Dropdown
              id="filterDropdown"
              initialSelectedItem="All"
              label=""
              titleText={t('show', 'Show') + ':'}
              type="inline"
              items={['All', 'Recent']}
              onChange={handleFilterChange}
              size="sm"
            />
            <Button kind="ghost" onClick={handleAddObservation}>
              {t('addObservations', 'Add Observations')}
            </Button>
          </div>
        </CardHeader>

        {tableRows?.length ? (
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
                {tableRows.map((row) => (
                  <TableRow key={row.id}>
                    {tableHeaders.map((header) => (
                      <TableCell key={header.key}>{row[header.key]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            displayText={t('noData', 'No data available')}
            headerTitle={t('newbornBalanceHeader', 'Newborn Balance')}
            launchForm={handleAddObservation}
          />
        )}

        <PatientChartPagination
          currentItems={tableRows?.length ?? 0}
          onPageNumberChange={({ page }) => goTo(page)}
          pageNumber={currentPage}
          pageSize={9}
          totalItems={tableRows?.length ?? 0}
        />
      </div>
    );
  }

  return (
    <EmptyState
      displayText={t('noData', 'No data available')}
      headerTitle={t('newbornBalanceHeader', 'Newborn Balance')}
      launchForm={handleAddObservation}
    />
  );
};

export default NewbornMonitoring;
