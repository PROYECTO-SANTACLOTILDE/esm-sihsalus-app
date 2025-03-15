import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Add, Analytics, Table } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { formatDate, parseDate, useConfig, useLayoutType } from '@openmrs/esm-framework';
import { useCurrentPregnancy } from '../../../../hooks/useCurrentPregnancy';
import PaginatedLabourHistory from './paginated-labour-history.component';
import LabourHistoryChart from './labour-history-chart.component';
import styles from './labour-history-overview.scss';

interface LabourHistoryOverviewProps {
  patientUuid: string;
  pageSize?: number;
}

const LabourHistoryOverview: React.FC<LabourHistoryOverviewProps> = ({ patientUuid, pageSize = 10 }) => {
  const { t } = useTranslation();
  const headerTitle = t('labourHistorySummary', 'Labour History Summary');
  const [chartView, setChartView] = useState(false);
  const isTablet = useLayoutType() === 'tablet';

  const config = useConfig();
  const { prenatalEncounter, error, isValidating, mutate } = useCurrentPregnancy(patientUuid);
  const formAntenatalUuid = config.formsList.deliveryOrAbortion;

  const launchLabourForm = useCallback(() => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('labourDetails', 'Labour Details'),
      mutateForm: mutate,
      formInfo: { formUuid: formAntenatalUuid, patientUuid, additionalProps: {} },
    });
  }, [patientUuid, formAntenatalUuid, mutate, t]);

  const tableHeaders = useMemo(
    () => [
      { key: 'admissionDate', header: t('admissionDate', 'Admission Date'), isSortable: true },
      { key: 'terminationDate', header: t('terminationDate', 'Termination Date'), isSortable: true },
      { key: 'maternalPulse', header: t('maternalPulse', 'Maternal Pulse (bpm)'), isSortable: true },
      { key: 'systolicBP', header: t('systolicBP', 'Systolic BP (mmHg)'), isSortable: true },
      { key: 'diastolicBP', header: t('diastolicBP', 'Diastolic BP (mmHg)'), isSortable: true },
      { key: 'temperature', header: t('temperature', 'Temperature (°C)'), isSortable: true },
      { key: 'maternalWeight', header: t('maternalWeight', 'Maternal Weight (Kg)'), isSortable: true },
      { key: 'gestationalAge', header: t('gestationalAge', 'Gestational Age (weeks)'), isSortable: true },
      { key: 'fetalHeartRate', header: t('fetalHeartRate', 'Fetal Heart Rate (bpm)'), isSortable: true },
      { key: 'uterineHeight', header: t('uterineHeight', 'Uterine Height (cm)'), isSortable: true },
      { key: 'dilatation', header: t('dilatation', 'Dilatation (cm)'), isSortable: true },
      { key: 'amnioticFluid', header: t('amnioticFluid', 'Amniotic Fluid'), isSortable: true },
      { key: 'deliveryType', header: t('deliveryType', 'Delivery Type'), isSortable: true },
    ],
    [t],
  );

  const tableRows: LabourHistoryTableRow[] = useMemo(() => {
    if (!prenatalEncounter?.obs) return [];

    const rows: LabourHistoryTableRow[] = [];
    let rowId = 0;

    prenatalEncounter.obs.forEach((obs) => {
      const groupMembers = obs.groupMembers || [];
      const row: LabourHistoryTableRow = {
        id: `row-${rowId++}`,
        date: formatDate(parseDate(obs.datetime), { mode: 'wide', time: true }),
      };

      switch (obs.concept.uuid) {
        case '56fdb8b4-4f2a-45f6-b720-7b76786c1ad1': // Fecha y Hora de Ingreso
          row.admissionDate = groupMembers.find((m) => m.concept.uuid === obs.concept.uuid)?.value;
          break;
        case '43bdd458-565e-4093-90ce-c3fbfbee1bfe': // Fecha y Hora de Terminación
          row.terminationDate = groupMembers.find((m) => m.concept.uuid === obs.concept.uuid)?.value;
          break;
        case '3d7124e8-57e3-49c3-8ba6-eac083708dcc': // Funciones Vitales
          groupMembers.forEach((member) => {
            switch (member.concept.uuid) {
              case '5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.maternalPulse = member.value;
                break;
              case '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.systolicBP = member.value;
                break;
              case '5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.diastolicBP = member.value;
                break;
              case '5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.respiratoryRate = member.value;
                break;
              case '5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.temperature = member.value;
                break;
              case '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
                row.maternalWeight = member.value;
                break;
              case '1e35f0dd-3bbb-4b45-96fd-2fc590c1b385':
                row.gestationalAge = member.value;
                break;
            }
          });
          break;
        case '4c481ae7-5629-4c99-9334-566fad97ae22': // Evaluación del Feto
          groupMembers.forEach((member) => {
            switch (member.concept.uuid) {
              case '4bcdcee3-54c2-4368-a5cf-733e9c25fe50':
                row.uterineHeight = member.value;
                break;
              case 'b1fb2d14-92ec-4fda-90e5-40f3227c9c65':
                row.fetalHeartRate = member.value;
                break;
            }
          });
          break;
        case '2d7b7ddc-8af4-4b70-a0f5-d9909fcd7573': // Evolución del Trabajo de Parto
          groupMembers.forEach((member) => {
            switch (member.concept.uuid) {
              case 'edc3bfa6-649c-4c61-9fc4-bf898c833e2b':
                row.dilatation = member.value;
                break;
              case '6166f7ff-a125-4aed-ada4-5d49f7e7098a':
                row.amnioticFluid = member.value.display;
                break;
              case '0eb6b0b9-331c-4a49-b9e3-84ce4cffb524':
                row.membranes = member.value.display;
                break;
              case '0c4bf846-1b2a-4495-87b6-6e24a2eadb8b':
                row.ruptureDate = member.value;
                break;
              case '2cfc0e9d-c1df-41e6-a223-82875dc9f99d':
                row.deliveryStart = member.value.display;
                break;
            }
          });
          break;
        case '648098df-d25a-4305-a318-c828e18b8e86': // Terminación del Parto
          groupMembers.forEach((member) => {
            if (member.concept.uuid === '648098df-d25a-4305-a318-c828e18b8e86') {
              row.deliveryType = member.value.display;
            }
          });
          break;
      }
      if (Object.keys(row).length > 2) rows.push(row); // Solo agregar si tiene datos relevantes
    });

    return rows;
  }, [prenatalEncounter]);

  if (isValidating && !prenatalEncounter) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (tableRows.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <div className={styles.backgroundDataFetchingIndicator}>
            <span>{isValidating ? <InlineLoading /> : null}</span>
          </div>
          <div className={styles.headerActionItems}>
            <ContentSwitcher onChange={(evt) => setChartView(evt.name === 'chartView')} size={isTablet ? 'md' : 'sm'}>
              <IconSwitch name="tableView" text="Table View">
                <Table size={16} />
              </IconSwitch>
              <IconSwitch name="chartView" text="Chart View">
                <Analytics size={16} />
              </IconSwitch>
            </ContentSwitcher>
            <span className={styles.divider}>|</span>
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              iconDescription="Add labour details"
              onClick={launchLabourForm}
            >
              {t('add', 'Add')}
            </Button>
          </div>
        </CardHeader>
        {chartView ? (
          <LabourHistoryChart patientHistory={tableRows} />
        ) : (
          <PaginatedLabourHistory tableRows={tableRows} pageSize={pageSize} tableHeaders={tableHeaders} />
        )}
      </div>
    );
  }
  return (
    <EmptyState
      displayText={t('labourHistorySummary', 'Labour History Summary')}
      headerTitle={headerTitle}
      launchForm={launchLabourForm}
    />
  );
};

export default LabourHistoryOverview;
