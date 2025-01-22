import React, { useState } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DismissibleTag,
  Tag,
  SelectableTag,
  OverflowMenu,
  OverflowMenuItem,
  Button,
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/react/icons';
import { type UIVaccineData } from '../../types/vaccination-ui-types';
import styles from './vaccinationScheduleTable.style.scss';
import { TableContainer } from '@carbon/react';
import { TableToolbarContent } from '@carbon/react';
import { TableToolbar } from '@carbon/react';
import { TableToolbarSearch } from '@carbon/react';
import { TableToolbarMenu } from '@carbon/react';
import { TableToolbarAction } from '@carbon/react';
import { Modal } from '@carbon/react';
import SearchVaccine from '../search-by-vaccines/search-vaccine/search-vaccine.component';
import { type ImmunizationData, type ImmunizationWidgetConfigObject } from '../../types/fhir-immunization-domain';
import { t } from 'i18next';

const headers = [
  { key: 'rangeDateFrom', header: 'Inicio' },
  { key: 'rangeDateTo', header: 'Fin' },
  { key: 'vaccines', header: 'Vacunas' },
  { key: 'actions', header: 'Acciones' },
];

const rows = [
  { id: '1', age: '2 meses', vaccines: 'BCG, Hepatitis B' },
  { id: '2', age: '4 meses', vaccines: 'Pentavalente, Polio, Rotavirus' },
  { id: '3', age: '6 meses', vaccines: 'Pentavalente, Polio, Rotavirus' },
  { id: '4', age: '12 meses', vaccines: 'SPR (sarampión, paperas, rubéola)' },
  { id: '5', age: '18 meses', vaccines: 'Refuerzo SPR, Polio, DPT' },
  { id: '6', age: '4 años', vaccines: 'Refuerzo Polio, DPT' },
];

const immunizationsConfig: ImmunizationWidgetConfigObject = {
  immunizationConceptSet: 'CIEL:984',
  sequenceDefinitions: [],
};

type VaccineDataArray = UIVaccineData[];

interface VaccinationScheduleTableProps {
  data: VaccineDataArray;
  onUpdatePeriod: (vaccineData: UIVaccineData) => void;
  onRemovePeriod: (periodId: string) => void;
}

const VaccinationScheduleTable: React.FC<VaccinationScheduleTableProps> = (props) => {
  const [openVaccinationMoldal, setOpenVaccinationMoldal] = useState(false);
  const [vaccineData, setVaccineData] = useState<UIVaccineData | null>(null);

  const formatVaccinationTable = (data: VaccineDataArray) => {
    return data.map((vaccineData) => {
      return {
        id: vaccineData.id,
        rangeDateFrom: `${vaccineData.eligible_date_range.from.value} ${vaccineData.eligible_date_range.from.unit}`,
        rangeDateTo: `${vaccineData.eligible_date_range.to.value} ${vaccineData.eligible_date_range.to.unit}`,
        vaccines: vaccineData.vaccines.map((vaccine) => (
          <Tag className={styles.vaccineTag} size="md">
            {vaccine.vaccineName}
          </Tag>
        )),
        actions: (
          <div className={styles.actionsContainer}>
            <Button
              renderIcon={Edit}
              kind="ghost"
              size="sm"
              iconDescription="Icon Description"
              hasIconOnly
              onClick={() => {
                setVaccineData(vaccineData);
                setOpenVaccinationMoldal(true);
              }}
            />
            <Button
              renderIcon={TrashCan}
              kind="ghost"
              size="sm"
              iconDescription="Icon Description"
              hasIconOnly
              onClick={() => props.onRemovePeriod(vaccineData.id)}
            />
          </div>
        ),
      };
    });
  };

  const addNewPeriod = () => {
    setVaccineData({
      id: new Date().getTime().toString(),
      vaccines: [],
      eligible_date_range: {
        // TODO: make this dynamic
        from: {
          unit: 'years',
          value: 0,
        },
        to: {
          unit: 'months',
          value: 1,
        },
      },
    });
    setOpenVaccinationMoldal(true);
  };

  const removeVaccineFromPeriod = (vaccinationId: string) => {
    const updatedVaccineData = vaccineData;
    updatedVaccineData.vaccines = updatedVaccineData.vaccines.filter(
      (vaccine) => vaccine.vaccineUuid !== vaccinationId,
    );
    setVaccineData(updatedVaccineData);
  };

  const updateSelectedVaccines = (selectedVaccines: ImmunizationData[]) => {
    const updatedVaccineData = vaccineData;
    updatedVaccineData.vaccines = selectedVaccines;
    setVaccineData({ ...updatedVaccineData });
  };

  return (
    <div className={styles.vaccinationTableContainer}>
      <h2>Esquema Regular de Vacunación</h2>
      <br />
      <DataTable rows={formatVaccinationTable(props.data)} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableContainerProps, getToolbarProps }) => (
          <TableContainer {...getTableContainerProps()} className={styles.tableContainer}>
            <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
              <TableToolbarContent>
                <Button onClick={addNewPeriod}>Añadir periodo</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
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
      {openVaccinationMoldal ? (
        <Modal
          className={styles.vaccinationModal}
          aria-label="Registrar o editar modal"
          onRequestClose={(e) => {
            setOpenVaccinationMoldal(false);
          }}
          onRequestSubmit={(e) => {
            props.onUpdatePeriod(vaccineData);
            setOpenVaccinationMoldal(false);
          }}
          modalHeading={vaccineData ? 'Editar periodo' : 'Añadir periodo'}
          primaryButtonText={vaccineData ? 'Guardar' : 'Agregar'}
          secondaryButtonText="Cancelar"
          open={openVaccinationMoldal}
        >
          <h3>{t('searchVaccines', 'Search Vaccines')}</h3>
          <p
            style={{
              marginBottom: '1rem',
            }}
          >
            <SearchVaccine
              immunizationsConfig={immunizationsConfig}
              selectedVaccines={vaccineData.vaccines}
              setSelectedVaccines={updateSelectedVaccines}
            />
            <br />
            <div>
              {vaccineData &&
                vaccineData.vaccines.map((vaccine, index) => (
                  <DismissibleTag
                    key={index}
                    className=""
                    text={vaccine.vaccineName}
                    tagTitle={vaccine.vaccineName}
                    title="Eliminar"
                    onClose={(e) => {
                      e.preventDefault();
                      removeVaccineFromPeriod(vaccine.vaccineUuid);
                    }}
                  />
                ))}
            </div>
          </p>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default VaccinationScheduleTable;
