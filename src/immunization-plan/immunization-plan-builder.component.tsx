import React, { useState, useCallback } from 'react';
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
  ComboBox,
  Loading,
  InlineNotification,
  Modal,
} from '@carbon/react';
import { Add, Subtract, Save, Warning } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useImmunizationsConceptSet } from '../hooks/useImmunizationsConceptSet';
import styles from './immunization-plan-builder.scss';

interface ImmunizationPeriod {
  label: string;
  id: string;
  minAge?: number;
  maxAge?: number;
}

interface Vaccine {
  id: number;
  name: string;
  uuid?: string;
  periods: Record<
    string,
    {
      status: 'required' | 'optional' | 'conditional';
      notes?: string;
    }
  >;
}

const initialPeriods: ImmunizationPeriod[] = [
  { id: '0', label: 'R.N.', maxAge: 1 },
  { id: '2', label: '2 meses', minAge: 2, maxAge: 3 },
  { id: '4', label: '4 meses', minAge: 4, maxAge: 5 },
  { id: '6', label: '6 meses', minAge: 6, maxAge: 7 },
  { id: '12', label: '12 meses', minAge: 12, maxAge: 14 },
  { id: '15', label: '15 meses', minAge: 15, maxAge: 17 },
  { id: '18', label: '18 meses', minAge: 18, maxAge: 20 },
  { id: '24', label: '24 meses', minAge: 24, maxAge: 26 },
];

const ImmunizationPlanBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState<Vaccine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const {
    immunizationsConceptSet,
    isLoading,
    error: conceptError,
  } = useImmunizationsConceptSet({
    immunizationConceptSet: 'CIEL:984',
    sequenceDefinitions: [],
  });

  const availableVaccines =
    immunizationsConceptSet?.answers?.map((concept) => ({
      id: concept.uuid,
      text: concept.display,
    })) || [];

  const toggleVaccinePeriod = useCallback((vaccineId: number, periodId: string) => {
    setVaccines((prev) =>
      prev.map((vaccine) => {
        if (vaccine.id === vaccineId) {
          const newPeriods = { ...vaccine.periods };
          if (newPeriods[periodId]) {
            delete newPeriods[periodId];
          } else {
            newPeriods[periodId] = { status: 'required' };
          }
          return { ...vaccine, periods: newPeriods };
        }
        return vaccine;
      }),
    );
    setIsDirty(true);
  }, []);

  const addNewVaccine = useCallback(() => {
    if (selectedVaccine) {
      const selectedConcept = immunizationsConceptSet?.answers?.find((concept) => concept.display === selectedVaccine);

      if (selectedConcept) {
        setVaccines((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            name: selectedVaccine,
            uuid: selectedConcept.uuid,
            periods: {},
          },
        ]);
        setSelectedVaccine(null);
        setIsDirty(true);
      }
    }
  }, [selectedVaccine, immunizationsConceptSet]);

  const removeVaccine = useCallback((vaccineId: number) => {
    setVaccines((prev) => prev.filter((v) => v.id !== vaccineId));
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    try {
      // TODO: Implement save logic
      setIsDirty(false);
      // Show success notification
    } catch (err) {
      setError('Error saving vaccination schema');
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'required':
        return <div className={styles.requiredDot} />;
      case 'optional':
        return <div className={styles.optionalDot} />;
      case 'conditional':
        return <div className={styles.conditionalDot} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loading description={t('loading', 'Loading vaccination data...')} />;
  }

  if (conceptError) {
    return (
      <InlineNotification
        kind="error"
        title={t('error', 'Error')}
        subtitle={t('errorLoadingConcepts', 'Error loading vaccination concepts')}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t('immunizationPlan', 'Esquema de Vacunación')}</h2>
        {isDirty && (
          <InlineNotification
            kind="warning"
            title={t('unsavedChanges', 'Unsaved Changes')}
            subtitle={t('saveReminder', 'Remember to save your changes')}
            lowContrast
          />
        )}
      </div>

      <div className={styles.controls}>
        <ComboBox
          id="vaccine-selector"
          items={availableVaccines}
          onChange={({ selectedItem }) => setSelectedVaccine(selectedItem?.text)}
          placeholder={t('searchVaccine', 'Buscar vacuna')}
          titleText={t('selectVaccine', 'Select Vaccine')}
          helperText={t('searchHelper', 'Search and select a vaccine to add')}
          disabled={isLoading}
          itemToString={(item) => (item ? item.text : '')}
        />
        <Button kind="primary" onClick={addNewVaccine} renderIcon={Add} disabled={!selectedVaccine || isLoading}>
          {t('addVaccine', 'Agregar Vacuna')}
        </Button>
        <Button kind="secondary" renderIcon={Save} onClick={handleSave} disabled={!isDirty || isLoading}>
          {t('saveSchema', 'Guardar Esquema')}
        </Button>
      </div>

      <TableContainer title={t('vaccinationTable', 'Tabla de Vacunación')}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t('vaccine', 'Vacuna')}</TableHeader>
              {initialPeriods.map((period) => (
                <TableHeader key={period.id}>
                  {period.label}
                  {period.minAge && (
                    <div className={styles.ageRange}>
                      {t('ageRange', '{{min}}-{{max}} months', {
                        min: period.minAge,
                        max: period.maxAge,
                      })}
                    </div>
                  )}
                </TableHeader>
              ))}
              <TableHeader>{t('action', 'Acción')}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccines.map((vaccine) => (
              <TableRow key={vaccine.id}>
                <TableCell>{vaccine.name}</TableCell>
                {initialPeriods.map((period) => (
                  <TableCell key={period.id} className={styles.periodCell}>
                    <Button
                      hasIconOnly
                      kind={vaccine.periods[period.id] ? 'danger' : 'ghost'}
                      onClick={() => toggleVaccinePeriod(vaccine.id, period.id)}
                      className={styles.periodButton}
                      renderIcon={() => getStatusIcon(vaccine.periods[period.id]?.status)}
                      iconDescription={vaccine.periods[period.id] ? t('remove', 'Remove dose') : t('add', 'Add dose')}
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

      {error && (
        <InlineNotification kind="error" title={t('error', 'Error')} subtitle={error} onClose={() => setError(null)} />
      )}

      <Modal
        open={isModalOpen}
        modalHeading={t('editDose', 'Edit Dose Details')}
        primaryButtonText={t('save', 'Save')}
        secondaryButtonText={t('cancel', 'Cancel')}
        onRequestClose={() => setIsModalOpen(false)}
      >
        {/* Add dose editing form here */}
      </Modal>
    </div>
  );
};

export default ImmunizationPlanBuilder;
