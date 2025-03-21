import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, TabList } from '@carbon/react';
import { LineChart } from '@carbon/charts-react';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import type { ConfigObject } from '../../../../config-schema';
import type { PatientVitalsAndBiometrics } from '../../../common';
import styles from './biometrics-chart.scss';

enum ScaleTypes {
  LABELS = 'labels',
  LABELS_RATIO = 'labels-ratio',
  LINEAR = 'linear',
  LOG = 'log',
  TIME = 'time',
}

interface BiometricsChartProps {
  conceptUnits: Map<string, string>;
  config: ConfigObject;
  patientBiometrics: Array<PatientVitalsAndBiometrics>;
}

interface BiometricChartData {
  title: string;
  value: keyof PatientVitalsAndBiometrics;
  groupName: string;
}

const chartColors = {
  weight: '#6929c4',
  height: '#6929c4',
  headCircumference: '#ff7eb6',
  chestCircumference: '#1192e8',
};

const BiometricsChart: React.FC<BiometricsChartProps> = ({ patientBiometrics, conceptUnits, config }) => {
  const { t } = useTranslation();
  const [selectedBiometrics, setSelectedBiometrics] = useState<BiometricChartData>({
    title: `${t('weight', 'Weight')} (${conceptUnits.get(config.concepts.weightUuid) ?? ''})`,
    value: 'weight',
    groupName: 'weight',
  });

  const chartData = useMemo(
    () =>
      patientBiometrics
        .filter((biometrics) => biometrics[selectedBiometrics.value] !== undefined)
        .slice(0, 10)
        .sort((biometricA, biometricB) => new Date(biometricA.date).getTime() - new Date(biometricB.date).getTime())
        .map((biometric) => ({
          group: selectedBiometrics.groupName,
          key: formatDate(new Date(biometric.date), { mode: 'wide', year: false, time: false }),
          value: biometric[selectedBiometrics.value] as number,
          date: biometric.date,
        })),
    [patientBiometrics, selectedBiometrics],
  );

  const chartOptions = useMemo(() => {
    return {
      title: selectedBiometrics.title,
      axes: {
        bottom: {
          title: t('date', 'Date'),
          mapsTo: 'key',
          scaleType: ScaleTypes.LABELS,
        },
        left: {
          mapsTo: 'value',
          title: selectedBiometrics.title,
          scaleType: ScaleTypes.LINEAR,
          includeZero: false,
        },
      },
      legend: {
        enabled: false,
      },
      color: {
        scale: chartColors,
      },
      tooltip: {
        customHTML: ([{ value, date }]) =>
          `<div class="cds--tooltip cds--tooltip--shown" style="min-width: max-content; font-weight:600">${formatDate(
            parseDate(date),
            { year: true },
          )} -
          <span style="color: #c6c6c6; font-size: 1rem; font-weight:400">${value}</span></div>`,
      },
      height: '400px',
    };
  }, [selectedBiometrics, t]);

  return (
    <div className={styles.biometricChartContainer}>
      <div className={styles.biometricsArea}>
        <label className={styles.biometricLabel} htmlFor="biometrics-chart-radio-group">
          {t('biometricDisplayed', 'Biometric displayed')}
        </label>
        <Tabs className={styles.verticalTabs}>
          <TabList className={styles.tablist} aria-label="Biometrics tabs">
            {[
              {
                id: 'weight',
                label: `${t('weight', 'Weight')} (${conceptUnits.get(config.concepts.weightUuid) ?? ''})`,
              },
              {
                id: 'height',
                label: `${t('height', 'Height')} (${conceptUnits.get(config.concepts.heightUuid) ?? ''})`,
              },
              {
                id: 'headCircumference',
                label: `${t('headCircumference', 'Head Circumference')} (${conceptUnits.get(config.concepts.headCircumferenceUuid) ?? ''})`,
              },
              {
                id: 'chestCircumference',
                label: `${t('chestCircumference', 'Chest Circumference')} (${conceptUnits.get(config.concepts.chestCircumferenceUuid) ?? ''})`,
              },
            ].map(({ id, label }) => (
              <Tab
                className={classNames(styles.tab, styles.bodyLong01, {
                  [styles.selectedTab]: selectedBiometrics.title === label,
                })}
                key={id}
                onClick={() =>
                  setSelectedBiometrics({
                    title: label,
                    value: id as keyof PatientVitalsAndBiometrics,
                    groupName: id,
                  })
                }
              >
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className={styles.biometricsChartArea}>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BiometricsChart;
