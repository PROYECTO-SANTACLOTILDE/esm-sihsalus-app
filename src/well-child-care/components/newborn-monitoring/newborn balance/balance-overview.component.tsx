import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Add, Analytics, Table } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { formatDate, parseDate, useConfig, useLayoutType } from '@openmrs/esm-framework';
import type { ConfigObject } from '../../../../config-schema';
import { launchGenericForm } from '../utils';
import { useVitalsAndBiometrics, useVitalsConceptMetadata, withUnit } from '../../../common';
import type { BalanceTableHeader, BalanceTableRow } from './types';
import PaginatedBalance from './paginated-balance.component';
import BalanceChart from './balance-chart.component';
import styles from './balance-overview.scss';

interface BalanceOverviewProps {
  patientUuid: string;
  pageSize: number;
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({ patientUuid, pageSize }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const headerTitle = t('balanceOverview', 'Balance de Líquidos del Recién Nacido');
  const [chartView, setChartView] = useState(false);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const isTablet = useLayoutType() === 'tablet';

  const { data: balanceData, error, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid);
  const { data: conceptUnits } = useVitalsConceptMetadata();

  const launchBalanceForm = useCallback(() => {
    launchGenericForm(currentVisit, 'newborn-fluid-balance-form');
  }, [currentVisit]);

  const tableHeaders: Array<BalanceTableHeader> = [
    {
      key: 'dateRender',
      header: t('dateAndTime', 'Fecha y Hora'),
      isSortable: true,
      sortFunc: (valueA, valueB) => new Date(valueA.date).getTime() - new Date(valueB.date).getTime(),
    },
    {
      key: 'stoolCountRender',
      header: withUnit(t('stoolCount', 'Deposiciones (N°)'), conceptUnits.get(config.concepts.stoolCountUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.stoolCount && valueB.stoolCount ? valueA.stoolCount - valueB.stoolCount : 0,
    },
    {
      key: 'stoolGramsRender',
      header: withUnit(t('stoolGrams', 'Deposiciones (g)'), conceptUnits.get(config.concepts.stoolGramsUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.stoolGrams && valueB.stoolGrams ? valueA.stoolGrams - valueB.stoolGrams : 0,
    },
    {
      key: 'urineCountRender',
      header: withUnit(t('urineCount', 'Micciones (N°)'), conceptUnits.get(config.concepts.urineCountUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.urineCount && valueB.urineCount ? valueA.urineCount - valueB.urineCount : 0,
    },
    {
      key: 'urineGramsRender',
      header: withUnit(t('urineGrams', 'Orina (g/mL)'), conceptUnits.get(config.concepts.urineGramsUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.urineGrams && valueB.urineGrams ? valueA.urineGrams - valueB.urineGrams : 0,
    },
    {
      key: 'vomitCountRender',
      header: withUnit(t('vomitCount', 'Vómito (N°)'), conceptUnits.get(config.concepts.vomitCountUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.vomitCount && valueB.vomitCount ? valueA.vomitCount - valueB.vomitCount : 0,
    },
    {
      key: 'vomitGramsMLRender',
      header: withUnit(t('vomitGramsML', 'Vómito (g/mL)'), conceptUnits.get(config.concepts.vomitGramsMLUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.vomitGramsML && valueB.vomitGramsML ? valueA.vomitGramsML - valueB.vomitGramsML : 0,
    },
  ];

  const tableRows: Array<BalanceTableRow> = useMemo(
    () =>
      balanceData?.map((balance, index) => ({
        ...balance,
        id: `${index}`,
        dateRender: formatDate(parseDate(balance.date.toString()), { mode: 'wide', time: true }),
        stoolCountRender: balance.stoolCount ?? '--',
        stoolGramsRender: balance.stoolGrams ?? '--',
        urineCountRender: balance.urineCount ?? '--',
        urineGramsRender: balance.urineGrams ?? '--',
        vomitCountRender: balance.vomitCount ?? '--',
        vomitGramsMLRender: balance.vomitGramsML ?? '--',
      })),
    [balanceData],
  );

  return (
    <>
      {(() => {
        if (isLoading) return <DataTableSkeleton role="progressbar" compact={!isTablet} zebra />;
        if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
        if (balanceData?.length) {
          return (
            <div className={styles.widgetCard}>
              <CardHeader title={headerTitle}>
                <div className={styles.backgroundDataFetchingIndicator}>
                  <span>{isValidating ? <InlineLoading /> : null}</span>
                </div>
                <div className={styles.balanceHeaderActionItems}>
                  <ContentSwitcher
                    onChange={(evt) => setChartView(evt.name === 'chartView')}
                    size={isTablet ? 'md' : 'sm'}
                  >
                    <IconSwitch name="tableView" text="Vista de Tabla">
                      <Table size={16} />
                    </IconSwitch>
                    <IconSwitch name="chartView" text="Vista Gráfica">
                      <Analytics size={16} />
                    </IconSwitch>
                  </ContentSwitcher>
                  <Button kind="ghost" renderIcon={Add} iconDescription="Agregar balance" onClick={launchBalanceForm}>
                    {t('add', 'Agregar')}
                  </Button>
                </div>
              </CardHeader>
              {chartView ? (
                <BalanceChart patientBalance={balanceData} conceptUnits={conceptUnits} config={config} />
              ) : (
                <PaginatedBalance tableRows={tableRows} pageSize={pageSize} tableHeaders={tableHeaders} />
              )}
            </div>
          );
        }
        return (
          <EmptyState
            displayText={t('balanceOverview', 'Balance de Líquidos')}
            headerTitle={headerTitle}
            launchForm={launchBalanceForm}
          />
        );
      })()}
    </>
  );
};

export default BalanceOverview;
