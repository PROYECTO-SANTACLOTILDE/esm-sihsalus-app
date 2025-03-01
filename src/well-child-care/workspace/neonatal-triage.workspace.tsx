import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  NumberInputSkeleton,
  Row,
  Stack,
} from '@carbon/react';
import {
  age,
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
import type { ConfigObject } from '../../config-schema';
import {
  calculateBodyMassIndex,
  extractNumbers,
  getMuacColorCode,
  isValueWithinReferenceRange,
} from './vitals-biometrics-form.utils';
import {
  assessValue,
  getReferenceRangesForConcept,
  interpretBloodPressure,
  invalidateCachedVitalsAndBiometrics,
  saveVitalsAndBiometrics as savePatientVitals,
  useVitalsConceptMetadata,
} from '../common';
import NewbornVitalsInput from './newborn-vitals-input.component';
import styles from './newborn-vitals-form.scss';

const NewbornVitalsSchema = z
  .object({
    temperature: z.number(),
    oxygenSaturation: z.number(),
    systolicBloodPressure: z.number(),
    respiratoryRate: z.number(),
    weight: z.number(),
    height: z.number(),
    headCircumference: z.number(),
    chestCircumference: z.number(),
    stoolCount: z.number(),
    stoolGrams: z.number(),
    urineCount: z.number(),
    urineGrams: z.number(),
    vomitCount: z.number(),
    vomitGramsML: z.number(),
  })
  .partial()
  .refine((fields) => Object.values(fields).some((value) => Boolean(value)), {
    message: 'Please fill at least one field',
    path: ['oneFieldRequired'],
  });

export type NewbornVitalsFormType = z.infer<typeof NewbornVitalsSchema>;

const NewbornVitalsForm: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const biometricsUnitsSymbols = config.biometrics;

  const session = useSession();
  const patient = usePatient(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const { data: conceptUnits, conceptMetadata, conceptRanges, isLoading } = useVitalsConceptMetadata();
  const [hasInvalidVitals, setHasInvalidVitals] = useState(false);
  const [muacColorCode, setMuacColorCode] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<NewbornVitalsFormType>({
    mode: 'all',
    resolver: zodResolver(NewbornVitalsSchema),
  });

  useEffect(() => {
    promptBeforeClosing(() => isDirty);
  }, [isDirty, promptBeforeClosing]);

  const encounterUuid = currentVisit?.encounters?.find(
    (encounter) => encounter?.form?.uuid === config.vitals.formUuid,
  )?.uuid;

  const temperature = watch('temperature');
  const oxygenSaturation = watch('oxygenSaturation');
  const systolicBloodPressure = watch('systolicBloodPressure');
  const respiratoryRate = watch('respiratoryRate');
  const weight = watch('weight');
  const stoolCount = watch('stoolCount');
  const stoolGrams = watch('stoolGrams');
  const urineCount = watch('urineCount');
  const urineGrams = watch('urineGrams');
  const vomitCount = watch('vomitCount');
  const vomitGramsML = watch('vomitGramsML');

  /**
  useEffect(() => {
    const patientBirthDate = patient?.patient?.birthDate;
    if (patientBirthDate && midUpperArmCircumference) {
      const patientAge = extractNumbers(age(patientBirthDate));
      getMuacColorCode(patientAge, midUpperArmCircumference, setMuacColorCode);
    }
  }, [watch, patient.patient?.birthDate, midUpperArmCircumference]);

    useEffect(() => {
    if (height && weight) {
      const computedBodyMassIndex = calculateBodyMassIndex(weight, height);
      setValue('computedBodyMassIndex', computedBodyMassIndex);
    }
  }, [weight, height, setValue]);

**/
  function onError(err) {
    if (err?.oneFieldRequired) {
      setShowErrorNotification(true);
    }
  }

  const concepts = useMemo(
    () => ({
      temperatureRange: conceptRanges.get(config.concepts.temperatureUuid),
      oxygenSaturationRange: conceptRanges.get(config.concepts.oxygenSaturationUuid),
      systolicBloodPressureRange: conceptRanges.get(config.concepts.systolicBloodPressureUuid),
      respiratoryRateRange: conceptRanges.get(config.concepts.respiratoryRateUuid),
      weightRange: conceptRanges.get(config.concepts.weightUuid),
      heightRange: conceptRanges.get(config.concepts.heightUuid),
      headCircumferenceRange: conceptRanges.get(config.concepts.headCircumferenceUuid),
      chestCircumferenceRange: conceptRanges.get(config.concepts.chestCircumferenceUuid),

      stoolCountRange: conceptRanges.get(config.concepts.stoolCountUuid), // Assuming this exists
      stoolGramsRange: conceptRanges.get(config.concepts.stoolGramsUuid), // Assuming this exists
      urineCountRange: conceptRanges.get(config.concepts.urineCountUuid), // Assuming this exists
      urineGramsRange: conceptRanges.get(config.concepts.urineGramsUuid), // Assuming this exists
      vomitCountRange: conceptRanges.get(config.concepts.vomitCountUuid), // Assuming this exists
      vomitGramsMLRange: conceptRanges.get(config.concepts.vomitGramsMLUuid), // Assuming this exists
    }),
    [
      conceptRanges,
      config.concepts.temperatureUuid,
      config.concepts.oxygenSaturationUuid,
      config.concepts.systolicBloodPressureUuid,
      config.concepts.respiratoryRateUuid,
      config.concepts.weightUuid,
      config.concepts.heightUuid,
      config.concepts.headCircumferenceUuid,
      config.concepts.chestCircumferenceUuid,
      config.concepts.stoolCountUuid, // Add this to your config if applicable
      config.concepts.stoolGramsUuid, // Add this to your config if applicable
      config.concepts.urineCountUuid, // Add this to your config if applicable
      config.concepts.urineGramsUuid, // Add this to your config if applicable
      config.concepts.vomitCountUuid, // Add this to your config if applicable
      config.concepts.vomitGramsMLUuid, // Add this to your config if applicable
    ],
  );

  const saveNeonatalVitals = useCallback(
    (data: NewbornVitalsFormType) => {
      const formData = data;
      setShowErrorMessage(true);
      setShowErrorNotification(false);

      const allFieldsAreValid = Object.entries(formData)
        .filter(([, value]) => Boolean(value))
        .every(([key, value]) => isValueWithinReferenceRange(conceptMetadata, config.concepts[`${key}Uuid`], value));

      if (allFieldsAreValid) {
        setShowErrorMessage(false);
        const abortController = new AbortController();

        savePatientVitals(
          config.vitals.encounterTypeUuid,
          config.vitals.formUuid,
          config.concepts,
          patientUuid,
          formData,
          abortController,
          session?.sessionLocation?.uuid,
        )
          .then((response) => {
            if (response.status === 201) {
              invalidateCachedVitalsAndBiometrics();
              closeWorkspaceWithSavedChanges();
              showSnackbar({
                isLowContrast: true,
                kind: 'success',
                title: t('neonatalvitalsRecorded', 'Balance del recién nacido registrado'),
                subtitle: t(
                  'vitalsAndBiometricsNowAvailable',
                  'They are now visible on the Vitals and Biometrics page',
                ),
              });
            }
          })
          .catch(() => {
            createErrorHandler();
            showSnackbar({
              title: t('vitalsAndBiometricsSaveError', 'Error guardando los datos vitals del recien nacido'),
              kind: 'error',
              isLowContrast: false,
              subtitle: t('checkForValidity', 'Some of the values entered are invalid'),
            });
          })
          .finally(() => {
            abortController.abort();
          });
      } else {
        setHasInvalidVitals(true);
      }
    },
    [
      closeWorkspaceWithSavedChanges,
      conceptMetadata,
      config.concepts,
      config.vitals.encounterTypeUuid,
      config.vitals.formUuid,
      patientUuid,
      session?.sessionLocation?.uuid,
      t,
    ],
  );

  if (isLoading) {
    return (
      <Form className={styles.form}>
        <div className={styles.grid}>
          <Stack>
            <Column>
              <p className={styles.title}>{t('recordNewbornVitals', 'Registrar signos vitales neonatales')}</p>
            </Column>
            <Row className={styles.row}>
              <Column>
                <NumberInputSkeleton />
              </Column>
              <Column>
                <NumberInputSkeleton />
              </Column>
              <Column>
                <NumberInputSkeleton />
              </Column>
              <Column>
                <NumberInputSkeleton />
              </Column>
            </Row>
          </Stack>
        </div>
        <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
          <ButtonSkeleton className={styles.button} />
          <ButtonSkeleton className={styles.button} type="submit" />
        </ButtonSet>
      </Form>
    );
  }

  return (
    <Form className={styles.form}>
      <div className={styles.grid}>
        <Stack gap={4}>
          <Column>
            <p className={styles.title}>{t('vitalSigns', 'Signos Vitales del Neonato')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  id: 'temperature',
                  max: concepts.temperatureRange?.highAbsolute ?? 43,
                  min: concepts.temperatureRange?.lowAbsolute ?? 34,
                  name: t('temperature', 'Temperatura'),
                  type: 'number',
                },
              ]}
              interpretation={
                temperature &&
                assessValue(temperature, getReferenceRangesForConcept(config.concepts.temperatureUuid, conceptMetadata))
              }
              isValueWithinReferenceRange={
                temperature
                  ? isValueWithinReferenceRange(conceptMetadata, config.concepts['temperatureUuid'], temperature)
                  : true
              }
              showErrorMessage={showErrorMessage}
              label={t('temperature', 'Temperature')}
              unitSymbol={conceptUnits.get(config.concepts.temperatureUuid) ?? 'C°'}
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  name: t('systolic', 'systolic'),
                  type: 'number',
                  min: concepts.systolicBloodPressureRange?.lowAbsolute ?? 20,
                  max: concepts.systolicBloodPressureRange?.highAbsolute ?? 150,
                  id: 'systolicBloodPressure',
                },
              ]}
              showErrorMessage={showErrorMessage}
              label={t('systolicPressure', 'Systolic Pressure (mmHg)')}
              unitSymbol={conceptUnits.get(config.concepts.systolicBloodPressureUuid) ?? ''}
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  id: 'respiratoryRate',
                  name: 'Respiration',
                  type: 'number',
                  min: 20,
                  max: 110,
                },
              ]}
              interpretation={
                respiratoryRate &&
                assessValue(
                  respiratoryRate,
                  getReferenceRangesForConcept(config.concepts.respiratoryRateUuid, conceptMetadata),
                )
              }
              isValueWithinReferenceRange={
                respiratoryRate &&
                isValueWithinReferenceRange(conceptMetadata, config.concepts['respiratoryRateUuid'], respiratoryRate)
              }
              showErrorMessage={showErrorMessage}
              label={t('respirationRate', 'Respiration rate')}
              unitSymbol={conceptUnits.get(config.concepts.respiratoryRateUuid) ?? ''}
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  name: t('oxygenSaturation', 'Oxygen saturation'),
                  type: 'number',
                  min: concepts.oxygenSaturationRange?.lowAbsolute,
                  max: concepts.oxygenSaturationRange?.highAbsolute,
                  id: 'oxygenSaturation',
                },
              ]}
              interpretation={
                oxygenSaturation &&
                assessValue(
                  oxygenSaturation,
                  getReferenceRangesForConcept(config.concepts.oxygenSaturationUuid, conceptMetadata),
                )
              }
              isValueWithinReferenceRange={
                oxygenSaturation &&
                isValueWithinReferenceRange(conceptMetadata, config.concepts['oxygenSaturationUuid'], oxygenSaturation)
              }
              showErrorMessage={showErrorMessage}
              label={t('spo2', 'SpO2')}
              unitSymbol={conceptUnits.get(config.concepts.oxygenSaturationUuid) ?? ''}
            />
          </Row>

          <Column>
            <p className={styles.title}>{t('datosAntropometricos', 'Datos Antropometricos')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  name: t('weight', 'Weight'),
                  type: 'number',
                  min: concepts.weightRange?.lowAbsolute,
                  max: concepts.weightRange?.highAbsolute,
                  id: 'weight',
                },
              ]}
              interpretation={
                weight && assessValue(weight, getReferenceRangesForConcept(config.concepts.weightUuid, conceptMetadata))
              }
              showErrorMessage={showErrorMessage}
              label={t('weight', 'Weight')}
              unitSymbol={conceptUnits.get(config.concepts.weightUuid) ?? ''}
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  id: 'height',
                  name: t('height', 'Height'),
                  type: 'number',
                  min: concepts.heightRange?.lowAbsolute,
                  max: concepts.heightRange?.highAbsolute,
                },
              ]}
              label={t('height', 'Height')}
              unitSymbol={conceptUnits.get(config.concepts.heightUuid) ?? 'cm'}
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  id: 'headCircumference',
                  name: t('headCircumference', 'Head Circumference'),
                  type: 'number',
                  min: 25,
                  max: 50,
                },
              ]}
              label={t('headCircumference', 'Head Circumference')}
              unitSymbol="cm"
            />
            <NewbornVitalsInput
              control={control}
              fieldProperties={[
                {
                  id: 'chestCircumference',
                  name: t('chestCircumference', 'Chest Circumference'),
                  type: 'number',
                  min: 20,
                  max: 45,
                },
              ]}
              label={t('chestCircumference', 'Chest Circumference')}
              unitSymbol="cm"
            />
          </Row>

          <Column>
            <p className={styles.title}>{t('fluidBalance', 'Balance de Liquidos')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('stoolCount', 'Stool Count')}
              fieldProperties={[{ id: 'stoolCount', name: 'Stool Count', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('stoolGrams', 'Stool Weight (g)')}
              fieldProperties={[{ id: 'stoolGrams', name: 'Grams', type: 'number', min: 0 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('urineCount', 'Urine Count')}
              fieldProperties={[{ id: 'urineCount', name: 'Urine Count', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('urineGrams', 'Urine Volume (g/mL)')}
              fieldProperties={[{ id: 'urineGrams', name: 'Grams', type: 'number', min: 0 }]}
            />

            <NewbornVitalsInput
              control={control}
              label={t('vomitCount', 'Vomit Count')}
              fieldProperties={[{ id: 'vomitCount', name: 'Vomit Count', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('vomitGramsML', 'Vomit Volume (g/mL)')}
              fieldProperties={[{ id: 'vomitGramsML', name: 'Grams', type: 'number', min: 0 }]}
            />
          </Row>
        </Stack>
      </div>
      {showErrorNotification && (
        <Column className={styles.errorContainer}>
          <InlineNotification
            className={styles.errorNotification}
            lowContrast={false}
            onClose={() => setShowErrorNotification(false)}
            title={t('error', 'Error')}
            subtitle={t('pleaseFillField', 'Por favor, complete al menos un campo') + '.'}
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Descartar')}
        </Button>
        <Button
          className={styles.button}
          kind="primary"
          onClick={handleSubmit(saveNeonatalVitals, onError)}
          disabled={isSubmitting}
          type="submit"
        >
          {t('submit', 'Guardar y Cerrar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default NewbornVitalsForm;
