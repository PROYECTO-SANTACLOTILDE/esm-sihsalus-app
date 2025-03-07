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
  SkeletonText,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { formatDate, parseDate, useConfig, usePatient } from '@openmrs/esm-framework';
import styles from './prenatal-history.scss';

interface PrenatalObservation {
  concept: { uuid: string; display: string };
  value: string | number | boolean | null;
  groupMembers?: PrenatalObservation[];
}

interface PrenatalAntecedentsData {
  results: PrenatalObservation[];
}

interface ConfigObject {
  concepts: {
    embarazoUuid: string;
    atencionesPrenatalesUuid: string;
    lugarAtencionesUuid: string;
    condicionPartoUuid: string;
    lugarPartoUuid: string;
    atendidoPorUuid: string;
  };
}

//ANTECEDENTES PRENATALES
const PrenatalAntecedents: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const patient = usePatient(patientUuid);
  const config = useConfig<ConfigObject>();
  const [antecedentsData, setAntecedentsData] = useState<PrenatalAntecedentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrenatalAntecedents = useCallback(async () => {
    setIsLoading(true);
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
    // Add logic to launch update form if needed
    // launchGenericForm(currentVisit, 'prenatal-antecedents-form');
  }, [fetchPrenatalAntecedents, currentVisit]);

  const tableRows = useMemo(() => {
    if (!antecedentsData?.results?.length) return [];

    const embarazoObs = antecedentsData.results.find((obs) => obs.concept.uuid === config.concepts.embarazoUuid);
    return [
      {
        id: 'embarazo',
        label: t('numberOfPregnancies', 'N° de embarazo'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.embarazoUuid)?.value || 'N/A',
      },
      {
        id: 'atenciones',
        label: t('prenatalVisits', 'N° de atenciones prenatales'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.atencionesPrenatalesUuid)
            ?.value || 'N/A',
      },
      {
        id: 'lugarAtenciones',
        label: t('prenatalVisitLocation', 'Lugar de atenciones prenatales'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.lugarAtencionesUuid)?.value ||
          'N/A',
      },
      {
        id: 'condicionParto',
        label: t('deliveryCondition', 'Condición del parto'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.condicionPartoUuid)?.value ||
          'N/A',
      },
      {
        id: 'lugarParto',
        label: t('deliveryLocation', 'Lugar del parto'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.lugarPartoUuid)?.value || 'N/A',
      },
      {
        id: 'atendidoPor',
        label: t('attendedBy', 'Atendido por'),
        value:
          embarazoObs?.groupMembers?.find((gm) => gm.concept.uuid === config.concepts.atendidoPorUuid)?.value || 'N/A',
      },
    ];
  }, [antecedentsData, config, t]);

  const headerTitle = t('prenatalAntecedents', 'Antecedentes Prenatales');

  if (isLoading) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (!antecedentsData?.results?.length) {
    return (
      <EmptyState
        displayText={t('prenatalAntecedents', 'Prenatal Antecedents')}
        headerTitle={headerTitle}
        launchForm={() => {
          /* Implement form launch logic */
        }}
      />
    );
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <span>{isLoading ? <InlineLoading description={t('loading', 'Loading...')} /> : null}</span>
        <Button
          kind="ghost"
          renderIcon={(props) => <Add size={16} {...props} />}
          iconDescription={t('update', 'Actualizar')}
          onClick={handleUpdate}
        >
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
                    <TableCell>{row.cells[0].value}</TableCell>
                    <TableCell>{row.cells[1].value}</TableCell>
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
