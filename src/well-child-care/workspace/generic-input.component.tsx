// generic-input.component.tsx
import React, { useId, useState } from 'react';
import classNames from 'classnames';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FormLabel, NumberInput } from '@carbon/react';
import { Warning } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useLayoutType, ResponsiveWrapper } from '@openmrs/esm-framework';
import type { PerinatalRegisterFormType } from './perinatal-register-form.workspace';
import styles from './vitals-biometrics-input.scss';

type FieldId = 'gravidez' | 'partoAlTermino' | 'partoPrematuro' | 'partoAborto' | 'partoNacidoVivo';

interface GenericInputProps {
  control: Control<PerinatalRegisterFormType>;
  fieldProperties: {
    id: FieldId;
    className?: string;
    max?: number | null;
    min?: number | null;
    name: string;
  }[];
  label: string;
  fieldStyles?: React.CSSProperties;
  fieldWidth?: string;
  showErrorMessage?: boolean;
  readOnly?: boolean;
}

const GenericInput: React.FC<GenericInputProps> = ({
  control,
  fieldProperties,
  fieldStyles,
  fieldWidth,
  label,
  showErrorMessage = false,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const fieldId = useId();
  const isTablet = useLayoutType() === 'tablet';
  const [invalid, setInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function checkValidity(value: string, onChange: (value: number | undefined) => void) {
    const parsedValue = value === '' ? undefined : Number(value);
    const field = fieldProperties[0];
    const isOutOfRange =
      parsedValue !== undefined &&
      ((field.min !== null && parsedValue < field.min) || (field.max !== null && parsedValue > field.max));
    const isInvalid = parsedValue !== undefined && (isNaN(parsedValue) || isOutOfRange);
    setInvalid(isInvalid);
    onChange(parsedValue); // Siempre pasar el valor, incluso si es 0
  }

  function handleFocusChange(isFocused: boolean) {
    setIsFocused(isFocused);
  }

  const showInvalidInputError = showErrorMessage && invalid;
  const containerClasses = classNames(styles.container, {
    [styles.inputInTabletView]: isTablet,
  });

  const inputClasses = classNames(styles.inputContainer, {
    [styles.focused]: isFocused,
    [styles.readonly]: readOnly,
    [styles.invalidInput]: showInvalidInputError,
  });

  return (
    <div className={containerClasses} style={{ width: fieldWidth }}>
      <section className={styles.labelContainer}>
        <span className={styles.label}>{label}</span>
        {showInvalidInputError && (
          <span className={styles.invalidInputIcon}>
            <Warning />
          </span>
        )}
      </section>

      <section className={inputClasses} style={fieldStyles}>
        <ResponsiveWrapper>
          <Controller
            name={fieldProperties[0].id}
            control={control}
            render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
              <>
                <NumberInput
                  allowEmpty
                  className={classNames(styles.numberInput, fieldProperties[0].className)}
                  defaultValue={''}
                  disableWheel
                  hideSteppers
                  id={`${fieldId}-${fieldProperties[0].id}`}
                  max={fieldProperties[0].max ?? undefined}
                  min={fieldProperties[0].min ?? undefined}
                  name={fieldProperties[0].name}
                  onBlur={() => handleFocusChange(false)}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => checkValidity(event.target.value, onChange)}
                  onFocus={() => handleFocusChange(true)}
                  placeholder={t(fieldProperties[0].id, fieldProperties[0].name)}
                  readOnly={readOnly}
                  ref={ref}
                  style={fieldStyles}
                  value={value !== undefined ? value : ''} // Mostrar 0 explícitamente
                />
                {showErrorMessage && error && (
                  <FormLabel className={styles.invalidInputError}>{error.message}</FormLabel>
                )}
              </>
            )}
          />
        </ResponsiveWrapper>
      </section>
    </div>
  );
};

export default GenericInput;
