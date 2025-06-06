import { SelectItem, TimePicker, TimePickerSelect } from '@carbon/react';
import { OpenmrsDatePicker, ResponsiveWrapper } from '@openmrs/esm-framework';
import { type amPm } from '@openmrs/esm-patient-common-lib';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { type Control, Controller, type FieldPath, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styles from './encounter-date-time.scss';

interface EncounterDateTimeSectionProps {
  control: Control<any, any>;
  firstEncounterDateTime?: number;
  lastEncounterDateTime?: number;
  patientUuid?: string;
  encounterTypeUuid?: string;
}

interface EncounterDateTimeProps {
  control: Control<any, any>;
  patientUuid: string;
  encounterTypeUuid?: string;
  showEncounterValidation?: boolean;
}

interface EncounterDateTimeFieldProps {
  dateField: Field;
  timeField?: Field;
  timeFormatField?: Field;
  minDate?: dayjs.ConfigType;
  maxDate?: dayjs.ConfigType;
  disabled?: boolean;
  control?: Control<any, any>;
  showTimeFields?: boolean;
}

interface Field {
  name: FieldPath<any>;
  label: string;
}

/**
 * The component conditionally renders the Visit start and end
 * date / time fields based on the visit status (new / ongoing / past)
 */
const VisitDateTimeSection: React.FC<EncounterDateTimeSectionProps> = ({
  control,
  firstEncounterDateTime,
  lastEncounterDateTime,
}) => {
  const { t } = useTranslation();
  const [
    visitStatus,
    visitStartDate,
    visitStartTime,
    visitStartTimeFormat,
    visitStopDate,
    visitStopTime,
    visitStopTimeFormat,
  ] = useWatch({
    control,
    name: [
      'visitStatus',
      'visitStartDate',
      'visitStartTime',
      'visitStartTimeFormat',
      'visitStopDate',
      'visitStopTime',
      'visitStopTimeFormat',
    ],
  });

  const hasStopTime = 'past' === visitStatus;
  const convertToDate = (date: Date, time: string, timeFormat: string) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours =
      timeFormat === 'PM' && hours !== 12 ? hours + 12 : timeFormat === 'AM' && hours === 12 ? 0 : hours;
    const result = new Date(date);
    result.setHours(adjustedHours, minutes, 0, 0);
    return result;
  };

  const selectedVisitStartDateTime = convertToDate(visitStartDate, visitStartTime, visitStartTimeFormat);
  const selectedVisitStopDateTime = convertToDate(visitStopDate, visitStopTime, visitStopTimeFormat);

  if (visitStatus === 'new') {
    return <></>;
  }

  return (
    <section>
      <div className={styles.sectionTitle}>
        {visitStatus === 'ongoing'
          ? t('visitStartDate', 'Visit start date')
          : t('visitStartAndEndDate', 'Visit start and end date')}
      </div>
      <VisitDateTimeField
        dateField={{ name: 'visitStartDate', label: t('startDate', 'Start date') }}
        timeField={{ name: 'visitStartTime', label: t('startTime', 'Start time') }}
        timeFormatField={{ name: 'visitStartTimeFormat', label: t('startTimeFormat', 'Start time format') }}
        maxDate={Math.min(
          firstEncounterDateTime || Date.now(),
          selectedVisitStopDateTime?.getTime() || Date.now(),
          Date.now(),
        )}
        showTimeFields={true}
        control={control}
      />
      {hasStopTime && (
        <VisitDateTimeField
          dateField={{ name: 'visitStopDate', label: t('endDate', 'End date') }}
          timeField={{ name: 'visitStopTime', label: t('endTime', 'End time') }}
          timeFormatField={{ name: 'visitStopTimeFormat', label: t('endTimeFormat', 'End time format') }}
          minDate={Math.max(lastEncounterDateTime || 0, selectedVisitStartDateTime?.getTime() || 0)}
          maxDate={Date.now()}
          showTimeFields={true}
          control={control}
        />
      )}
    </section>
  );
};

/**
 * This components renders a DatePicker, TimePicker and AM / PM dropdown
 * used to input a Date.
 * It is used by the visit form for the start and end time inputs.
 */
