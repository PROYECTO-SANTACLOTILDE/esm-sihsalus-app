import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  InlineLoading,
} from '@carbon/react';
import { launchPatientWorkspace, CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { useLayoutType } from '@openmrs/esm-framework';
import { useAttentions } from '../../clinical-view-group/programs.resource';
import styles from './prenatalCareChart.scss';
import dayjs from 'dayjs';
import { useObstetricMonitoring } from '../../hooks/useObtetricMonitoring';

interface ProgramsDetailedSummaryProps {
  patientUuid: string;
}

const ObstetricMonitoringTable: React.FC<ProgramsDetailedSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const headerTitle = t('MonitorizaciónObstétrica', 'Monitorización Obstétrica');
  const { prenatalEncounters, error, isValidating, mutate } = useObstetricMonitoring(patientUuid);

  const formAntenatalUuid = '67f588f5-d477-44b7-9775-61fafef479b0'; //id del formulario de embarazo actual --->poner en conceptos

  //console.log("form uuid", formAntenatalUuid);
  console.log('pomonitoreo postnatal', prenatalEncounters);

  const handleAddPrenatalAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('PuerperioInmediato', 'Puerperio Inmediato'),
      formInfo: {
        encounterUuid: '',
        formUuid: formAntenatalUuid,
        additionalProps: {},
      },
    });
  };

  const rowHeaders = useMemo(
    () => [
      t('fechaYHoraAtencion', 'Fecha y hora atención'),
      t('Diagnóstico', 'Diagnóstico'),
      t('MonitorizaciónObstétrica', 'Monitorización Obstétrica'),
    ],
    [t],
  );

  const tableHeaders = useMemo(() => {
    return [
      { key: 'rowHeader', header: t('Antecedente', 'Antecedente') },
      { key: 'value', header: t('Valor', 'Valor') },
    ];
  }, [t]);

  const tableRows = useMemo(() => {
    if (!prenatalEncounters || prenatalEncounters.length === 0) return [];

    const latestEncounter = prenatalEncounters.reduce((latest, current) => {
      return new Date(current.encounterDatetime) > new Date(latest.encounterDatetime) ? current : latest;
    }, prenatalEncounters[0]);

    const categoryMapping: Record<string, string> = {
      'Fecha y hora atención': 'encounterDatetime',
      Diagnóstico: 'Diagnóstico',
      'Monitorización Obstétrica': 'Monitorización Obstétrica',
    };

    return rowHeaders.map((rowHeader, rowIndex) => {
      let values = [];

      if (rowHeader === 'Fecha y hora atención') {
        values.push(dayjs(latestEncounter.encounterDatetime).format('DD/MM/YYYY HH:mm:ss') || '--');
      }

      latestEncounter.obs.forEach((obs) => {
        if (categoryMapping[rowHeader] && obs.display.includes(categoryMapping[rowHeader])) {
          const splitValues = obs.display.split(': ');
          values.push(splitValues[splitValues.length - 1] || '--');
        }
      });

      return {
        id: `row-${rowIndex}`,
        rowHeader,
        value: values.length > 0 ? values.join(', ') : '--',
      };
    });
  }, [prenatalEncounters, rowHeaders]);

  return (
    <div>
      <div className={styles.widgetCard}>
        {prenatalEncounters?.length > 0 ? (
          <>
            <CardHeader title={headerTitle}>
              {isValidating && <InlineLoading />}
              <Button onClick={handleAddPrenatalAttention} kind="ghost">
                {t('edith', 'Editar')}
              </Button>
            </CardHeader>
            <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer style={{ width: '100%' }}>
                  <Table aria-label="Tabla de antecedentes" {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader
                            className={classNames(styles.productiveHeading01, styles.text02)}
                            {...getHeaderProps({ header, isSortable: header.isSortable })}
                          >
                            {header.header?.content ?? header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </>
        ) : (
          <EmptyState
            headerTitle={headerTitle}
            displayText={t('noDataAvailableDescription', 'No data available')}
            launchForm={handleAddPrenatalAttention}
          />
        )}
      </div>
    </div>
  );
};

export default ObstetricMonitoringTable;
