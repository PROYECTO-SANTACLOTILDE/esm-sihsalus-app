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
  DataTableSkeleton,
} from '@carbon/react';
import {
  CardHeader,
  EmptyState,
  ErrorState,
  useVisitOrOfflineVisit,
  launchStartVisitPrompt,
} from '@openmrs/esm-patient-common-lib';
import { launchWorkspace, useLayoutType } from '@openmrs/esm-framework';
import styles from './patient-observation-group-table.scss';

interface ObsGroupMember {
  uuid: string;
  display: string;
}

interface ObsEncounter {
  obs: Array<{
    display: string;
    groupMembers?: ObsGroupMember[];
  }>;
}

interface DataHookResponse {
  data: ObsEncounter | null;
  isLoading: boolean;
  error: Error | null;
  mutate?: () => Promise<any>;
}

export interface ObservationRow {
  id: string;
  category: { content: string };
  value: { content: string };
}

export interface ObservationGroup {
  title: string;
  rows: ObservationRow[];
}

interface PatientObservationGroupTableProps {
  patientUuid: string;
  headerTitle: string;
  displayText: string;
  dataHook: (patientUuid: string) => DataHookResponse;
  formWorkspace?: string;
}

/**
 * A reusable table component for displaying patient groups of observations data in a card format with pagination.
 * @template T - The shape of the data returned by the dataHook
 */
const PatientObservationGroupTable: React.FC<PatientObservationGroupTableProps> = ({
  patientUuid,
  headerTitle,
  displayText,
  dataHook,
  formWorkspace,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { data, isLoading, error, mutate } = dataHook(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const launchForm = useCallback(() => {
    try {
      if (!currentVisit) {
        launchStartVisitPrompt();
      } else {
        if (formWorkspace) {
          launchWorkspace('patient-form-entry-workspace', {
            workspaceTitle: headerTitle,
            mutateForm: mutate,
            formInfo: { formUuid: formWorkspace, patientUuid, additionalProps: {} },
          });
        }
      }
      if (mutate) {
        setTimeout(() => mutate(), 1000);
      }
    } catch (err) {
      console.error('Failed to launch form:', err);
    }
  }, [patientUuid, currentVisit, formWorkspace, headerTitle, mutate]);

  // Utility to parse observation display
  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

  // Transform observations into group data
  const groupsConfig = useMemo(() => {
    if (!data?.obs) return [];
    return data.obs.map((obs) => {
      const { category: title } = parseDisplay(obs.display);
      const rows =
        obs.groupMembers?.map((member, idx) => {
          const { category, value } = parseDisplay(member.display);
          return {
            id: `row-${member.uuid || idx}`,
            category: { content: category },
            value: { content: value },
          };
        }) || [];
      return { title, rows };
    });
  }, [data]);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (data) {
    return (
      <div className={styles.widgetCard} role="region" aria-label={headerTitle}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
          {formWorkspace && (
            <Button onClick={launchForm} kind="ghost">
              {t('edit', 'Edit')}
            </Button>
          )}
        </CardHeader>

        {groupsConfig.map((group) => (
          <div className={styles.widgetCard} style={{ marginBottom: 20 }} key={`table-${group.title}`}>
            <DataTable
              rows={group.rows}
              headers={[
                { key: 'category', header: 'Categoría' },
                { key: 'value', header: 'Valor' },
              ]}
              isSortable
              size="sm"
              useZebraStyles
            >
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer style={{ width: '100%' }}>
                  <Table aria-label={`Tabla de ${group.title}`} {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader key={header.key} {...getHeaderProps({ header, isSortable: header.isSortable })}>
                            {header.header}
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
        ))}
      </div>
    );
  }

  return <EmptyState headerTitle={headerTitle} displayText={displayText} launchForm={launchForm} />;
};

export default React.memo(PatientObservationGroupTable);
