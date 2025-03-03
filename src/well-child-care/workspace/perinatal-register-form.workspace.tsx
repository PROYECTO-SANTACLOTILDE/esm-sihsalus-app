import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  ButtonSkeleton,
  ButtonSet,
  Column,
  Form,
  InlineNotification,
  Row,
  Stack,
  TextInput,
  Dropdown,
  Checkbox,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import {
  createErrorHandler,
  showSnackbar,
  useConfig,
  useLayoutType,
  useSession,
  ExtensionSlot,
  usePatient,
  useVisit,
} from '@openmrs/esm-framework';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import type { ConfigObject } from '../../config-schema'; // Adjust the import path as needed
import { savePerinatalVitals } from './savePerinatalVitals.resource';
import styles from './perinatal-register-form.scss'; // You’ll need to create this stylesheet

// Schema for perinatal maternal carnet data
const PerinatalRegisterSchema = z
  .object({
    relationshipStatus: z.string().optional(),
    motherMedicalHistory: z.array(z.string()).optional(),
    fatherMedicalHistory: z.array(z.string()).optional(),
    lastPregnancyDate: z.date().optional(),
    lastPregnancyOutcome: z.string().optional(),
    lastPregnancyComplications: z.array(z.string()).optional(),
    lastPregnancyBirthWeight: z.number().optional(),
    lastPregnancyGestationalAge: z.number().optional(),
  })
  .refine(
    (fields) => {
      // Ensure at least one field is filled
      return Object.values(fields).some((value) => Boolean(value));
    },
    {
      message: 'Please fill at least one field',
      path: ['oneFieldRequired'],
    },
  );

export type PerinatalRegisterFormType = z.infer<typeof PerinatalRegisterSchema>;

