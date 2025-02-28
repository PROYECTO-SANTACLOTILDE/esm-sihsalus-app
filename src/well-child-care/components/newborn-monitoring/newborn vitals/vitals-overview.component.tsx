import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Add, Analytics, Table } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import {
  age,
  getPatientName,
  formatDate,
  parseDate,
  useConfig,
  useLayoutType,
  usePatient,
} from '@openmrs/esm-framework';
import type { ConfigObject } from '../../../../config-schema';
import { launchGenericForm } from '../utils';
import { useVitalsAndBiometrics, useVitalsConceptMetadata, withUnit } from '../../../common';
import type { VitalsTableHeader, VitalsTableRow } from './types';
import PaginatedVitals from './paginated-vitals.component';
import VitalsChart from './vitals-chart.component';
import styles from './vitals-overview.scss';

interface VitalsOverviewProps {
  patientUuid: string;
  pageSize: number;
}

const VitalsOverview: React.FC<VitalsOverviewProps> = ({ patientUuid, pageSize }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const headerTitle = t('vitals', 'Signos Vitales del Recien Nacido');
  const [chartView, setChartView] = useState(false);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const isTablet = useLayoutType() === 'tablet';
  const patient = usePatient(patientUuid);

  const { data: vitals, error, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid);
  const { data: conceptUnits } = useVitalsConceptMetadata();

  const launchBiometricsForm = useCallback(() => {
    launchGenericForm(currentVisit, 'newborn-vitals-form');
  }, [currentVisit]);

  const tableHeaders: Array<VitalsTableHeader> = [
    {
      key: 'dateRender',
      header: t('dateAndTime', 'Date and time'),
      isSortable: true,
      sortFunc: (valueA, valueB) => new Date(valueA.date).getTime() - new Date(valueB.date).getTime(),
    },
    {
      key: 'temperatureRender',
      header: withUnit(t('temperatureAbbreviated', 'Temp'), conceptUnits.get(config.concepts.temperatureUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.temperature && valueB.temperature ? valueA.temperature - valueB.temperature : 0,
    },
    {
      key: 'bloodPressureRender',
      header: withUnit(
        t('bloodPressureAbbreviated', 'BP'),
        conceptUnits.get(config.concepts.systolicBloodPressureUuid) ?? '',
      ),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.systolic && valueB.systolic && valueA.diastolic && valueB.diastolic
          ? valueA.systolic !== valueB.systolic
            ? valueA.systolic - valueB.systolic
            : valueA.diastolic - valueB.diastolic
          : 0,
    },
    {
      key: 'respiratoryRateRender',
      header: withUnit(
        t('respiratoryRateAbbreviated', 'R. Rate'),
        conceptUnits.get(config.concepts.respiratoryRateUuid) ?? '',
      ),
      isSortable: true,
      sortFunc: (valueA, valueB) =>
        valueA.respiratoryRate && valueB.respiratoryRate ? valueA.respiratoryRate - valueB.respiratoryRate : 0,
    },
    {
      key: 'spo2Render',
      header: withUnit(t('spo2', 'SpO2'), conceptUnits.get(config.concepts.oxygenSaturationUuid) ?? ''),
      isSortable: true,
      sortFunc: (valueA, valueB) => (valueA.spo2 && valueB.spo2 ? valueA.spo2 - valueB.spo2 : 0),
    },
  ];

  const tableRows: Array<VitalsTableRow> = useMemo(
    () =>
      vitals?.map((vitalSigns, index) => ({
        ...vitalSigns,
        id: `${index}`,
        dateRender: formatDate(parseDate(vitalSigns.date.toString()), { mode: 'wide', time: true }),
        bloodPressureRender: `${vitalSigns.systolic ?? '--'} / ${vitalSigns.diastolic ?? '--'}`,
        spo2Render: vitalSigns.spo2 ?? '--',
        temperatureRender: vitalSigns.temperature ?? '--',
        respiratoryRateRender: vitalSigns.respiratoryRate ?? '--',
      })),
    [vitals],
  );

  return (
    <>
      {(() => {
        if (isLoading) return <DataTableSkeleton role="progressbar" compact={!isTablet} zebra />;
        if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
        if (vitals?.length) {
          return (
            <div className={styles.widgetCard}>
              <CardHeader title={headerTitle}>
                <div className={styles.backgroundDataFetchingIndicator}>
                  <span>{isValidating ? <InlineLoading /> : null}</span>
                </div>
                <div className={styles.vitalsHeaderActionItems}>
                  <ContentSwitcher
                    onChange={(evt) => setChartView(evt.name === 'chartView')}
                    size={isTablet ? 'md' : 'sm'}
                  >
                    <IconSwitch name="tableView" text="Table view">
                      <Table size={16} />
                    </IconSwitch>
                    <IconSwitch name="chartView" text="Chart view">
                      <Analytics size={16} />
                    </IconSwitch>
                  </ContentSwitcher>
                  <Button kind="ghost" renderIcon={Add} iconDescription="Add vitals" onClick={launchBiometricsForm}>
                    {t('add', 'Add')}
                  </Button>
                </div>
              </CardHeader>
              {chartView ? (
                <VitalsChart patientVitals={vitals} conceptUnits={conceptUnits} config={config} />
              ) : (
                <PaginatedVitals tableRows={tableRows} pageSize={pageSize} tableHeaders={tableHeaders} />
              )}
            </div>
          );
        }
        return (
          <EmptyState
            displayText={t('vitalSigns', 'Vital signs')}
            headerTitle={headerTitle}
            launchForm={launchBiometricsForm}
          />
        );
      })()}
    </>
  );
};

export default VitalsOverview;
