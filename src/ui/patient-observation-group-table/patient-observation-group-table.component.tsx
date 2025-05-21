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
  onFormLaunch?: (patientUuid: string) => void;
}

const PatientObservationGroupTable: React.FC<PatientObservationGroupTableProps> = ({
  patientUuid,
  headerTitle,
  displayText,
  dataHook,
  formWorkspace,
  onFormLaunch,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { data, isLoading, error, mutate } = dataHook(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

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

  const launchForm = useCallback(() => {
    try {
      if (!currentVisit) {
        launchStartVisitPrompt();
      } else {
        if (formWorkspace && typeof launchWorkspace === 'function') {
          launchWorkspace(formWorkspace, { patientUuid });
        } else if (onFormLaunch) {
          onFormLaunch(patientUuid);
        }
      }
    } catch (err) {
      console.error('Failed to launch form:', err);
    }
  }, [patientUuid, currentVisit, formWorkspace, onFormLaunch]);

  // Listen for esm-form-saved event and call mutate
  React.useEffect(() => {
    if (!mutate) return;
    const handler = () => {
      setTimeout(() => {
        mutate();
      }, 300); // 300ms delay to allow backend to persist data
    };
    window.addEventListener('esm-form-saved', handler);
    return () => {
      window.removeEventListener('esm-form-saved', handler);
    };
  }, [mutate]);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (data?.obs?.length > 0) {
    return (
      <div className={styles.widgetCard} role="region" aria-label={headerTitle}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
          {(formWorkspace || onFormLaunch) && (
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

  return (
    <EmptyState
      headerTitle={headerTitle}
      displayText={displayText}
      launchForm={formWorkspace || onFormLaunch ? launchForm : undefined}
    />
  );
};

export default React.memo(PatientObservationGroupTable);
