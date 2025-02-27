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

// 📌 Esquema de validación con Zod
const NewbornVitalsSchema = z
  .object({
    temperatura: z.number(),
    saturacionOxigeno: z.number(),
    presionSistolica: z.number(),
    frecuenciaRespiratoria: z.number(),
    peso: z.number(),
    altura: z.number(),
    imc: z.number(),
    numeroDeposiciones: z.number(),
    deposicionesGramos: z.number(),
    numeroMicciones: z.number(),
    miccionesGramos: z.number(),
    numeroVomito: z.number(),
    vomitoGramosML: z.number(),
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
  const session = useSession();
  const patient = usePatient(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

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
            <p className={styles.title}>{t('vitalSigns', 'Signos Vitales')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('temperatura', 'Temperatura (°C)')}
              fieldProperties={[{ id: 'temperatura', name: 'Temperatura', type: 'number', min: 30, max: 45 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('saturacionOxigeno', 'Saturación O₂ (%)')}
              fieldProperties={[{ id: 'saturacionOxigeno', name: 'Saturación', type: 'number', min: 50, max: 100 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('presionSistolica', 'Presión Sistólica (mmHg)')}
              fieldProperties={[{ id: 'presionSistolica', name: 'Presión', type: 'number', min: 60, max: 150 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('frecuenciaRespiratoria', 'Frecuencia Respiratoria (rpm)')}
              fieldProperties={[
                { id: 'frecuenciaRespiratoria', name: 'Respiración', type: 'number', min: 10, max: 100 },
              ]}
            />
          </Row>

          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('saturacionOxigeno', 'Saturación O₂ (%)')}
              fieldProperties={[{ id: 'saturacionOxigeno', name: 'Saturación', type: 'number', min: 50, max: 100 }]}
            />
          </Row>

          <Column>
            <p className={styles.title}>{t('fluidBalance', 'Balance de Líquidos')}</p>
          </Column>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('numeroDeposiciones', 'N° Deposiciones')}
              fieldProperties={[{ id: 'numeroDeposiciones', name: 'Deposiciones', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('deposicionesGramos', 'Deposiciones (g)')}
              fieldProperties={[{ id: 'deposicionesGramos', name: 'Gramos', type: 'number', min: 0 }]}
            />
          </Row>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('numeroMicciones', 'N° Micciones')}
              fieldProperties={[{ id: 'numeroMicciones', name: 'Micciones', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('miccionesGramos', 'Micciones (g/mL)')}
              fieldProperties={[{ id: 'miccionesGramos', name: 'Gramos', type: 'number', min: 0 }]}
            />
          </Row>
          <Row className={styles.row}>
            <NewbornVitalsInput
              control={control}
              label={t('numeroVomito', 'N° Vómitos')}
              fieldProperties={[{ id: 'numeroVomito', name: 'Vómito', type: 'number', min: 0, max: 20 }]}
            />
            <NewbornVitalsInput
              control={control}
              label={t('vomitoGramosML', 'Vómito (g/mL)')}
              fieldProperties={[{ id: 'vomitoGramosML', name: 'Gramos', type: 'number', min: 0 }]}
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
