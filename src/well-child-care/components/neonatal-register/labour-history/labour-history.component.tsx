import React, { useCallback, useMemo } from 'react';
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
import classNames from 'classnames';
import {
  launchStartVisitPrompt,
  CardHeader,
  EmptyState,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import { useConfig, useLayoutType } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { useCurrentPregnancy } from '../../../../hooks/useCurrentPregnancy';
import styles from './labour-history.scss';

interface LabourHistoryProps {
  patientUuid: string;
}

const LabourHistory: React.FC<LabourHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const config = useConfig();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const { prenatalEncounter, error, isValidating, mutate } = useCurrentPregnancy(patientUuid);
  const formAntenatalUuid = config.formsList?.currentPregnancy;
  const prenatalControl = config.encounterTypes.prenatalControl;

  const tableHeaders = useMemo(
    () => [
      { header: t('category', 'Category'), key: 'category' },
      { header: t('value', 'Value'), key: 'value' },
    ],
    [t],
  );

  const parseDisplayString = useCallback((display: string) => {
    const [category, ...valueParts] = display.split(': ');
    return {
      category: category || display,
      value: valueParts.length ? valueParts.join(': ') : '',
    };
  }, []);

  const createRowsFromGroupMembers = useCallback(
    (groupMembers) => {
      if (!Array.isArray(groupMembers) || !groupMembers.length) return [];

      return groupMembers.map((member, index) => {
        const { category, value } = parseDisplayString(member.display || '');
        return {
          id: member.uuid || `row-${index}`,
          category: { content: category },
          value: { content: value },
        };
      });
    },
    [parseDisplayString],
  );

  const observationTables = useMemo(() => {
    if (!prenatalEncounter?.obs) return [];

    return prenatalEncounter.obs.map((obs) => ({
      title: parseDisplayString(obs.display).category,
      rows: createRowsFromGroupMembers(obs.groupMembers || []),
    }));
  }, [prenatalEncounter, parseDisplayString, createRowsFromGroupMembers]);

  const handleAddPrenatalAttention = useCallback(() => {
    if (!currentVisit) {
      launchStartVisitPrompt();
      return;
    }

    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('labourDetails', 'Labour Details'),
      formInfo: {
        encounterUuid: prenatalControl,
        formUuid: formAntenatalUuid,
        additionalProps: {},
      },
    });
  }, [currentVisit, formAntenatalUuid, t]);

  const renderTable = useCallback(
    (title: string, rows: any[]) => (
      <div className={styles.widgetCard} key={`table-${title}`} style={{ marginBottom: '1rem' }}>
        {rows.length > 0 ? (
          <>
            <CardHeader title={title}>
              {isValidating && <InlineLoading description={t('loading', 'Loading...')} />}
            </CardHeader>
            <DataTable rows={rows} headers={tableHeaders} size={isTablet ? 'lg' : 'sm'} useZebraStyles>
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer>
                  <Table {...getTableProps()} aria-label={`Labour details - ${title}`}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader
                            key={header.key}
                            className={classNames(styles.productiveHeading01, styles.text02)}
                            {...getHeaderProps({ header })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value?.content || ''}</TableCell>
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
            displayText={t('noLabourData', 'No labour details available')}
            launchForm={handleAddPrenatalAttention}
          />
        )}
      </div>
    ),
    [tableHeaders, isTablet, isValidating, t, handleAddPrenatalAttention],
  );

  if (error) {
    return <div>{t('errorLoading', 'Error loading labour history: ' + error.message)}</div>;
  }

  return (
    <div className={styles.labourHistoryContainer}>
      <div className={styles.buttonContainer}>
        <Button onClick={handleAddPrenatalAttention} kind="ghost">
          {t('addEditLabourDetails', 'Add/Edit Labour Details')}
        </Button>
      </div>

      {isValidating && !prenatalEncounter ? (
        <InlineLoading description={t('loading', 'Loading...')} />
      ) : prenatalEncounter ? (
        observationTables.map(({ title, rows }) => renderTable(title, rows))
      ) : (
        <EmptyState
          headerTitle={t('labourHistory', 'Labour History')}
          displayText={t('noLabourData', 'No labour details available')}
          launchForm={handleAddPrenatalAttention}
        />
      )}
    </div>
  );
};

export default LabourHistory;
