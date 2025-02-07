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
import { newbornDayPeriodSlots } from '../../utils/constants';

type NewbornMonitoringProps = {
  patientUuid: string;
};

const NewbornMonitoring: React.FC<NewbornMonitoringProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();

  //Esto debe salir enteramente de config!!
  const rowDefs = useMemo(
    () => [
      {
        id: 'weight',
        label: t('weight', 'Weight'),
        conceptUuid: config.concepts?.newbornWeightConceptUuid,
      },
      {
        id: 'depositionsCount',
        label: t('depositionsCount', 'Depositions Count'),
        conceptUuid: config.concepts?.newbornDepositionsCountUuid,
      },
      {
        id: 'depositionsGrams',
        label: t('depositionsGrams', 'Depositions (g)'),
        conceptUuid: config.concepts?.newbornDepositionsGramUuid,
      },
      {
        id: 'urinationCount',
        label: t('urinationCount', 'Urination Count'),
        conceptUuid: config.concepts?.newbornUrinationCountUuid,
      },
      {
        id: 'urineGrams',
        label: t('urineGrams', 'Urine (g)'),
        conceptUuid: config.concepts?.newbornUrineGramUuid,
      },
      {
        id: 'vomitCount',
        label: t('vomitCount', 'Vomit Count'),
        conceptUuid: config.concepts?.newbornVomitCountUuid,
      },
      {
        id: 'vomitAmount',
        label: t('vomitAmount', 'Vomit (g/ml)'),
        conceptUuid: config.concepts?.newbornVomitGramUuid,
      },
    ],
    [t, config.concepts],
  );

  // Esto sale del custom hook
  const [data] = useState(() => ({
    weight: Array(9).fill(''),
    depositionsCount: Array(9).fill(''),
    depositionsGrams: Array(9).fill(''),
    urinationCount: Array(9).fill(''),
    urineGrams: Array(9).fill(''),
    vomitCount: Array(9).fill(''),
    vomitAmount: Array(9).fill(''),
  }));

  // Corregir esto, chatgpt es una kk
  const tableHeaders = useMemo(() => {
    const baseHeaders = [
      {
        key: 'balance',
        header: t('balanceHeader', 'Balance'),
      },
    ];
    newbornDayPeriodSlots.forEach((slot) => {
      baseHeaders.push({
        key: slot.id,
        header: slot.label, // e.g., 'Day 1 - M (Morning)'
      });
    });
    return baseHeaders;
  }, [t]);

  // ????
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

      // Fill each day/period cell from data
      newbornDayPeriodSlots.forEach((slot, index) => {
        row[slot.id] = data[def.id][index] || '-';
      });
      return row;
    });
  }, [rowDefs, data]);

  // Launch a workspace for form entry
  const handleAddObservation = () => {
    launchWorkspace('newborn-monitoring-form', {
      workspaceTitle: t('newbornMonitoringForm', 'Newborn Balance Record'),
      additionalProps: {
        patientUuid,
        conceptMapping: rowDefs.map((r) => ({ id: r.id, conceptUuid: r.conceptUuid })),
      },
    });
  };

  return (
    <div className={styles.newbornMonitoring}>
      <h3 className={styles.title}>{t('newbornBalanceHeader', 'Newborn Balance')}</h3>

      <DataTable rows={tableRows} headers={tableHeaders} size="sm" useZebraStyles isSortable={false}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
          <TableContainer
            title={t('balanceHeader', 'Balance')}
            description={t('newbornBalanceDescription', 'Record of daily newborn data for the first 3 days.')}
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
          {t('addObservations', 'Add Observations')}
        </Button>
      </div>

      <hr className={styles.divider} />

      <section className={styles.footerLegend}>
        <h4>{t('periodsLegend', 'Legend of Periods:')}</h4>
        <ul>
          <li>
            <strong>M ({t('morning', 'Morning')}):</strong> 07:00 - 14:59
          </li>
          <li>
            <strong>T ({t('afternoon', 'Afternoon')}):</strong> 15:00 - 22:59
          </li>
          <li>
            <strong>N ({t('night', 'Night')}):</strong> 23:00 - 06:59
          </li>
        </ul>
      </section>
    </div>
  );
};

export default NewbornMonitoring;
