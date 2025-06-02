import React, { type Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { type TFunction, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/plugin/utc';
import {
  DatePicker,
  DatePickerInput,
  FormGroup,
  FormLabel,
  InlineLoading,
  Layer,
  RadioButton,
  RadioButtonGroup,
  Search,
  Stack,
  Tile,
  Dropdown,
} from '@carbon/react';
import { WarningFilled } from '@carbon/react/icons';
import { useFormContext, Controller } from 'react-hook-form';
import { showSnackbar, useDebounce, useSession, ResponsiveWrapper } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import {
  type Condition,
  type FormFields,
  createCondition,
  updateCondition,
  usePediatricMedicalHistoryConditions,
} from '../../components/neonatal-register/family-history/conditions.resource';
import { type ChildMedicalHistoryFormSchema } from './child-medical-history-form.workspace';
import styles from './conditions-form.scss';

interface ChildMedicalHistoryWidgetProps {
  closeWorkspaceWithSavedChanges?: DefaultPatientWorkspaceProps['closeWorkspaceWithSavedChanges'];
  conditionToEdit?: Condition;
  isEditing?: boolean;
  isSubmittingForm: boolean;
  patientUuid: string;
  setErrorCreating?: (error: Error) => void;
  setErrorUpdating?: (error: Error) => void;
  setHasSubmissibleValue?: (value: boolean) => void;
  setIsSubmittingForm: Dispatch<boolean>;
  conceptSetMembers?: Array<any>;
}

interface RequiredFieldLabelProps {
  label: string;
  t: TFunction;
}

interface ConceptSearchResultsProps {
  isLoading: boolean;
  onConceptChange: (concept: any) => void;
  searchResults: any[];
  selectedConcept: any;
  t: TFunction;
  value: string;
}

const ChildMedicalHistoryWidget: React.FC<ChildMedicalHistoryWidgetProps> = ({
  closeWorkspaceWithSavedChanges,
  conditionToEdit,
  isEditing,
  isSubmittingForm,
  patientUuid,
  setErrorCreating,
  setErrorUpdating,
  setIsSubmittingForm,
  conceptSetMembers,
}) => {
  const { t } = useTranslation();
  const { conditions, refreshConditions } = usePediatricMedicalHistoryConditions(patientUuid);
  const {
    control,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useFormContext<ChildMedicalHistoryFormSchema>();
  const session = useSession();
  const searchInputRef = useRef(null);
  const clinicalStatus = watch('clinicalStatus');
  const matchingCondition = conditions?.find((condition) => condition?.id === conditionToEdit?.id);

  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConcepts, setFilteredConcepts] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtrar conceptos basándose en el término de búsqueda
  useEffect(() => {
    if (conceptSetMembers && debouncedSearchTerm) {
      const filtered = conceptSetMembers.filter((concept) =>
        concept.display?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
      setFilteredConcepts(filtered);
    } else {
      setFilteredConcepts([]);
    }
  }, [conceptSetMembers, debouncedSearchTerm]);

  const handleConceptChange = useCallback(
    (selectedConcept: any) => {
      setSelectedConcept(selectedConcept);
      setValue('conceptId', selectedConcept.uuid);
      setValue('conditionName', selectedConcept.display);
      setSearchTerm(selectedConcept.display);
      setFilteredConcepts([]);
    },
    [setValue],
  );

  const handleCreate = useCallback(async () => {
    if (!selectedConcept && !getValues('conceptId')) {
      return;
    }

    const payload: FormFields = {
      clinicalStatus: getValues('clinicalStatus'),
      conceptId: getValues('conceptId') || selectedConcept?.uuid,
      display: getValues('conditionName'),
      abatementDateTime: getValues('abatementDateTime') ? dayjs(getValues('abatementDateTime')).format() : null,
      onsetDateTime: getValues('onsetDateTime') ? dayjs(getValues('onsetDateTime')).format() : dayjs().format(),
      patientId: patientUuid,
      userId: session?.user?.uuid,
    };

    try {
      await createCondition(payload);
      await refreshConditions();

      showSnackbar({
        kind: 'success',
        subtitle: t('conditionNowVisible', 'Ahora es visible en la página de Antecedentes Patológicos'),
        title: t('conditionSaved', 'Antecedente patológico guardado'),
      });

      closeWorkspaceWithSavedChanges();
    } catch (error) {
      setIsSubmittingForm(false);
      setErrorCreating(error);
    }
  }, [
    closeWorkspaceWithSavedChanges,
    getValues,
    refreshConditions,
    patientUuid,
    selectedConcept,
    session?.user?.uuid,
    setErrorCreating,
    setIsSubmittingForm,
    t,
  ]);

  const handleUpdate = useCallback(async () => {
    const payload: FormFields = {
      clinicalStatus: getValues('clinicalStatus'),
      conceptId: matchingCondition?.conceptId,
      display: getValues('conditionName'),
      abatementDateTime: getValues('abatementDateTime') ? dayjs(getValues('abatementDateTime')).format() : null,
      onsetDateTime: getValues('onsetDateTime') ? dayjs(getValues('onsetDateTime')).format() : null,
      patientId: patientUuid,
      userId: session?.user?.uuid,
    };

    try {
      await updateCondition(conditionToEdit?.id, payload);
      await refreshConditions();

      showSnackbar({
        kind: 'success',
        subtitle: t('conditionNowVisible', 'Ahora es visible en la página de Antecedentes Patológicos'),
        title: t('conditionUpdated', 'Antecedente patológico actualizado'),
      });

      closeWorkspaceWithSavedChanges();
    } catch (error) {
      setIsSubmittingForm(false);
      setErrorUpdating(error);
    }
  }, [
    closeWorkspaceWithSavedChanges,
    conditionToEdit?.id,
    getValues,
    matchingCondition?.conceptId,
    refreshConditions,
    patientUuid,
    session?.user?.uuid,
    setErrorUpdating,
    setIsSubmittingForm,
    t,
  ]);

  const focusOnSearchInput = () => {
    searchInputRef?.current?.focus();
  };

  const handleSearchTermChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setSelectedConcept(null);
      setValue('conceptId', '');
      setValue('conditionName', '');
    }
  };

  useEffect(() => {
    if (errors?.conditionName) {
      focusOnSearchInput();
    }
    if (isSubmittingForm) {
      if (Object.keys(errors).length > 0) {
        setIsSubmittingForm(false);
        Object.entries(errors).map(([key, err]) => console.error(`${key}: ${err}`));
        return;
      }
      if (isEditing) {
        handleUpdate();
      } else {
        handleCreate();
      }
    }
  }, [handleUpdate, isEditing, handleCreate, isSubmittingForm, errors, setIsSubmittingForm]);

  return (
    <div className={styles.formContainer}>
      <Stack gap={7}>
        <FormGroup
          legendText={<RequiredFieldLabel label={t('pediatricCondition', 'Antecedente Patológico del Menor')} t={t} />}
        >
          {isEditing ? (
            <FormLabel className={styles.conditionLabel}>{conditionToEdit?.display}</FormLabel>
          ) : (
            <>
              <Controller
                name="conditionName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ResponsiveWrapper>
                    {conceptSetMembers && conceptSetMembers.length > 0 ? (
                      <>
                        <Search
                          autoFocus
                          className={classNames({
                            [styles.conditionsError]: errors?.conditionName,
                          })}
                          disabled={isEditing}
                          id="pediatricConditionsSearch"
                          labelText={t('enterPediatricCondition', 'Ingrese antecedente patológico')}
                          onChange={(event) => {
                            const value = event.target.value;
                            onChange(value);
                            handleSearchTermChange(value);
                          }}
                          onClear={() => {
                            setSearchTerm('');
                            setSelectedConcept(null);
                            setValue('conceptId', '');
                            setValue('conditionName', '');
                            onChange('');
                          }}
                          placeholder={t('searchPediatricConditions', 'Buscar antecedentes patológicos del menor')}
                          ref={searchInputRef}
                          renderIcon={errors?.conditionName && ((props) => <WarningFilled fill="red" {...props} />)}
                          value={value || searchTerm}
                        />
                        <ConceptSearchResults
                          isLoading={false}
                          onConceptChange={handleConceptChange}
                          searchResults={filteredConcepts}
                          selectedConcept={selectedConcept}
                          t={t}
                          value={searchTerm}
                        />
                      </>
                    ) : (
                      <div className={styles.noConceptSetMessage}>
                        <p>
                          {t(
                            'noConceptSetConfigured',
                            'No se ha configurado el conjunto de conceptos para Antecedentes Patológicos del Menor',
                          )}
                        </p>
                        <p>
                          {t(
                            'contactAdministrator',
                            'Contacte al administrador del sistema para configurar el concept set',
                          )}
                        </p>
                      </div>
                    )}
                  </ResponsiveWrapper>
                )}
              />
              {errors?.conditionName && <p className={styles.errorMessage}>{errors?.conditionName?.message}</p>}
            </>
          )}
        </FormGroup>

        <FormGroup legendText="">
          <Controller
            name="onsetDateTime"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <ResponsiveWrapper>
                <DatePicker
                  id="onsetDate"
                  datePickerType="single"
                  dateFormat="d/m/Y"
                  maxDate={dayjs().utc().format()}
                  placeholder="dd/mm/aaaa"
                  onChange={([date]) => onChange(date)}
                  onBlur={onBlur}
                  value={value}
                >
                  <DatePickerInput id="onsetDateInput" labelText={t('onsetDate', 'Fecha de inicio')} />
                </DatePicker>
              </ResponsiveWrapper>
            )}
          />
        </FormGroup>

        <FormGroup legendText={<RequiredFieldLabel label={t('clinicalStatus', 'Estado clínico')} t={t} />}>
          <Controller
            name="clinicalStatus"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <RadioButtonGroup
                className={styles.radioGroup}
                invalid={Boolean(errors?.clinicalStatus)}
                name="clinicalStatus"
                onBlur={onBlur}
                onChange={onChange}
                orientation="vertical"
                valueSelected={value?.toLowerCase()}
              >
                <RadioButton id="active" labelText={t('active', 'Activo')} value="active" />
                <RadioButton id="inactive" labelText={t('inactive', 'Inactivo')} value="inactive" />
              </RadioButtonGroup>
            )}
          />
          {errors?.clinicalStatus && <p className={styles.errorMessage}>{errors?.clinicalStatus?.message}</p>}
        </FormGroup>

        {(clinicalStatus?.match(/inactive/i) || matchingCondition?.clinicalStatus?.match(/inactive/i)) && (
          <FormGroup legendText="">
            <Controller
              name="abatementDateTime"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <ResponsiveWrapper>
                    <DatePicker
                      id="endDate"
                      datePickerType="single"
                      dateFormat="d/m/Y"
                      minDate={new Date(watch('onsetDateTime')).toISOString()}
                      maxDate={dayjs().utc().format()}
                      placeholder="dd/mm/aaaa"
                      onChange={([date]) => onChange(date)}
                      onBlur={onBlur}
                      value={value}
                    >
                      <DatePickerInput id="abatementDateTime" labelText={t('endDate', 'Fecha de fin')} />
                    </DatePicker>
                  </ResponsiveWrapper>
                </>
              )}
            />
          </FormGroup>
        )}
      </Stack>
    </div>
  );
};

function RequiredFieldLabel({ label, t }: RequiredFieldLabelProps) {
  return (
    <span>
      {label}
      <span title={t('required', 'Requerido')} className={styles.required}>
        *
      </span>
    </span>
  );
}

function ConceptSearchResults({
  isLoading,
  onConceptChange,
  searchResults,
  selectedConcept,
  t,
  value,
}: ConceptSearchResultsProps) {
  if (!value || selectedConcept) {
    return null;
  }

  if (isLoading) {
    return <InlineLoading className={styles.loader} description={t('searching', 'Buscando') + '...'} />;
  }

  if (!isLoading && searchResults?.length > 0) {
    return (
      <ul className={styles.conditionsList}>
        {searchResults?.map((searchResult) => (
          <li
            className={styles.condition}
            key={searchResult?.uuid}
            onClick={() => onConceptChange(searchResult)}
            role="menuitem"
          >
            {searchResult.display}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Layer>
      <Tile className={styles.emptyResults}>
        <span>
          {t('noResultsFor', 'No hay resultados para')} <strong>"{value}"</strong>
        </span>
      </Tile>
    </Layer>
  );
}

export default ChildMedicalHistoryWidget;