const PerinatalRegisterForm: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const session = useSession();
  const patient = usePatient(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<PerinatalRegisterFormType>({
    mode: 'all',
    resolver: zodResolver(PerinatalRegisterSchema),
  });

  useEffect(() => {
    promptBeforeClosing(() => isDirty);
  }, [isDirty, promptBeforeClosing]);

  const relationshipOptions = useMemo(
    () => [
      { label: t('single', 'Single'), value: 'single' },
      { label: t('married', 'Married'), value: 'married' },
      { label: t('cohabiting', 'Cohabiting'), value: 'cohabiting' },
      { label: t('divorced', 'Divorced'), value: 'divorced' },
      { label: t('widowed', 'Widowed'), value: 'widowed' },
      { label: t('other', 'Other'), value: 'other' },
    ],
    [t],
  );

  const pregnancyOutcomes = useMemo(
    () => [
      { label: t('liveBirth', 'Live Birth'), value: 'liveBirth' },
      { label: t('miscarriage', 'Miscarriage'), value: 'miscarriage' },
      { label: t('stillbirth', 'Stillbirth'), value: 'stillbirth' },
      { label: t('abortion', 'Abortion'), value: 'abortion' },
    ],
    [t],
  );

  const pregnancyComplications = useMemo(
    () => [
      { label: t('preeclampsia', 'Preeclampsia'), value: 'preeclampsia' },
      { label: t('gestationalDiabetes', 'Gestational Diabetes'), value: 'gestationalDiabetes' },
      { label: t('pretermLabor', 'Preterm Labor'), value: 'pretermLabor' },
      { label: t('other', 'Other'), value: 'other' },
    ],
    [t],
  );

  const medicalHistoryOptions = useMemo(
    () => [
      { label: t('diabetes', 'Diabetes'), value: 'diabetes' },
      { label: t('hypertension', 'Hypertension'), value: 'hypertension' },
      { label: t('asthma', 'Asthma'), value: 'asthma' },
      { label: t('other', 'Other'), value: 'other' },
    ],
    [t],
  );

  const savePerinatalData = useCallback(
    (data: PerinatalRegisterFormType) => {
      setIsSubmitting(true);
      setShowErrorNotification(false);

      const abortController = new AbortController();

      const formData = {
        ...data,
        encounterTypeUuid: config.encounterTypes.prenatalControl, // Adjust in your config for perinatal data
        patientUuid,
        locationUuid: session?.sessionLocation?.uuid,
      };

      savePerinatalVitals(
        formData.encounterTypeUuid,
        formData,
        patientUuid,
        abortController,
        session?.sessionLocation?.uuid,
      )
        .then((response) => {
          if (response.status === 201) {
            // You might want to invalidate a specific cache for perinatal data if available
            closeWorkspaceWithSavedChanges();
            showSnackbar({
              isLowContrast: true,
              kind: 'success',
              title: t('perinatalDataRecorded', 'Perinatal Data Recorded'),
              subtitle: t('dataNowAvailable', 'They are now visible on the Perinatal Register'),
            });
          }
        })
        .catch((error) => {
          createErrorHandler();
          showSnackbar({
            title: t('perinatalDataSaveError', 'Error saving perinatal data'),
            kind: 'error',
            isLowContrast: false,
            subtitle: t('checkForValidity', 'Some of the values entered may be invalid'),
          });
        })
        .finally(() => {
          setIsSubmitting(false);
          abortController.abort();
        });
    },
    [
      closeWorkspaceWithSavedChanges,
      config.encounterTypes.prenatalControl,
      patientUuid,
      session?.sessionLocation?.uuid,
      t,
    ],
  );

  function onError(err) {
    if (err?.oneFieldRequired) {
      setShowErrorNotification(true);
    }
  }

  if (!patient || !currentVisit) {
    return (
      <Form className={styles.form}>
        <div className={styles.grid}>
          <Stack>
            <Column>
              <p className={styles.title}>{t('loading', 'Loading...')}</p>
            </Column>
          </Stack>
        </div>
      </Form>
    );
  }

  return (
    <Form className={styles.form} onSubmit={handleSubmit(savePerinatalData, onError)}>
      <div className={styles.grid}>
        <Stack gap={4}>
          <Column>
            <p className={styles.title}>{t('perinatalRegister', 'Perinatal Maternal Carnet')}</p>
          </Column>

          {/* Relationship Status of the Mother */}
          <Column>
            <p className={styles.subtitle}>{t('relationshipStatus', 'Relationship Status')}</p>
            <Controller
              control={control}
              name="relationshipStatus"
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  ref={field.ref}
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  id="relationshipStatus"
                  titleText={t('relationshipStatus', 'Relationship Status')}
                  onChange={(e) => field.onChange(e.selectedItem)}
                  initialSelectedItem={field.value}
                  label={t('chooseOption', 'Choose an option')}
                  items={relationshipOptions.map((r) => r.value)}
                  itemToString={(item) => relationshipOptions.find((r) => r.value === item)?.label ?? ''}
                />
              )}
            />
          </Column>

          {/* Medical History of the Mother */}
          <Column>
            <p className={styles.subtitle}>{t('medicalHistoryMother', 'Medical History of the Mother')}</p>
            <Controller
              control={control}
              name="motherMedicalHistory"
              render={({ field, fieldState: { error } }) => (
                <>
                  {medicalHistoryOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      labelText={option.label}
                      value={option.value}
                      checked={field.value?.includes(option.value) ?? false}
                      onChange={(checked) => {
                        const newValues = checked
                          ? [...(field.value || []), option.value]
                          : (field.value || []).filter((v) => v !== option.value);
                        field.onChange(newValues);
                      }}
                    />
                  ))}
                  <TextInput
                    invalid={Boolean(error?.message)}
                    invalidText={error?.message}
                    placeholder={t('otherMedicalHistory', 'Specify other medical history')}
                    labelText={t('other', 'Other')}
                    value={field.value?.find((v) => v === 'other') ? field.value?.find((v) => v === 'other') : ''}
                    onChange={(e) => {
                      const newValues = field.value?.filter((v) => v !== 'other') || [];
                      field.onChange([...newValues, e.target.value]);
                    }}
                  />
                  <TextInput
                    placeholder={t('surgicalHistory', 'Surgical History')}
                    labelText={t('surgicalHistory', 'Surgical History')}
                    onChange={(e) => setValue('motherMedicalHistory', [...(field.value || []), e.target.value])}
                  />
                  <TextInput
                    placeholder={t('allergies', 'Allergies')}
                    labelText={t('allergies', 'Allergies')}
                    onChange={(e) => setValue('motherMedicalHistory', [...(field.value || []), e.target.value])}
                  />
                  <TextInput
                    placeholder={t('mentalHealth', 'Mental Health History')}
                    labelText={t('mentalHealth', 'Mental Health History')}
                    onChange={(e) => setValue('motherMedicalHistory', [...(field.value || []), e.target.value])}
                  />
                </>
              )}
            />
          </Column>

          {/* Medical History of the Father */}
          <Column>
            <p className={styles.subtitle}>{t('medicalHistoryFather', 'Medical History of the Father')}</p>
            <Controller
              control={control}
              name="fatherMedicalHistory"
              render={({ field, fieldState: { error } }) => (
                <>
                  {medicalHistoryOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      labelText={option.label}
                      value={option.value}
                      checked={field.value?.includes(option.value) ?? false}
                      onChange={(checked) => {
                        const newValues = checked
                          ? [...(field.value || []), option.value]
                          : (field.value || []).filter((v) => v !== option.value);
                        field.onChange(newValues);
                      }}
                    />
                  ))}
                  <TextInput
                    invalid={Boolean(error?.message)}
                    invalidText={error?.message}
                    placeholder={t('otherMedicalHistory', 'Specify other medical history')}
                    labelText={t('other', 'Other')}
                    value={field.value?.find((v) => v === 'other') ? field.value?.find((v) => v === 'other') : ''}
                    onChange={(e) => {
                      const newValues = field.value?.filter((v) => v !== 'other') || [];
                      field.onChange([...newValues, e.target.value]);
                    }}
                  />
                </>
              )}
            />
          </Column>

          {/* Last Pregnancy Details */}
          <Column>
            <p className={styles.subtitle}>{t('lastPregnancy', 'Last Pregnancy Details')}</p>
            <Controller
              control={control}
              name="lastPregnancyDate"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  datePickerType="single"
                  {...field}
                  onChange={(dates) => field.onChange(dates[0])}
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  className={styles.datePickerInput}
                >
                  <DatePickerInput
                    invalid={Boolean(error?.message)}
                    invalidText={error?.message}
                    placeholder="mm/dd/yyyy"
                    labelText={t('lastPregnancyDate', 'Date of Last Pregnancy')}
                    size="xl"
                  />
                </DatePicker>
              )}
            />
            <Controller
              control={control}
              name="lastPregnancyOutcome"
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  ref={field.ref}
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  id="lastPregnancyOutcome"
                  titleText={t('pregnancyOutcome', 'Pregnancy Outcome')}
                  onChange={(e) => field.onChange(e.selectedItem)}
                  initialSelectedItem={field.value}
                  label={t('chooseOption', 'Choose an option')}
                  items={pregnancyOutcomes.map((r) => r.value)}
                  itemToString={(item) => pregnancyOutcomes.find((r) => r.value === item)?.label ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name="lastPregnancyComplications"
              render={({ field, fieldState: { error } }) => (
                <>
                  {pregnancyComplications.map((option) => (
                    <Checkbox
                      key={option.value}
                      labelText={option.label}
                      value={option.value}
                      checked={field.value?.includes(option.value) ?? false}
                      onChange={(checked) => {
                        const newValues = checked
                          ? [...(field.value || []), option.value]
                          : (field.value || []).filter((v) => v !== option.value);
                        field.onChange(newValues);
                      }}
                    />
                  ))}
                  <TextInput
                    invalid={Boolean(error?.message)}
                    invalidText={error?.message}
                    placeholder={t('otherComplications', 'Specify other complications')}
                    labelText={t('other', 'Other')}
                    value={field.value?.find((v) => v === 'other') ? field.value?.find((v) => v === 'other') : ''}
                    onChange={(e) => {
                      const newValues = field.value?.filter((v) => v !== 'other') || [];
                      field.onChange([...newValues, e.target.value]);
                    }}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="lastPregnancyBirthWeight"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder="e.g., 3.5 kg"
                  labelText={t('birthWeight', 'Birth Weight')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
            <Controller
              control={control}
              name="lastPregnancyGestationalAge"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder="e.g., 38 weeks"
                  labelText={t('gestationalAge', 'Gestational Age')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
          </Column>
        </Stack>
      </div>
      {showErrorNotification && (
        <Column className={styles.errorContainer}>
          <InlineNotification
            className={styles.errorNotification}
            lowContrast={false}
            onClose={() => setShowErrorNotification(false)}
            title={t('error', 'Error')}
            subtitle={t('pleaseFillField', 'Please fill at least one field') + '.'}
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Discard')}
        </Button>
        <Button
          className={styles.button}
          kind="primary"
          onClick={handleSubmit(savePerinatalData, onError)}
          disabled={isSubmitting}
          type="submit"
        >
          {t('submit', 'Save and Close')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default PerinatalRegisterForm;
