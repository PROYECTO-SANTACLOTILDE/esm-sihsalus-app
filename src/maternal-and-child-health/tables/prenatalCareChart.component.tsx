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

interface ProgramsDetailedSummaryProps {
  patientUuid: string;
}

const PrenatalCareChart: React.FC<ProgramsDetailedSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const headerTitle = t('Cuidado prenatal', 'Cuidado prenatal');
  const { prenatalEncounters, error, isValidating, mutate } = useAttentions(patientUuid);

  const formAntenatalUuid = '430d7562-af07-4ce0-88e6-3e2ac5e8b53c'; //id del formulario de atencion Prenatal  --->poner en conceptos

  //console.log("form uuid", formAntenatalUuid);
  //console.log("prenatalencounters", prenatalEncounters);

  const handleAddPrenatalAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('Nueva Atención Prenatal', 'Nueva Atención Prenatal'),
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
      t('edadGestacional', 'Edad Gestacional (semanas)'),
      t('pesoMadre', 'Peso Madre(kg)'),
      t('alturaUterina', 'Altura Uterina (cm)'),
      t('situación', 'Situación (L,T,NA)'),
      t('presentación', 'Presentación (C/P/NA)'),
      t('posición', 'Posición (O/I/NA)'),
      t('frecuenciaCardiacaFetal', 'Frecuencia cardiaca fetal (por min.)'),
    ],
    [t],
  );

  const tableHeaders = useMemo(() => {
    return [
      { key: 'rowHeader', header: t('AtencionesPrenatales', 'Atenciones Prenatales') },
      ...Array.from({ length: 9 }, (_, i) => ({
        key: `atencion${i + 1}`,
        header: t(`atencion${i + 1}`, `Atención ${i + 1}`),
      })),
    ];
  }, [t]);

  const tableRows = useMemo(() => {
    const rowDataTemplate = rowHeaders.map((rowHeader, rowIndex) => ({
      id: `row-${rowIndex}`,
      rowHeader,
      ...Array.from({ length: 9 }, (_, i) => ({ [`atencion${i + 1}`]: '--' })).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      ),
    }));

    const categoryMapping: Record<string, string> = {
      'Fecha y hora atención': 'encounterDatetime',
      'Edad Gestacional (semanas)': 'Duración de la gestación',
      'Peso Madre(kg)': 'Peso materno',
      'Altura Uterina (cm)': 'Altura del fondo uterino',
      'Situación (L,T,NA)': 'Situación fetal',
      'Presentación (C/P/NA)': 'Presentación del feto',
      'Posición (O/I/NA)': 'Posición fetal',
      'Frecuencia cardiaca fetal (por min.)': 'Frecuencia cardíaca medida en arteria sistémica',
    };

    prenatalEncounters.forEach((encounter) => {
      let encounterNumber = null;
      encounter.obs.forEach((obs) => {
        const match = obs.display.match(/Número de atención prenatal: Atención prenatal (\d+)/);
        if (match) {
          encounterNumber = parseInt(match[1], 10);
        }
      });

      if (encounterNumber && encounterNumber <= 9) {
        const fechaRowIndex = rowHeaders.indexOf('Fecha y hora atención');
        if (fechaRowIndex !== -1) {
          rowDataTemplate[fechaRowIndex][`atencion${encounterNumber}`] =
            dayjs(encounter.encounterDatetime).format('DD/MM/YYYY') || '--';
        }

        encounter.obs.forEach((obs) => {
          for (const [rowHeader, keyword] of Object.entries(categoryMapping)) {
            if (obs.display.includes(keyword)) {
              const rowIndex = rowHeaders.indexOf(rowHeader);
              if (rowIndex !== -1) {
                rowDataTemplate[rowIndex][`atencion${encounterNumber}`] = obs.display.split(': ')[1] || '--';
              }
            }
          }
        });
      }
    });

    return rowDataTemplate;
  }, [prenatalEncounters, rowHeaders]);

  return (
    <div>
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          {isValidating && <InlineLoading />}
          <Button onClick={handleAddPrenatalAttention} kind="ghost">
            {t('add', 'Añadir')}
          </Button>
        </CardHeader>
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer style={{ width: '100%' }}>
              <Table aria-label="Tabla de cuidado prenatal" {...getTableProps()}>
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
      </div>
    </div>
  );
};

export default PrenatalCareChart;
