import React, { useState } from 'react';
import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TextInput,
  ComboBox,
} from '@carbon/react';
import { Add, Subtract, Save } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useImmunizationsConceptSet } from '../hooks/useImmunizationsConceptSet';
import styles from './immunization-plan-builder.scss';

interface ImmunizationPeriod {
  label: string;
  id: string;
}

interface Vaccine {
  id: number;
  name: string;
  periods: Record<string, boolean>;
}

const initialPeriods: ImmunizationPeriod[] = [
  { id: '0', label: 'R.N.' },
  { id: '2', label: '2 meses' },
  { id: '4', label: '4 meses' },
  { id: '6', label: '6 meses' },
  { id: '12', label: '12 meses' },
  { id: '15', label: '15 meses' },
  { id: '18', label: '18 meses' },
  { id: '24', label: '24 meses' },
];

const ImmunizationPlanBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null);

  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet({
    immunizationConceptSet: 'CIEL:984',
    sequenceDefinitions: [],
  });
  const availableVaccines = immunizationsConceptSet?.answers?.map((concept) => concept.display) || [];

  const toggleVaccinePeriod = (vaccineId: number, periodId: string) => {
    setVaccines(
      vaccines.map((vaccine) =>
        vaccine.id === vaccineId
          ? { ...vaccine, periods: { ...vaccine.periods, [periodId]: !vaccine.periods[periodId] } }
          : vaccine,
      ),
    );
  };

  const addNewVaccine = () => {
    if (selectedVaccine) {
      setVaccines([...vaccines, { id: vaccines.length + 1, name: selectedVaccine, periods: {} }]);
      setSelectedVaccine(null);
    }
  };

  const removeVaccine = (vaccineId: number) => {
    setVaccines(vaccines.filter((v) => v.id !== vaccineId));
  };

  return (
    <div className={styles.container}>
      <h2>{t('immunizationPlan', 'Esquema de Vacunación')}</h2>
      <div className={styles.controls}>
        <ComboBox
          items={availableVaccines}
          itemToString={(item) => item || ''}
          onChange={({ selectedItem }) => setSelectedVaccine(selectedItem)}
          placeholder={t('searchVaccine', 'Buscar vacuna')}
        />
        <Button kind="primary" onClick={addNewVaccine} renderIcon={Add}>
          {t('addVaccine', 'Agregar Vacuna')}
        </Button>
        <Button kind="secondary" renderIcon={Save}>
          {t('saveSchema', 'Guardar Esquema')}
        </Button>
      </div>
      <TableContainer title={t('vaccinationTable', 'Tabla de Vacunación')}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t('vaccine', 'Vacuna')}</TableHeader>
              {initialPeriods.map((period) => (
                <TableHeader key={period.id}>{period.label}</TableHeader>
              ))}
              <TableHeader>{t('action', 'Acción')}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccines.map((vaccine) => (
              <TableRow key={vaccine.id}>
                <TableCell>{vaccine.name}</TableCell>
                {initialPeriods.map((period) => (
                  <TableCell key={period.id}>
                    <Button
                      hasIconOnly
                      kind={vaccine.periods[period.id] ? 'danger' : 'tertiary'}
                      onClick={() => toggleVaccinePeriod(vaccine.id, period.id)}
                      iconDescription={vaccine.periods[period.id] ? t('remove', 'Eliminar') : t('add', 'Agregar')}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    hasIconOnly
                    kind="danger"
                    onClick={() => removeVaccine(vaccine.id)}
                    renderIcon={Subtract}
                    iconDescription={t('removeVaccine', 'Eliminar Vacuna')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ImmunizationPlanBuilder;
