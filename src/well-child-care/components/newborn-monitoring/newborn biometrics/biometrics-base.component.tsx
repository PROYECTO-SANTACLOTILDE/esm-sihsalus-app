import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Add, Analytics, Table } from '@carbon/react/icons';
import { launchWorkspace, formatDatetime, parseDate, useConfig, useLayoutType } from '@openmrs/esm-framework';
import {
  launchStartVisitPrompt,
  CardHeader,
  EmptyState,
  ErrorState,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import { useVitalsConceptMetadata, useVitalsAndBiometrics, withUnit } from '../../../common';
import type { ConfigObject } from '../../../../config-schema';
import BiometricsChart from './biometrics-chart.component';
import PaginatedBiometrics from './paginated-biometrics.component';
import type { BiometricsTableHeader, BiometricsTableRow } from './types';
import styles from './biometrics-base.scss';

interface BiometricsBaseProps {
  pageSize: number;
  patientUuid: string;
}

const NewbornBiometricsBase: React.FC<BiometricsBaseProps> = ({ patientUuid, pageSize = 10 }) => {
  const { t } = useTranslation();
  const displayText = t('biometrics_lower', 'biometrics');
  const headerTitle = t('newbornAntropometrics', 'Somatrometría');
  const [chartView, setChartView] = useState(false);
  const isTablet = useLayoutType() === 'tablet';

  const config = useConfig<ConfigObject>();
  const { data: biometrics, isLoading, error, isValidating } = useVitalsAndBiometrics(patientUuid, 'biometrics');
  const { data: conceptUnits } = useVitalsConceptMetadata();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const launchBalanceForm = useCallback(() => {
    if (!currentVisit) {
      launchStartVisitPrompt();
      return;
    }

    launchWorkspace('newborn-balance-form', { patientUuid });
  }, [currentVisit, patientUuid]);

  const tableHeaders: Array<BiometricsTableHeader> = [
    {
      key: 'dateRender',
      header: t('dateAndTime', 'Date and time'),
      isSortable: true,
      sortFunc: (valueA, valueB) => new Date(valueA.date).getTime() - new Date(valueB.date).getTime(),
    },
    {
      key: 'weightRender',
      header: withUnit(t('weight', 'Weight'), conceptUnits.get(config.concepts.weightUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) => (valueA.weight && valueB.weight ? valueA.weight - valueB.weight : 0),
    },
    {
      key: 'heightRender',
      header: withUnit(t('height', 'Height'), conceptUnits.get(config.concepts.heightUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) => (valueA.height && valueB.height ? valueA.height - valueB.height : 0),
    },
    {
      key: 'headCircumferenceRender',
      header: withUnit(
        t('headCircumference', 'Head Circumference'),
        conceptUnits.get(config.concepts.headCircumferenceUuid) ?? '',
      ),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.headCircumference && valueB.headCircumference ? valueA.headCircumference - valueB.headCircumference : 0,
    },
    {
      key: 'chestCircumferenceRender',
      header: withUnit(
        t('chestCircumference', 'Chest Circumference'),
        conceptUnits.get(config.concepts.chestCircumferenceUuid) ?? '',
      ),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.chestCircumference && valueB.chestCircumference
          ? valueA.chestCircumference - valueB.chestCircumference
          : 0,
    },
  ];

  const tableRows: Array<BiometricsTableRow> = useMemo(
    () =>
      biometrics?.map((biometricsData, index) => {
        return {
          ...biometricsData,
          id: `${index}`,
          dateRender: formatDatetime(parseDate(biometricsData.date.toString()), { mode: 'wide' }),
          weightRender: biometricsData.weight ?? '--',
          heightRender: biometricsData.height ?? '--',
          headCircumferenceRender: biometricsData.headCircumference ?? '--',
          chestCircumferenceRender: biometricsData.chestCircumference ?? '--',
        };
      }),
    [biometrics],
  );

  if (isLoading) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (biometrics?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <div className={styles.backgroundDataFetchingIndicator}>
            <span>{isValidating ? <InlineLoading /> : null}</span>
          </div>
          <div className={styles.biometricsHeaderActionItems}>
            <ContentSwitcher onChange={(evt) => setChartView(evt.name === 'chartView')} size={isTablet ? 'md' : 'sm'}>
              <IconSwitch name="tableView" text="Table view">
                <Table size={16} />
              </IconSwitch>
              <IconSwitch name="chartView" text="Chart view">
                <Analytics size={16} />
              </IconSwitch>
            </ContentSwitcher>
            <>
              <span className={styles.divider}>|</span>
              <Button
                kind="ghost"
                renderIcon={(props) => <Add size={16} {...props} />}
                iconDescription="Add biometrics"
                onClick={launchBalanceForm}
              >
                {t('add', 'Add')}
              </Button>
            </>
          </div>
        </CardHeader>
        {chartView ? (
          <BiometricsChart patientBiometrics={biometrics} conceptUnits={conceptUnits} config={config} />
        ) : (
          <PaginatedBiometrics tableRows={tableRows} pageSize={pageSize} tableHeaders={tableHeaders} />
        )}
      </div>
    );
  }
  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchBalanceForm} />;
};

export default NewbornBiometricsBase;
