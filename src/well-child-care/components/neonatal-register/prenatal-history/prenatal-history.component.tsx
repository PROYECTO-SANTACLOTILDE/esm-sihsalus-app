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
  Tile,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import {
  CardHeader,
  EmptyState,
  ErrorState,
  useVisitOrOfflineVisit,
  launchPatientWorkspace,
  launchStartVisitPrompt,
} from '@openmrs/esm-patient-common-lib';
import { useConfig, usePatient } from '@openmrs/esm-framework';
import { usePrenatalAntecedents } from '../../../../hooks/usePrenatalAntecedents';
import styles from './prenatal-history.scss';

interface NeonatalSummaryProps {
  patientUuid: string;
}

const PrenatalAntecedents: React.FC<NeonatalSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const patient = usePatient(patientUuid);
  const config = useConfig();
  const { data: formattedObs, isLoading, error, mutate } = usePrenatalAntecedents(patientUuid);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsLoadingData(false);
    }
  }, [isLoading]);

  const handleOpenOrEditPrenatalAntecedentsForm = (encounterUUID = '') => {
    if (!currentVisit) {
      launchStartVisitPrompt();
      return;
    }

    const lastAntecedent = formattedObs?.[0];
    const formData = lastAntecedent
      ? {
          gravidez: lastAntecedent.gravidez,
          partoAlTermino: lastAntecedent.partoAlTermino,
          partoPrematuro: lastAntecedent.partoPrematuro,
          partoAborto: lastAntecedent.partoAborto,
          partoNacidoVivo: lastAntecedent.partoNacidoVivo,
        }
      : {};

    launchPatientWorkspace('perinatal-register-form', {
      workspaceTitle: t('prenatalAntecedentsForm', 'Prenatal Antecedents Form'),
      mutateForm: mutate,
      formInfo: {
        encounterUuid: encounterUUID,
        formUuid: 'OBST-001-ANTECEDENTES',
        patientUuid,
        visitTypeUuid: currentVisit?.visitType?.uuid || '',
        visitUuid: currentVisit?.uuid || '',
        initialData: formData,
      },
    });
  };

  const tableRows = useMemo(() => {
    if (!formattedObs?.length || !config?.concepts) return [];

    const lastAntecedent = formattedObs[0];

    return [
      {
        id: 'gravidez',
        label: t('gravidez', 'Gravidez'),
        value: lastAntecedent.gravidez || 'N/A',
      },
      {
        id: 'partoAlTermino',
        label: t('partoAlTermino', 'Partos a término'),
        value: lastAntecedent.partoAlTermino || 'N/A',
      },
      {
        id: 'partoPrematuro',
        label: t('partoPrematuro', 'Partos prematuros'),
        value: lastAntecedent.partoPrematuro || 'N/A',
      },
      {
        id: 'partoAborto',
        label: t('partoAborto', 'Abortos'),
        value: lastAntecedent.partoAborto || 'N/A',
      },
      {
        id: 'partoNacidoVivo',
        label: t('partoNacidoVivo', 'Nacidos vivos'),
        value: lastAntecedent.partoNacidoVivo || 'N/A',
      },
    ];
  }, [formattedObs, config, t]);

  const headerTitle = t('prenatalAntecedents', 'Antecedentes Prenatales');

  if (isLoadingData) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;

  if (!formattedObs?.length) {
    return (
      <EmptyState
        displayText={t('prenatalAntecedents', 'Antecedentes Prenatales')}
        headerTitle={t('prenatalAntecedents', 'Antecedentes Prenatales')}
        launchForm={handleOpenOrEditPrenatalAntecedentsForm}
      />
    );
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        {isLoadingData && <InlineLoading description={t('loading', 'Loading...')} />}
        <Button
          kind="ghost"
          renderIcon={(props) => <Add size={16} {...props} />}
          onClick={handleOpenOrEditPrenatalAntecedentsForm}
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
