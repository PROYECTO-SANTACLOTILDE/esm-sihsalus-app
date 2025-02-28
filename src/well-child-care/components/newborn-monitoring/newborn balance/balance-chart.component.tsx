import React, { useId, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, TabList } from '@carbon/react';
import { LineChart } from '@carbon/charts-react';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import type { ConfigObject } from '../../../../config-schema';
import type { PatientVitalsAndBiometrics } from '../../../common';
import { withUnit } from '../../../common';

import styles from './balance-chart.scss';

enum ScaleTypes {
  LABELS = 'labels',
  LINEAR = 'linear',
  TIME = 'time',
}

interface BalanceChartProps {
  conceptUnits: Map<string, string>;
  config: ConfigObject;
  patientBalance: Array<PatientVitalsAndBiometrics>;
}

interface BalanceChartData {
  title: string;
  value: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ patientBalance, conceptUnits, config }) => {
  const { t } = useTranslation();
  const id = useId();
  const [selectedBalanceMetric, setSelectedBalanceMetric] = useState<BalanceChartData>({
    title: `${t('stoolCount', 'Deposiciones (N°)')} (${conceptUnits.get(config.concepts.stoolCountUuid) ?? ''})`,
    value: 'stoolCount',
  });

  const balanceMetrics = [
    {
      id: 'stoolCount',
      title: withUnit(t('stoolCount', 'Deposiciones (N°)'), conceptUnits.get(config.concepts.stoolCountUuid) ?? '-'),
      value: 'stoolCount',
    },
    {
      id: 'stoolGrams',
      title: withUnit(t('stoolGrams', 'Deposiciones (g)'), conceptUnits.get(config.concepts.stoolGramsUuid) ?? '-'),
      value: 'stoolGrams',
    },
    {
      id: 'urineCount',
      title: withUnit(t('urineCount', 'Micciones (N°)'), conceptUnits.get(config.concepts.urineCountUuid) ?? '-'),
      value: 'urineCount',
    },
    {
      id: 'urineGrams',
      title: withUnit(t('urineGrams', 'Orina (g/mL)'), conceptUnits.get(config.concepts.urineGramsUuid) ?? '-'),
      value: 'urineGrams',
    },
    {
      id: 'vomitCount',
      title: withUnit(t('vomitCount', 'Vómito (N°)'), conceptUnits.get(config.concepts.vomitCountUuid) ?? '-'),
      value: 'vomitCount',
    },
    {
      id: 'vomitGramsML',
      title: withUnit(t('vomitGramsML', 'Vómito (g/mL)'), conceptUnits.get(config.concepts.vomitGramsMLUuid) ?? '-'),
      value: 'vomitGramsML',
    },
  ];

  const chartData = useMemo(() => {
    return patientBalance
      .filter((balance) => balance[selectedBalanceMetric.value])
      .slice(0, 10)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((balance) => ({
        group: selectedBalanceMetric.title,
        key: formatDate(parseDate(balance.date.toString()), { year: false }),
        value: balance[selectedBalanceMetric.value],
        date: balance.date,
      }));
  }, [patientBalance, selectedBalanceMetric]);

  const chartOptions = {
    title: selectedBalanceMetric.title,
    axes: {
      bottom: {
        title: t('date', 'Fecha'),
        mapsTo: 'key',
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        mapsTo: 'value',
        title: selectedBalanceMetric.title,
        scaleType: ScaleTypes.LINEAR,
        includeZero: false,
      },
    },
    legend: {
      enabled: false,
    },
    color: {
      scale: {
        [selectedBalanceMetric.title]: '#6929c4',
      },
    },
    tooltip: {
      customHTML: ([{ value, group, key }]) =>
        `<div class="cds--tooltip cds--tooltip--shown" style="min-width: max-content; font-weight:600">${value} - ${String(
          group,
        ).toUpperCase()}
        <span style="color: #c6c6c6; font-size: 1rem; font-weight:600">${key}</span></div>`,
    },
    height: '400px',
  };

  return (
    <div className={styles.balanceChartContainer}>
      <div className={styles.balanceMetricsArea}>
        <label className={styles.balanceMetricLabel} htmlFor={`${id}-tab`}>
          {t('balanceMetricDisplayed', 'Métrica de Balance de Líquidos')}
        </label>
        <Tabs className={styles.verticalTabs}>
          <TabList className={styles.tablist} aria-label="Balance Metrics tabs">
            {balanceMetrics.map(({ id, title, value }) => (
              <Tab
                className={classNames(styles.tab, { [styles.selectedTab]: selectedBalanceMetric.title === title })}
                id={`${id}-tab`}
                key={id}
                onClick={() =>
                  setSelectedBalanceMetric({
                    title: title,
                    value: value,
                  })
                }
              >
                {title}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className={styles.balanceChartArea}>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BalanceChart;