const VisitDateTimeField: React.FC<EncounterDateTimeFieldProps> = ({
  dateField,
  timeField,
  timeFormatField,
  minDate,
  maxDate,
  disabled,
  control: externalControl,
  showTimeFields = false,
}) => {
  const {
    control: contextControl,
    formState: { errors },
  } = useFormContext() || { control: undefined, formState: { errors: {} } };

  const control = externalControl || contextControl;
  const { t } = useTranslation();

  // Since we have the separate date and time fields, the full validation is done by zod.
  // We are just using minDateObj and maxDateObj to restrict the bounds of the DatePicker.
  const minDateObj = minDate ? dayjs(minDate).startOf('day') : null;
  const maxDateObj = maxDate ? dayjs(maxDate).endOf('day') : null;

  return (
    <div className={classNames(styles.dateTimeSection, styles.sectionField)}>
      <Controller
        name={dateField.name}
        control={control}
        render={({ field, fieldState }) => (
          <ResponsiveWrapper>
            <OpenmrsDatePicker
              {...field}
              value={field.value as Date}
              className={styles.datePicker}
              id={`${dateField.name}Input`}
              data-testid={`${dateField.name}Input`}
              maxDate={maxDateObj}
              minDate={minDateObj}
              labelText={dateField.label}
              invalid={Boolean(fieldState?.error?.message)}
              invalidText={fieldState?.error?.message}
              isDisabled={disabled}
            />
          </ResponsiveWrapper>
        )}
      />

      {showTimeFields && timeField && timeFormatField && (
        <ResponsiveWrapper>
          <Controller
            name={timeField.name}
            control={control}
            render={({ field: { onBlur, onChange, value } }) => (
              <div className={styles.timePickerContainer}>
                <TimePicker
                  className={styles.timePicker}
                  id={timeField.name}
                  invalid={Boolean(errors[timeField.name])}
                  invalidText={errors[timeField.name]?.message}
                  labelText={timeField.label}
                  onBlur={onBlur}
                  onChange={(event) => onChange(event.target.value as amPm)}
                  pattern="^(0[1-9]|1[0-2]):([0-5][0-9])$"
                  value={value}
                  disabled={disabled}
                >
                  <Controller
                    name={timeFormatField.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TimePickerSelect
                        aria-label={timeFormatField.label}
                        className={classNames({
                          [styles.timePickerSelectError]: errors[timeFormatField.name],
                        })}
                        id={`${timeFormatField.name}Input`}
                        onChange={(event) => onChange(event.target.value as amPm)}
                        value={value}
                        disabled={disabled}
                      >
                        <SelectItem value="AM" text={t('AM', 'AM')} />
                        <SelectItem value="PM" text={t('PM', 'PM')} />
                      </TimePickerSelect>
                    )}
                  />
                </TimePicker>
                {errors[timeFormatField.name] && (
                  <div className={styles.timerPickerError}>{errors[timeFormatField.name]?.message}</div>
                )}
              </div>
            )}
          />
        </ResponsiveWrapper>
      )}
    </div>
  );
};

/**
 * Component specifically for encounter date/time selection with encounter validation
 * This component references existing encounters and provides validation
 */
const EncounterDateTimeSection: React.FC<EncounterDateTimeProps> = ({
  control,
  patientUuid,
  encounterTypeUuid,
  showEncounterValidation = true,
}) => {
  const { t } = useTranslation();
  const {
    usePatientEncounters,
    useEncounterDateBoundaries,
    validateEncounterDate,
  } = require('./encounter-date-time.resource');

  // Get encounter boundaries for validation
  const {
    firstEncounterDateTime,
    lastEncounterDateTime,
    isLoading: boundariesLoading,
  } = useEncounterDateBoundaries(patientUuid, encounterTypeUuid);

  // Get all encounters for validation
  const { encounters, isLoading: encountersLoading } = usePatientEncounters(patientUuid, encounterTypeUuid);

  const [encounterDate, encounterTime, encounterTimeFormat] = useWatch({
    control,
    name: ['encounterDate', 'encounterTime', 'encounterTimeFormat'],
  });

  // Validate the selected encounter date
  const selectedDateTime =
    encounterDate && encounterTime && encounterTimeFormat
      ? (() => {
          const [hours, minutes] = encounterTime.split(':').map(Number);
          const adjustedHours =
            encounterTimeFormat === 'PM' && hours !== 12
              ? hours + 12
              : encounterTimeFormat === 'AM' && hours === 12
                ? 0
                : hours;
          const result = new Date(encounterDate);
          result.setHours(adjustedHours, minutes, 0, 0);
          return result;
        })()
      : null;

  const validation =
    selectedDateTime && showEncounterValidation
      ? validateEncounterDate(selectedDateTime, encounters)
      : { isValid: true };

  return (
    <section>
      <div className={styles.sectionTitle}>{t('encounterDateTime', 'Encounter Date and Time')}</div>

      {/* Display encounter statistics */}
      {!encountersLoading && encounters.length > 0 && (
        <div className={styles.encounterInfo}>
          <p className={styles.encounterCount}>
            {t('totalEncounters', 'Total encounters: {{count}}', { count: encounters.length })}
          </p>
          {firstEncounterDateTime && (
            <p className={styles.dateRange}>
              {t('encounterDateRange', 'Date range: {{first}} - {{last}}', {
                first: new Date(firstEncounterDateTime).toLocaleDateString(),
                last: lastEncounterDateTime
                  ? new Date(lastEncounterDateTime).toLocaleDateString()
                  : t('ongoing', 'Ongoing'),
              })}
            </p>
          )}
        </div>
      )}

      <VisitDateTimeField
        dateField={{ name: 'encounterDate', label: t('encounterDate', 'Encounter date') }}
        timeField={{ name: 'encounterTime', label: t('encounterTime', 'Encounter time') }}
        timeFormatField={{ name: 'encounterTimeFormat', label: t('encounterTimeFormat', 'Time format') }}
        maxDate={Date.now()}
        showTimeFields={true}
        control={control}
      />

      {/* Display validation message */}
      {validation.message && (
        <div
          className={classNames(styles.validationMessage, {
            [styles.warning]: validation.isValid,
            [styles.error]: !validation.isValid,
          })}
        >
          {validation.message}
        </div>
      )}

      {/* Display recent encounters */}
      {!encountersLoading && encounters.length > 0 && (
        <div className={styles.recentEncounters}>
          <h4>{t('recentEncounters', 'Recent Encounters')}</h4>
          <ul className={styles.encounterList}>
            {encounters.slice(0, 5).map((encounter) => (
              <li key={encounter.uuid} className={styles.encounterItem}>
                <span className={styles.encounterDate}>{new Date(encounter.encounterDatetime).toLocaleString()}</span>
                <span className={styles.encounterType}>{encounter.encounterType.display}</span>
                <span className={styles.encounterLocation}>{encounter.location.display}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default VisitDateTimeSection;
export { EncounterDateTimeSection, VisitDateTimeField };
