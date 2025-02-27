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
    temperature: z.number(), // temperatura -> temperature
    oxygenSaturation: z.number(), // saturacionOxigeno -> oxygenSaturation
    systolicPressure: z.number(), // presionSistolica -> systolicPressure
    respiratoryRate: z.number(), // frecuenciaRespiratoria -> respiratoryRate
    weight: z.number(), // peso -> weight
    stoolCount: z.number(), // numeroDeposiciones -> stoolCount
    stoolGrams: z.number(), // deposicionesGramos -> stoolGrams
    urineCount: z.number(), // numeroMicciones -> urineCount
    urineGrams: z.number(), // miccionesGramos -> urineGrams
    vomitCount: z.number(), // numeroVomito -> vomitCount
    vomitGramsML: z.number(), // vomitoGramosML -> vomitGramsML
  })
  .partial()
  .refine(
    (fields) => {
      return Object.values(fields).some((value) => Boolean(value));
    },
    {
      message: 'Please fill at least one field',
      path: ['oneFieldRequired'],
    },
  );

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
  const useMuacColorStatus = config.vitals.useMuacColors;

  const session = useSession();
  const patient = usePatient(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const { data: conceptUnits, conceptMetadata, conceptRanges, isLoading } = useVitalsConceptMetadata();
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
  const systolicPressure = watch('systolicPressure');
  const respiratoryRate = watch('respiratoryRate');
  const weight = watch('weight');
  const stoolCount = watch('stoolCount');
  const stoolGrams = watch('stoolGrams');
  const urineCount = watch('urineCount');
  const urineGrams = watch('urineGrams');
  const vomitCount = watch('vomitCount');
  const vomitGramsML = watch('vomitGramsML');

  if (!patient?.patient) {
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
              label={t('temperature', 'Temperature (°C)')}
              fieldProperties={[{ id: 'temperature', name: 'Temperature', type: 'number', min: 30, max: 45 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('oxygenSaturation', 'Oxygen Saturation (%)')}
              fieldProperties={[{ id: 'oxygenSaturation', name: 'Saturation', type: 'number', min: 50, max: 100 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('systolicPressure', 'Systolic Pressure (mmHg)')}
              fieldProperties={[{ id: 'systolicPressure', name: 'Pressure', type: 'number', min: 60, max: 150 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('respiratoryRate', 'Respiratory Rate (rpm)')}
              fieldProperties={[{ id: 'respiratoryRate', name: 'Respiration', type: 'number', min: 10, max: 100 }]}
            />
          </Row>

          <Column>
            <p className={styles.title}>{t('fluidBalance', 'Balance de Peso')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('weight', 'Weight')}
              fieldProperties={[{ id: 'weight', name: 'Weight', type: 'number', min: 0 }]}
            />
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
          </Row>
          <Row className={styles.row}>
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
          </Row>
          <Row className={styles.row}>
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
            lowContrast
            title={t('error', 'Error')}
            subtitle={t('pleaseFillField', 'Por favor, complete al menos un campo') + '.'}
            onClose={() => setShowErrorNotification(false)}
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Descartar')}
        </Button>
        <Button className={styles.button} kind="primary" type="submit" disabled={isSubmitting}>
          {t('submit', 'Guardar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default NewbornVitalsForm;
