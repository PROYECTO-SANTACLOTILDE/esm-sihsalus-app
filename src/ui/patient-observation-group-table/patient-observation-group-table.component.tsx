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
import { Add } from '@carbon/react/icons';

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
  error: any;
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

import { useFilteredEncounter } from '../../hooks/useFilteredEncounter';

interface PatientObservationGroupTableProps {
  patientUuid: string;
  headerTitle: string;
  displayText: string;
  encounterType: string;
  formUuid: string;
  formWorkspace?: string;
}

const PatientObservationGroupTable: React.FC<PatientObservationGroupTableProps> = ({
  patientUuid,
  headerTitle,
  displayText,
  encounterType,
  formUuid,
  formWorkspace,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const {
    prenatalEncounter: data,
    isLoading,
    error,
    mutate,
  } = useFilteredEncounter(patientUuid, encounterType, formUuid);
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

  const parseDisplay = (display: string) => {
    const [category, ...rest] = display.split(': ');
    return {
      category,
      value: rest.join(': ') || '',
    };
  };

  // Filtra solo los obs que tienen groupMembers válidos
  const groupsConfig = useMemo(() => {
    if (!data?.obs) return [];
    return data.obs
      .filter((obs) => Array.isArray(obs.groupMembers) && obs.groupMembers.length > 0)
      .map((obs) => {
        const { category: title } = parseDisplay(obs.display);
        const rows = obs.groupMembers!.map((member, idx) => {
          const { category, value } = parseDisplay(member.display);
          return {
            id: `row-${member.uuid || idx}`,
            category: { content: category },
            value: { content: value },
          };
        });
        return { title, rows };
      });
  }, [data]);

  // Mostrar skeleton mientras carga (aunque obs ya tenga datos parciales)
  if (isLoading && (!data?.obs || data.obs.length === 0)) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  // Mostrar EmptyState solo si terminó de cargar, hay data y no hay grupos válidos
  if (!isLoading && data && groupsConfig.length === 0) {
    return <EmptyState headerTitle={headerTitle} displayText={displayText} launchForm={launchForm} />;
  }

  return (
    <div className={styles.widgetCard} role="region" aria-label={headerTitle}>
      <CardHeader title={headerTitle}>
        {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
        {formWorkspace && (
          <Button
            kind="ghost"
            renderIcon={(props) => <Add size={16} {...props} />}
            onClick={launchForm}
            aria-label={t('add')}
          >
            {t('edit', 'Edit')}
          </Button>
        )}
      </CardHeader>

      {groupsConfig.map((group) => (
        <DataTable
          key={group.title}
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
      ))}
    </div>
  );
};

export default React.memo(PatientObservationGroupTable);
