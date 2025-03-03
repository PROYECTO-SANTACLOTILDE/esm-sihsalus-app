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
import { useCurrentPregnancy } from '../../hooks/useCurrentPregnancy';

interface ProgramsDetailedSummaryProps {
  patientUuid: string;
}

const CurrentPregnancyTable: React.FC<ProgramsDetailedSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const headerTitle = t('Current pregnancy', 'Embarazo actual');
  const { prenatalEncounters, error, isValidating, mutate } = useCurrentPregnancy(patientUuid);

  const formAntenatalUuid = 'ee581e93-1eaa-4523-8270-ec4b5de8d32d'; //id del formulario de embarazo actual --->poner en conceptos

  const handleAddPrenatalAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('EmbarazoActual', 'Embarazo Actual'),
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
      t('Talla', 'Talla'),
      t('Peso', 'Peso (Kg)'),
      t('ICM', 'ICM'),
      t('Captada', 'Captada'),
      t('Referida', 'Referida'),
      t('FUM', 'FUM'),
      t('Duda', 'Duda'),
      t('EcografíaObstetricia', 'Ecografía de obstetricia'),
      t('EdadGestacionalActualFUM', 'Edad gestacional actual FUM'),
      t('FechaProbableParto', 'Fecha probable de parto'),
      t('PrimeraDosisAntitetanica', '1era dosis de vacuna antitetánica'),
      t('SegundaDosisAntitetanica', '2da dosis de vacuna antitetánica'),
      t('MesgestaciónprimeraAntitetánica', 'Mes de gestación de la primera vacunación antitetánica'),
      t('MesgestaciónsegundaAntitetánica', 'Mes de gestación de la segunda vacunación antitetánica'),
      t('VacunaInfluencia', 'Vacuna influencia'),
      t('FichaTamizaje', 'Ficha Tamizaje'),
      t('violencia', 'violencia'),
      t('Drogas', 'Drogas'),
      t('ExamenClínico', 'Examen clínico'),
      t('ExamenMamas', 'Examen de mamas'),
      t('Examendecuellouterino', 'Examen de cuello uterino'),
      t('Examenpélvico', 'Examen pélvico'),
      t('ExamenOdontológico', 'Examen odontológico'),
      t('Hospitalización', 'Hospitalización'),
      t('FechaHospitalización', 'Fecha de hospitalización'),
      t('Diagnóstico', 'Diagnóstico'),
      t('Emergencia paciente', 'Emergencia paciente'),
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
      Talla: 'Percentilo de talla',
      'Peso (Kg)': 'Peso pregestacional',
      ICM: ' Body mass index',
      Captada: 'Captada',
      Referida: 'Referido por un trabajador comunitario de salud a un centro de salud',
      FUM: 'FUM',
      Duda: 'Duda',
      'Ecografía de obstetricia': 'Ecografía de obstetricia',
      'Edad gestacional actual FUM': 'Edad gestacional actual FUM',
      'Fecha probable de parto': ' FPP - Fecha probable de parto',
      '1era dosis de vacuna antitetánica': 'Primera dosis de vacuna antitetánica',
      'Mes de gestación de la primera vacunación antitetánica':
        'Mes de gestación de la primera vacunación antitetánica',
      '2da dosis de vacuna antitetánica': 'Segunda dosis de vacuna antitetánica',
      'Mes de gestación de la segunda vacunación antitetánica':
        'Mes de gestación de la segunda vacunación antitetánica',
      'Vacuna influencia': 'Influenza vaccination status',
      'Ficha Tamizaje': 'Ficha Tamizaje',
      violencia: 'violencia conyugal',
      Drogas: 'Drogas',
      'Examen clínico': 'Examen clínico',
      'Examen de mamas': 'Examen de mamas',
      'Examen de cuello uterino': 'Examen de cuello uterino',
      'Examen pélvico': 'Examen pélvico',
      'Examen odontológico': 'Examen odontológico',
      Hospitalización: 'Hospitalización',
      'Fecha de hospitalización': 'Fecha de hospitalización',
      Diagnóstico: 'Diagnóstico',
      'Emergencia paciente': 'Emergencia paciente',
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

export default CurrentPregnancyTable;
