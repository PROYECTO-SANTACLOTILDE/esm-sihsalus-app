import React, { Fragment, useId, useState } from 'react';
import classNames from 'classnames';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FormLabel, NumberInput, TextArea } from '@carbon/react';
import { Warning } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useLayoutType, ResponsiveWrapper } from '@openmrs/esm-framework';
import { assessValue, getReferenceRangesForConcept } from '../common';
import type { NewbornVitalsFormType } from './neonatal-triage.workspace';
import styles from './newborn-vitals-form.scss';
import { generatePlaceholder } from '../common';

type FieldId =
  | 'temperatura'
  | 'saturacionOxigeno'
  | 'presionSistolica'
  | 'frecuenciaRespiratoria'
  | 'peso'
  | 'numeroDeposiciones'
  | 'deposicionesGramos'
  | 'numeroMicciones'
  | 'miccionesGramos'
  | 'numeroVomito'
  | 'vomitoGramosML';

type AbnormalValue = 'critically_low' | 'critically_high' | 'high' | 'low';
type FieldTypes = 'number' | 'textarea';

interface NewbornVitalsInputProps {
  control: Control<NewbornVitalsFormType>;
  fieldProperties: Array<{
    id: FieldId; // ✅ Aquí se define el id dentro de fieldProperties
    className?: string;
    invalid?: boolean;
    max?: number | null;
    min?: number | null;
    name: string;
    separator?: string;
    type?: FieldTypes;
  }>;
  label: string;
  fieldStyles?: React.CSSProperties;
  fieldWidth?: string;
  interpretation?: string;
  isValueWithinReferenceRange?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  showErrorMessage?: boolean;
  unitSymbol?: string;
}
const NewbornVitalsInput: React.FC<NewbornVitalsInputProps> = ({
  control,
  fieldProperties,
  fieldStyles,
  fieldWidth,
  interpretation,
  isValueWithinReferenceRange = true,
  label,
  placeholder,
  readOnly,
  showErrorMessage,
  unitSymbol,
}) => {
  const { t } = useTranslation();
  const fieldId = useId();
  const isTablet = useLayoutType() === 'tablet';
  const [invalid, setInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const abnormalValues: Array<AbnormalValue> = ['critically_low', 'critically_high', 'high', 'low'];
  const hasAbnormalValue = !isFocused && interpretation && abnormalValues.includes(interpretation as AbnormalValue);

  function checkValidity(value, onChange) {
    setInvalid(!(Number(value) || value === ''));

    if (!invalid) {
      onChange(value === '' ? undefined : Number(value));
    }
  }

  function handleFocusChange(isFocused: boolean) {
    setIsFocused(isFocused);
  }

  const isInvalidInput = !isValueWithinReferenceRange || invalid;
  const showInvalidInputError = Boolean(showErrorMessage && isInvalidInput);
  const errorMessageClass = showInvalidInputError ? styles.invalidInput : '';

  const containerClasses = classNames(styles.container, {
    [styles.inputInTabletView]: isTablet,
    [styles.inputWithAbnormalValue]: hasAbnormalValue,
  });

  const inputClasses = classNames(styles.inputContainer, {
    [styles['critical-value']]: hasAbnormalValue,
    [styles.focused]: isFocused,
    [styles.readonly]: readOnly,
    [errorMessageClass]: true,
  });

  return (
    <>
      <div className={containerClasses} style={{ width: fieldWidth }}>
        <section className={styles.labelContainer}>
          <span className={styles.label}>{label}</span>

          {Boolean(hasAbnormalValue) ? (
            <span className={styles[interpretation.replace('_', '-')]} title={t('abnormalValue', 'Valor anormal')} />
          ) : null}

          {showInvalidInputError ? (
            <span className={styles.invalidInputIcon}>
              <Warning />
            </span>
          ) : null}
        </section>
        <section className={inputClasses} style={{ ...fieldStyles }}>
          <div
            className={classNames({
              [styles.centered]: !isTablet || unitSymbol === 'mmHg',
            })}
          >
            {fieldProperties.map((fieldProperty) => {
              if (fieldProperty.type === 'number') {
                const numberInputClasses = classNames(styles.numberInput, fieldProperty.className);

                return (
                  <Fragment key={fieldProperty.id}>
                    <ResponsiveWrapper>
                      <Controller
                        name={fieldProperty.id}
                        control={control}
                        render={({ field: { onChange, ref, value } }) => {
                          return (
                            <NumberInput
                              allowEmpty
                              className={numberInputClasses}
                              defaultValue={''}
                              disableWheel
                              hideSteppers
                              id={`${fieldId}-${fieldProperty.id}`}
                              max={fieldProperty.max ?? undefined}
                              min={fieldProperty.min ?? undefined}
                              name={fieldProperty.name}
                              onBlur={() => handleFocusChange(false)}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                checkValidity(event.target.value, onChange)
                              }
                              onFocus={() => handleFocusChange(true)}
                              placeholder={generatePlaceholder(fieldProperty.name)}
                              readOnly={readOnly}
                              ref={ref}
                              style={{ ...fieldStyles }}
                              title={fieldProperty.name}
                              type={fieldProperty.type}
                              value={value}
                            />
                          );
                        }}
                      />
                    </ResponsiveWrapper>
                    {fieldProperty?.separator}
                  </Fragment>
                );
              }

              if (fieldProperty.type === 'textarea') {
                return (
                  <ResponsiveWrapper key={fieldProperty.id}>
                    <Controller
                      name={fieldProperty.id}
                      control={control}
                      render={({ field: { onChange, ref, value } }) => (
                        <TextArea
                          className={styles.textarea}
                          id={`${fieldId}-${fieldProperty.id}`}
                          labelText={''}
                          maxCount={100}
                          name={fieldProperty.name}
                          onBlur={() => handleFocusChange(false)}
                          onChange={onChange}
                          onFocus={() => handleFocusChange(true)}
                          placeholder={placeholder}
                          ref={ref}
                          rows={2}
                          style={{ ...fieldStyles }}
                          title={fieldProperty.name}
                          value={value}
                        />
                      )}
                    />
                  </ResponsiveWrapper>
                );
              }
            })}
          </div>
          {Boolean(unitSymbol) && <p className={styles.unitName}>{unitSymbol}</p>}
        </section>
      </div>

      {showInvalidInputError && (
        <FormLabel className={styles.invalidInputError}>
          {t('validationInputError', `El valor debe estar entre {{min}} y {{max}}`, {
            min: fieldProperties[0].min,
            max: fieldProperties[0].max,
          })}
        </FormLabel>
      )}
    </>
  );
};

export default NewbornVitalsInput;
