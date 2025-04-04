import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import { useBalance, useVitalsConceptMetadata, withUnit } from '../../../common';
import ClinicalDataOverview from '../clinical-data-overview.component';
import { type ClinicalField } from '../clinical-data-overview.component';

import { formatDate, parseDate } from '@openmrs/esm-framework';
import styles from './balance-overview.scss';

interface BalanceOverviewProps {
  patientUuid: string;
  pageSize?: number;
}

const clinicalFields: ClinicalField[] = [
  {
    key: 'stoolCount',
    conceptUuid: 'stoolCountUuid',
    label: 'stoolCount',
    isSortable: true,
    sortFunc: (a, b) => (a.stoolCount && b.stoolCount ? a.stoolCount - b.stoolCount : 0),
    showInChart: true,
  },
  {
    key: 'stoolGrams',
    conceptUuid: 'stoolGramsUuid',
    label: 'stoolGrams',
    isSortable: true,
    sortFunc: (a, b) => (a.stoolGrams && b.stoolGrams ? a.stoolGrams - b.stoolGrams : 0),
    showInChart: true,
  },
  {
    key: 'urineCount',
    conceptUuid: 'urineCountUuid',
    label: 'urineCount',
    isSortable: true,
    sortFunc: (a, b) => (a.urineCount && b.urineCount ? a.urineCount - b.urineCount : 0),
    showInChart: true,
  },
  {
    key: 'urineGrams',
    conceptUuid: 'urineGramsUuid',
    label: 'urineGrams',
    isSortable: true,
    sortFunc: (a, b) => (a.urineGrams && b.urineGrams ? a.urineGrams - b.urineGrams : 0),
    showInChart: true,
  },
  {
    key: 'vomitCount',
    conceptUuid: 'vomitCountUuid',
    label: 'vomitCount',
    isSortable: true,
    sortFunc: (a, b) => (a.vomitCount && b.vomitCount ? a.vomitCount - b.vomitCount : 0),
    showInChart: true,
  },
  {
    key: 'vomitGramsML',
    conceptUuid: 'vomitGramsMLUuid',
    label: 'vomitGramsML',
    isSortable: true,
    sortFunc: (a, b) => (a.vomitGramsML && b.vomitGramsML ? a.vomitGramsML - b.vomitGramsML : 0),
    showInChart: true,
  },
];

const NewbornBalanceOverview: React.FC<BalanceOverviewProps> = ({ patientUuid, pageSize = 10 }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { data: conceptUnits } = useVitalsConceptMetadata();
  const { data: balanceData, error, isLoading, isValidating } = useBalance(patientUuid);

  const { tableHeaders, tableRows, chartConfig } = useMemo(() => {
    // Generar tableHeaders
    const headers = clinicalFields.map((field) => ({
      key: `${field.key}Render`,
      header: field.conceptUuid
        ? withUnit(t(field.label), conceptUnits.get(config.concepts[field.conceptUuid]) ?? '')
        : t(field.label),
      isSortable: field.isSortable,
      sortFunc: field.sortFunc,
    }));

    // Generar tableRows
    const rows = balanceData?.map((item, index) => {
      const row = { id: `${index}` };
      clinicalFields.forEach((field) => {
        if (field.key === 'date') {
          row['dateRender'] = formatDate(parseDate(item.date.toString()), { mode: 'wide', time: true });
        } else {
          row[`${field.key}Render`] = item[field.key] ?? '--';
        }
      });
      return row;
    });

    // Generar chartConfig
    const vitalSigns = clinicalFields
      .filter((field) => field.showInChart && field.conceptUuid)
      .map((field) => ({
        id: field.key,
        title: withUnit(t(field.label), conceptUnits.get(config.concepts[field.conceptUuid]) ?? '-'),
        value: field.key,
      }));

    return {
      tableHeaders: headers,
      tableRows: rows || [],
      chartConfig: {
        vitalSigns,
        mappings: {},
      },
    };
  }, [t, config.concepts, conceptUnits, balanceData]);

  return (
    <ClinicalDataOverview
      patientUuid={patientUuid}
      pageSize={pageSize}
      headerTitle={t('balanceOverview', 'Balance de Líquidos del Recién Nacido')}
      data={balanceData}
      error={error}
      isLoading={isLoading}
      isValidating={isValidating}
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      formWorkspace="newborn-vitals-form"
      emptyStateDisplayText={t('balanceOverview', 'Balance de Líquidos')}
      conceptUnits={conceptUnits}
      config={config}
      chartConfig={chartConfig}
    />
  );
};

export default NewbornBalanceOverview;
