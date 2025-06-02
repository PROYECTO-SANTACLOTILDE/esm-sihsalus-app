import {
  Button,
  DataTable,
  DataTableSkeleton,
  Dropdown,
  InlineLoading,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from '@carbon/react';
import {
  AddIcon,
  formatDate,
  isDesktop as isDesktopLayout,
  launchWorkspace,
  parseDate,
  showToast,
  useLayoutType,
  usePagination,
} from '@openmrs/esm-framework';
import { CardHeader, EmptyState, ErrorState, PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import classNames from 'classnames';
import React, { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConditionsActionMenu } from './conditions-action-menu.component';
import styles from './conditions-overview.scss';
import { type Condition, useConditionsSorting, usePediatricMedicalHistoryConditions } from './conditions.resource';

interface ConditionTableRow extends Condition {
  id: string;
  condition: string;
  abatementDateTime: string;
  onsetDateTimeRender: string;
}

interface ConditionTableHeader {
  key: 'display' | 'onsetDateTimeRender' | 'status';
  header: string;
  isSortable: true;
  sortFunc: (valueA: ConditionTableRow, valueB: ConditionTableRow) => number;
}

interface ConditionsOverviewProps {
  patientUuid: string;
}

const PediatricMedicalHistory: React.FC<ConditionsOverviewProps> = ({ patientUuid }) => {
  const conditionPageSize = 10;
  const { t } = useTranslation();

  // Cambiar los textos para reflejar el propósito específico
  const displayText = t('pediatricHistory', 'Antecedentes Patológicos del Menor');
  const headerTitle = t('pediatricHistory', 'Antecedentes Patológicos del Menor');
  const urlLabel = t('seeAll', 'Ver todos');
  const pageUrl = `\${openmrsSpaBase}/patient/${patientUuid}/chart/PediatricConditions`;

  const layout = useLayoutType();
  const isDesktop = isDesktopLayout(layout);
  const isTablet = !isDesktop;

  // Usar el hook mejorado que filtra por concept set
  const { conditions, error, isLoading, isValidating, refreshConditions, conceptSetMembers } =
    usePediatricMedicalHistoryConditions(patientUuid);

  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  // Función para manejar el workspace y refrescar datos automáticamente
  const launchConditionsForm = useCallback(() => {
    setIsWorkspaceOpen(true);
    launchWorkspace('child-medical-history-form-workspace', {
      patientUuid,
      formContext: 'creating',
      conceptSetMembers, // Pasar los miembros del concept set al workspace
      onSubmit: () => {
        // Esta función se ejecutará cuando se envíe el formulario
        setTimeout(() => {
          refreshConditions();
          setIsWorkspaceOpen(false);
          showToast({
            title: t('conditionAdded', 'Antecedente agregado'),
            kind: 'success',
            description: t('conditionAddedSuccessfully', 'El antecedente patológico se agregó correctamente'),
          });
        }, 1000); // Pequeño delay para permitir que la API procese
      },
      onCancel: () => {
        setIsWorkspaceOpen(false);
      },
    });
  }, [patientUuid, conceptSetMembers, refreshConditions, t]);

  const filteredConditions = useMemo(() => {
    if (!filter || filter === 'All') {
      return conditions;
    }
    return conditions?.filter((condition) => condition.clinicalStatus === filter);
  }, [filter, conditions]);

  const headers: Array<ConditionTableHeader> = useMemo(
    () => [
      {
        key: 'display',
        header: t('condition', 'Antecedente'),
        isSortable: true,
        sortFunc: (valueA, valueB) => valueA.display?.localeCompare(valueB.display),
      },
      {
        key: 'onsetDateTimeRender',
        header: t('dateOfOnset', 'Fecha de inicio'),
        isSortable: true,
        sortFunc: (valueA, valueB) =>
          valueA.onsetDateTime && valueB.onsetDateTime
            ? new Date(valueA.onsetDateTime).getTime() - new Date(valueB.onsetDateTime).getTime()
            : 0,
      },
      {
        key: 'status',
        header: t('status', 'Estado'),
        isSortable: true,
        sortFunc: (valueA, valueB) => valueA.clinicalStatus?.localeCompare(valueB.clinicalStatus),
      },
    ],
    [t],
  );

  const tableRows = useMemo(() => {
    return filteredConditions?.map((condition) => ({
      ...condition,
      id: condition.id,
      condition: condition.display,
      abatementDateTime: condition.abatementDateTime,
      onsetDateTimeRender: condition.onsetDateTime
        ? formatDate(parseDate(condition.onsetDateTime), { mode: 'wide', time: 'for today' })
        : '--',
      status: condition.clinicalStatus,
    }));
  }, [filteredConditions]);

  const { sortedRows, sortRow } = useConditionsSorting(headers, tableRows);
  const { results: paginatedConditions, goTo, currentPage } = usePagination(sortedRows, conditionPageSize);

  const handleConditionStatusChange = ({ selectedItem }) => setFilter(selectedItem);

  // Mostrar mensaje si no hay conceptos en el concept set
  if (conceptSetMembers && conceptSetMembers.length === 0 && !isLoading) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
          <div className={styles.rightMostFlexContainer}>
            <Button
              kind="ghost"
              renderIcon={(props: ComponentProps<typeof AddIcon>) => <AddIcon size={16} {...props} />}
              iconDescription="Agregar antecedente"
              onClick={launchConditionsForm}
              disabled
            >
              {t('add', 'Agregar')}
            </Button>
          </div>
        </CardHeader>
        <div className={styles.tileContainer}>
          <Tile className={styles.tile}>
            <div className={styles.tileContent}>
              <p className={styles.content}>
                {t(
                  'noConceptSetConfigured',
                  'No se ha configurado el conjunto de conceptos para Antecedentes Patológicos del Menor',
                )}
              </p>
              <p className={styles.helper}>
                {t(
                  'contactAdministrator',
                  'Contacte al administrador del sistema para configurar el concept set en OCL',
                )}
              </p>
            </div>
          </Tile>
        </div>
      </div>
    );
  }

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;

  if (conditions?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
          <div className={styles.rightMostFlexContainer}>
            <div className={styles.filterContainer}>
              <Dropdown
                id="conditionStatusFilter"
                initialSelectedItem={'Active'}
                label=""
                titleText={t('show', 'Mostrar') + ':'}
                type="inline"
                items={['All', 'Active', 'Inactive']}
                itemToString={(item) => {
                  switch (item) {
                    case 'All':
                      return t('all', 'Todos');
                    case 'Active':
                      return t('active', 'Activos');
                    case 'Inactive':
                      return t('inactive', 'Inactivos');
                    default:
                      return item;
                  }
                }}
                onChange={handleConditionStatusChange}
                size={isTablet ? 'lg' : 'sm'}
              />
            </div>
            <div className={styles.divider}>|</div>
            <Button
              kind="ghost"
              renderIcon={(props: ComponentProps<typeof AddIcon>) => <AddIcon size={16} {...props} />}
              iconDescription="Agregar antecedente patológico"
              onClick={launchConditionsForm}
              disabled={isWorkspaceOpen}
            >
              {t('add', 'Agregar')}
            </Button>
          </div>
        </CardHeader>
        <DataTable
          aria-label="pediatric medical history overview"
          rows={paginatedConditions}
          headers={headers}
          isSortable
          size={isTablet ? 'lg' : 'sm'}
          useZebraStyles
          overflowMenuOnHover={isDesktop}
          sortRow={sortRow}
        >
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <>
              <TableContainer className={styles.tableContainer}>
                <Table {...getTableProps()} className={styles.table}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader
                          className={classNames(styles.productiveHeading01, styles.text02)}
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable,
                          })}
                          key={header.key}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ))}
                        <TableCell className="cds--table-column-menu">
                          <ConditionsActionMenu condition={row} patientUuid={patientUuid} mutate={refreshConditions} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {rows.length === 0 ? (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>
                        {t('noConditionsToDisplay', 'No hay antecedentes patológicos para mostrar')}
                      </p>
                      <p className={styles.helper}>{t('checkFilters', 'Verifique los filtros anteriores')}</p>
                    </div>
                  </Tile>
                </div>
              ) : null}
            </>
          )}
        </DataTable>
        <PatientChartPagination
          currentItems={paginatedConditions.length}
          onPageNumberChange={({ page }) => goTo(page)}
          pageNumber={currentPage}
          pageSize={conditionPageSize}
          totalItems={filteredConditions.length}
          dashboardLinkUrl={pageUrl}
          dashboardLinkLabel={urlLabel}
        />
      </div>
    );
  }

  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchConditionsForm} />;
};

export default PediatricMedicalHistory;
