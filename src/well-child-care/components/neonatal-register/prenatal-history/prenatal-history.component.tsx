import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { useConfig, usePatient } from '@openmrs/esm-framework';
import styles from './prenatal-history.scss';

const PrenatalAntecedents = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const patient = usePatient(patientUuid);
  const config = useConfig();
  const [antecedentsData, setAntecedentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrenatalAntecedents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/openmrs/ws/rest/v1/encounter?patient=${patientUuid}&form=OBST-001-ANTECEDENTES`);
      if (!response.ok) throw new Error('Failed to fetch prenatal antecedents');
      const data = await response.json();
      setAntecedentsData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [patientUuid]);

  useEffect(() => {
    if (patientUuid) fetchPrenatalAntecedents();
  }, [patientUuid, fetchPrenatalAntecedents]);

  const handleUpdate = useCallback(() => {
    fetchPrenatalAntecedents();
  }, [fetchPrenatalAntecedents]);

  const tableRows = useMemo(() => {
    if (!antecedentsData?.results?.length || !config?.concepts) return [];

    const embarazoObs = antecedentsData.results.find((obs) => obs?.concept?.uuid === config.concepts.embarazoUuid);

    return [
      {
        id: 'embarazo',
        label: t('numberOfPregnancies', 'N° de embarazo'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.embarazoUuid)?.value || 'N/A',
      },
      {
        id: 'atenciones',
        label: t('prenatalVisits', 'N° de atenciones prenatales'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.atencionesPrenatalesUuid)
            ?.value || 'N/A',
      },
      {
        id: 'lugarAtenciones',
        label: t('prenatalVisitLocation', 'Lugar de atenciones prenatales'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.lugarAtencionesUuid)?.value ||
          'N/A',
      },
      {
        id: 'condicionParto',
        label: t('deliveryCondition', 'Condición del parto'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.condicionPartoUuid)?.value ||
          'N/A',
      },
      {
        id: 'lugarParto',
        label: t('deliveryLocation', 'Lugar del parto'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.lugarPartoUuid)?.value || 'N/A',
      },
      {
        id: 'atendidoPor',
        label: t('attendedBy', 'Atendido por'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm?.concept?.uuid === config.concepts.atendidoPorUuid)?.value ||
          'N/A',
      },
    ];
  }, [antecedentsData, config, t]);

  const headerTitle = t('prenatalAntecedents', 'Antecedentes Prenatales');

  if (isLoading) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (!antecedentsData?.results?.length) {
    return <EmptyState displayText={headerTitle} launchForm={() => {}} headerTitle={''} />;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        {isLoading && <InlineLoading description={t('loading', 'Loading...')} />}
        <Button kind="ghost" renderIcon={(props) => <Add size={16} {...props} />} onClick={handleUpdate}>
          {t('update', 'Actualizar')}
        </Button>
      </CardHeader>
      <DataTable
        rows={tableRows}
        headers={[
          { key: 'label', header: t('field', 'Campo') },
          { key: 'value', header: t('value', 'Valor') },
        ]}
        size="sm"
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default PrenatalAntecedents;
