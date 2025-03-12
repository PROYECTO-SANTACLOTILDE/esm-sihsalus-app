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
import { launchGenericForm } from '../../newborn-monitoring/utils';
import { useConfig, usePatient, useLayoutType } from '@openmrs/esm-framework';
import { usePrenatalAntecedents, usePrenatalConceptMetadata } from '../../../../hooks/usePrenatalAntecedents';
import styles from './prenatal-history.scss';
import type { ConfigObject } from '../../../../config-schema';

interface NeonatalSummaryProps {
  patientUuid: string;
}

const PrenatalAntecedents: React.FC<NeonatalSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const displayText = t('biometrics_lower', 'biometrics');
  const headerTitle = t('prenatalAntecedents', 'Antecedentes Prenatales');
  const isTablet = useLayoutType() === 'tablet';

  const config = useConfig<ConfigObject>();
  const { data: formattedObs, isLoading, error, mutate } = usePrenatalAntecedents(patientUuid);
  const { data: conceptUnits } = usePrenatalConceptMetadata();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const launchPerinatalForm = useCallback(() => {
    launchGenericForm(currentVisit, 'perinatal-register-form');
  }, [currentVisit]);

  const tableRows = useMemo(() => {
    if (!formattedObs?.length) return [];

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
  }, [formattedObs, t]);

  if (isLoading) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (formattedObs?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('loading', 'Loading...')} />}
          <Button kind="ghost" renderIcon={(props) => <Add size={16} {...props} />} onClick={launchPerinatalForm}>
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
  }
  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchPerinatalForm} />;
};

export default PrenatalAntecedents;
