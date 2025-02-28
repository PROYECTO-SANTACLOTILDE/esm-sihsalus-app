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
import { DeliveryForm_UUID } from '../../../utils/constants';
import { AddIcon, usePagination, useConfig } from '@openmrs/esm-framework';
import {
  EmptyState,
  ErrorState,
  PatientChartPagination,
  launchPatientWorkspace,
  CardHeader,
} from '@openmrs/esm-patient-common-lib';
import styles from './newborn-monitoring.scss';
import type { ConfigObject } from '../../../config-schema';
import { useVitalNewBorn } from '../../../hooks/useVitalNewBorn';
import { launchGenericForm } from './utils';
import { useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';

type NewbornMonitoringProps = {
  patientUuid: string;
};

const NewbornBalance: React.FC<NewbornMonitoringProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { vitals, error, isLoading, isValidating, mutate } = useVitalNewBorn(patientUuid);
  const [filter, setFilter] = useState<'All' | 'Recent'>('All');
  const { results: paginatedData, goTo, currentPage } = usePagination(vitals ?? [], 9);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const tableHeaders = useMemo(
    () => [
      { key: 'concept', header: t('concept', 'Concept') },
      { key: 'value', header: t('value', 'Value') },
      { key: 'datetime', header: t('datetime', 'Date & Time') },
      { key: 'interpretation', header: t('interpretation', 'Interpretation') },
    ],
    [t],
  );

  const launchNewbornVitalsAndBiometricsForm = useCallback(() => {
    launchGenericForm(currentVisit, 'newborn-vitals-form');
  }, [currentVisit]);

  const handleFilterChange = ({ selectedItem }: { selectedItem: 'All' | 'Recent' }) => {
    setFilter(selectedItem);
  };

  if (isLoading) return <DataTableSkeleton role="progressbar" compact zebra />;
  if (error)
    return <ErrorState error={error} headerTitle={t('newbornBalanceHeader', 'Signos Vitales del Recién Nacido')} />;

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
          launchForm={launchNewbornVitalsAndBiometricsForm}
        />
      )}
    </div>
  );
};

export default NewbornBalance;
