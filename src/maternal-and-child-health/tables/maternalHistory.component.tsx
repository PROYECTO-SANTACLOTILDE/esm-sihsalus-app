import React, { useCallback, useMemo } from 'react';
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
import { useMaternalHistory } from '../../hooks/useMaternalHistory';
import { InlineNotification } from '@carbon/react';
import { Add } from '@carbon/react/icons';

interface ProgramsDetailedSummaryProps {
  patientUuid: string;
}

const MaternalHistoryTable: React.FC<ProgramsDetailedSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const displayText = t('noDataAvailable', 'No data available');
  const { prenatalEncounters, error, isValidating, mutate } = useMaternalHistory(patientUuid);

  const formAntenatalUuid = '7d4a47e1-9170-4925-b274-77b875ac04b5'; //id del formulario de atencion Prenatal  --->poner en conceptos
  console.log("prenatalencounters", prenatalEncounters);


  const handleAddPrenatalAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('Antecedentes', 'Antecedentes'),
      formInfo: {
        encounterUuid: '',
        formUuid: formAntenatalUuid,
        additionalProps: {},
      },
    });
  };

  const extractObsByCategory = useCallback((latestEncounter, categoryPrefix) => {
    if (!latestEncounter || !latestEncounter.obs) return [];
    
    return latestEncounter.obs
      .filter(obs => obs.display.includes(categoryPrefix))
      .map(obs => {
        const splitValues = obs.display.split(': ');
        return {
          id: obs.uuid,
          antecedente: splitValues.length > 1 ? splitValues[0].replace(categoryPrefix + ': ', '') : splitValues[0],
          valor: splitValues.length > 1 ? splitValues[splitValues.length - 1] : '--'
        };
      });
  }, []);

  // Define table headers
  const tableHeaders = useMemo(() => {
    return [
      { key: 'antecedente', header: t('Antecedente', 'Antecedente') },
      { key: 'valor', header: t('Valor', 'Valor') },
    ];
  }, [t]);

  // Get latest encounter
  const latestEncounter = useMemo(() => {
    if (!prenatalEncounters || prenatalEncounters.length === 0) return null;
    
    return prenatalEncounters.reduce((latest, current) => {
      return new Date(current.encounterDatetime) > new Date(latest.encounterDatetime) ? current : latest;
    }, prenatalEncounters[0]);

  }, [prenatalEncounters]);


  // Extract data for each table
  const familyHistoryRows = useMemo(() => {
    return extractObsByCategory(latestEncounter, "Antecedentes Familiares");
  }, [latestEncounter, extractObsByCategory]);

  const personalHistoryRows = useMemo(() => {
    return extractObsByCategory(latestEncounter, "Antecedentes Personales");
  }, [latestEncounter, extractObsByCategory]);

  // Extract remaining data (excluding family and personal history)
  const otherDataRows = useMemo(() => {
    if (!latestEncounter || !latestEncounter.obs) return [];
    
    const rows = [];
    
    // Add encounter datetime
    rows.push({
      id: 'encounter-datetime',
      antecedente: t('fechaYHoraAtencion', 'Fecha y hora atención'),
      valor: latestEncounter.encounterDatetime ? dayjs(latestEncounter.encounterDatetime).format('DD/MM/YYYY') : '--'
    });
    
    // Add other observations that are not family or personal history
    latestEncounter.obs
      .filter(obs => !obs.display.includes("Antecedentes Familiares") && !obs.display.includes("Antecedentes Personales"))
      .forEach(obs => {
        const splitValues = obs.display.split(': ');
        rows.push({
          id: obs.uuid,
          antecedente: splitValues[0],
          valor: splitValues.length > 1 ? splitValues[splitValues.length - 1] : '--'
        });
      });
    
    return rows;
  }, [latestEncounter, t]);

  const renderTable = useCallback((title, rows) => {
    return (
      <div className={styles.widgetCard} style={{ marginBottom: '20px' }}>
        {rows?.length > 0 ? (
        <>
        <CardHeader title={title}>

          {isValidating && <InlineLoading />}
        </CardHeader>

        <DataTable 
          rows={rows} 
          headers={tableHeaders} 
          isSortable 
          size={isTablet ? 'lg' : 'sm'} 
          useZebraStyles
        >
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer style={{ width: '100%' }}>
              <Table aria-label={`Tabla de ${title}`} {...getTableProps()}>
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
            headerTitle={title}
            displayText={t('noDataAvailableDescription', 'No data available')}
            launchForm={handleAddPrenatalAttention}
          />
        )}
      </div>
    );
  }, [tableHeaders, isTablet, isValidating, t]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <Button 
          onClick={handleAddPrenatalAttention}
          kind="ghost">
          {t('edith', 'Editar')}
        </Button>
      </div>
      
      {renderTable(t('antecedentesFamiliares', 'Antecedentes Familiares'), familyHistoryRows)}
      {renderTable(t('antecedentesPersonales', 'Antecedentes Personales'), personalHistoryRows)}
      {renderTable(t('otrosAntecedentes', 'Otros antecedentes'), otherDataRows)}
    </div>
  );
};

export default MaternalHistoryTable;
