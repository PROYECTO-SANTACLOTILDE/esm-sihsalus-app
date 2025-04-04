import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import { useVitalsAndBiometrics, useVitalsConceptMetadata, withUnit } from '../../../common';
import ClinicalDataOverview from '../../../../ui/data-table/clinical-data-overview.component';
import { formatDate, parseDate } from '@openmrs/esm-framework';

interface VitalsOverviewProps {
  patientUuid: string;
  pageSize?: number;
}

const NewbornVitalsOverview: React.FC<VitalsOverviewProps> = ({ patientUuid, pageSize = 10 }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { data: conceptUnits } = useVitalsConceptMetadata();
  const { data: vitals, error, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid);

  const clinicalFields = useMemo(
    () => [
      {
        key: 'date',
        conceptUuid: '',
        label: 'dateAndTime',
        isSortable: true,
        sortFunc: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        format: (date) => formatDate(parseDate(date), { mode: 'wide', time: true }),
        showInChart: false,
      },
      {
        key: 'temperature',
        conceptUuid: 'temperatureUuid',
        label: 'temperatureAbbreviated',
        isSortable: true,
        sortFunc: (a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0),
        showInChart: true,
      },
      {
        key: 'systolic',
        conceptUuid: 'systolicBloodPressureUuid',
        label: 'bloodPressureAbbreviated',
        isSortable: true,
        sortFunc: (a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0),

        showInChart: true,
        relatedField: 'diastolic', // Para combinar con diastolic en la tabla y gráfico
      },
      {
        key: 'diastolic',
        conceptUuid: 'diastolicBloodPressureUuid',
        label: 'bloodPressureAbbreviated',
        showInChart: false,
      },
      {
        key: 'respiratoryRate',
        conceptUuid: 'respiratoryRateUuid',
        label: 'respiratoryRateAbbreviated',
        isSortable: true,
        sortFunc: (a, b) => (a.respiratoryRate && b.respiratoryRate ? a.respiratoryRate - b.respiratoryRate : 0),
        showInChart: true,
      },
      {
        key: 'spo2',
        conceptUuid: 'oxygenSaturationUuid',
        label: 'spo2',
        isSortable: true,
        sortFunc: (a, b) => (a.spo2 && b.spo2 ? a.spo2 - b.spo2 : 0),
        showInChart: true,
      },
    ],
    [t],
  );

  const { tableHeaders, tableRows, chartConfig } = useMemo(() => {
    // Generar tableHeaders
    const headers = clinicalFields
      .filter((field) => !field.relatedField) // Excluir campos relacionados como 'diastolic'
      .map((field) => ({
        key: field.key,
        header: field.conceptUuid
          ? withUnit(t(field.label), conceptUnits?.get(config.concepts[field.conceptUuid]) ?? '')
          : t(field.label),
        isSortable: field.isSortable,
        sortFunc: field.sortFunc,
      }));

    // Generar tableRows
    const rows =
      vitals?.map((item, index) => {
        const row: { id: string; [key: string]: any } = { id: `${index}` };
        clinicalFields.forEach((field) => {
          if (field.key === 'date') {
            row[field.key] = field.format ? field.format(item[field.key]) : item[field.key];
          } else if (field.key === 'systolic' && field.relatedField) {
            row[field.key] = `${item.systolic ?? '--'} / ${item[field.relatedField] ?? '--'}`;
          } else if (!field.relatedField) {
            row[field.key] = item[field.key] ?? '--';
          }
        });
        return row;
      }) || [];

    // Generar chartConfig
    const vitalSigns = clinicalFields
      .filter((field) => field.showInChart && field.conceptUuid)
      .map((field) => ({
        id: field.key,
        title: withUnit(t(field.label), conceptUnits?.get(config.concepts[field.conceptUuid]) ?? ''),
        value: field.key,
      }));

    const mappings = {
      diastolic: 'diastolic', // Mapeo para combinar systolic y diastolic en el gráfico
    };

    return {
      tableHeaders: headers,
      tableRows: rows,
      chartConfig: {
        vitalSigns,
        mappings,
      },
    };
  }, [clinicalFields, vitals, conceptUnits, config.concepts, t]);

  return (
    <ClinicalDataOverview
      patientUuid={patientUuid}
      pageSize={pageSize}
      headerTitle={t('vitals', 'Signos Vitales del Recién Nacido')}
      data={vitals}
      error={error}
      isLoading={isLoading}
      isValidating={isValidating}
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      formWorkspace="newborn-vitals-form"
      emptyStateDisplayText={t('vitalSigns', 'Vital signs')}
      conceptUnits={conceptUnits || new Map()} // Aseguramos que conceptUnits no sea undefined
      config={config}
      chartConfig={chartConfig}
    />
  );
};

export default NewbornVitalsOverview;
