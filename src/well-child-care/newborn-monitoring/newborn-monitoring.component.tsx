import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
} from '@carbon/react';
import { launchWorkspace, useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import styles from './newborn-monitoring.scss';
import type { ConfigObject } from '../../config-schema';
import { days, periods } from '../../utils/constants';
type NewbornMonitoringProps = {
  patientUuid: string;
};

const NewbornMonitoring: React.FC<NewbornMonitoringProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const rowDefs = useMemo(
    () => [
      { id: 'weight', label: t('weight', 'Peso'), conceptUuid: config.concepts?.newbornWeightConceptUuid },
      {
        id: 'depositionsCount',
        label: t('depositionsCount', 'N° de deposiciones'),
        conceptUuid: config.concepts?.newbornDepositionsCountUuid,
      },
      {
        id: 'depositionsGrams',
        label: t('depositionsGrams', 'Deposiciones (gr)'),
        conceptUuid: config.concepts?.newbornDepositionsGramUuid,
      },
      {
        id: 'urinationCount',
        label: t('urinationCount', 'N° de micciones'),
        conceptUuid: config.concepts?.newbornUrinationCountUuid,
      },
      { id: 'urineGrams', label: t('urineGrams', 'Orina (gr)'), conceptUuid: config.concepts?.newbornUrineGramUuid },
      { id: 'vomitCount', label: t('vomitCount', 'N° Vómito'), conceptUuid: config.concepts?.newbornVomitCountUuid },
      {
        id: 'vomitAmount',
        label: t('vomitAmount', 'Vómito (gr/ml)'),
        conceptUuid: config.concepts?.newbornVomitGramUuid,
      },
    ],
    [t, config.concepts],
  );
  const [data] = useState(() => ({
    weight: Array(9).fill(''),
    depositionsCount: Array(9).fill(''),
    depositionsGrams: Array(9).fill(''),
    urinationCount: Array(9).fill(''),
    urineGrams: Array(9).fill(''),
    vomitCount: Array(9).fill(''),
    vomitAmount: Array(9).fill(''),
  }));
  const tableHeaders = useMemo(() => {
    const baseHeaders = [{ key: 'balance', header: t('balanceHeader', 'Balance') }];
    let idx = 0;
    days.forEach((day) => {
      periods.forEach((period) => {
        idx++;
        baseHeaders.push({ key: `day${day}_${period}`, header: `${t('day', 'Día')} ${day} ${period}` });
      });
    });
    return baseHeaders;
  }, [t]);
  const tableRows = useMemo(() => {
    return rowDefs.map((def) => {
      const row: Record<string, string | JSX.Element> = {
        id: def.id,
        balance: (
          <div className={classNames(styles.balanceCell)}>
            <strong>{def.label}</strong>
            {def.conceptUuid && <small className={styles.conceptTag}>({def.conceptUuid})</small>}
          </div>
        ),
      };
      let arrayIndex = 0;
      days.forEach((day) => {
        periods.forEach((period) => {
          row[`day${day}_${period}`] = data[def.id][arrayIndex] || '-';
          arrayIndex++;
        });
      });
      return row;
    });
  }, [rowDefs, data]);
  const handleAddObservation = () => {
    launchWorkspace('newborn-monitoring-form', {
      workspaceTitle: t('newbornMonitoringForm', 'Registro de Balance del Recién Nacido'),
      additionalProps: {
        patientUuid,
        conceptMapping: rowDefs.map((r) => ({ id: r.id, conceptUuid: r.conceptUuid })),
      },
    });
  };
  return (
    <div className={styles.newbornMonitoring}>
      <h3 className={styles.title}>{t('newbornBalanceHeader', 'Balance del Recién Nacido')}</h3>
      <DataTable rows={tableRows} headers={tableHeaders} size="sm" useZebraStyles isSortable={false}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
          <TableContainer
            title={t('balanceHeader', 'Balance')}
            description={t('newbornBalanceDescription', 'Valores de balance por día y turno.')}
            {...getTableContainerProps()}
          >
            <Table {...getTableProps()} className={styles.dataTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })} className={styles.tableHeaderCell}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} className={styles.tableCell}>
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <div className={styles.buttonContainer}>
        <Button kind="tertiary" onClick={handleAddObservation}>
          {t('addObservations', 'Añadir Observaciones')}
        </Button>
      </div>
      <hr className={styles.divider} />
      <section className={styles.footerLegend}>
        <h4>{t('periodsLegend', 'Leyenda de Períodos:')}</h4>
        <ul>
          <li>
            <strong>M ({t('morning', 'Mañana')}):</strong> 07:00 - 14:59 hrs
          </li>
          <li>
            <strong>T ({t('afternoon', 'Tarde')}):</strong> 15:00 - 22:59 hrs
          </li>
          <li>
            <strong>N ({t('night', 'Noche')}):</strong> 23:00 - 06:59 hrs
          </li>
        </ul>
      </section>
    </div>
  );
};

export default NewbornMonitoring;
