import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonSet, Column, Form, InlineNotification, NumberInput, Row, Stack } from '@carbon/react';
import {
  createErrorHandler,
  showSnackbar,
  useConfig,
  useLayoutType,
  useSession,
  usePatient,
  useVisit,
} from '@openmrs/esm-framework';
import {
  assessValue,
  getReferenceRangesForConcept,
  interpretBloodPressure,
  invalidateCachedVitalsAndBiometrics,
  saveVitalsAndBiometrics as savePatientVitals,
  useVitalsConceptMetadata,
} from '../common';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import styles from './newborn-vitals-form.scss';

// 📌 Esquema de validación con Zod
const NewbornVitalsSchema = z.object({
  temperatura: z.number().min(30).max(45),
  saturacionOxigeno: z.number().min(50).max(100),
  presionSistolica: z.number().min(60).max(150),
  frecuenciaRespiratoria: z.number().min(10).max(100),
  peso: z.number().min(0.5).max(10),
  numeroDeposiciones: z.number().min(0).max(20),
  deposicionesGramos: z.number().min(0).optional(),
  numeroMicciones: z.number().min(0).max(20),
  miccionesGramos: z.number().min(0).optional(),
  numeroVomito: z.number().min(0).max(20),
  vomitoGramosML: z.number().min(0).optional(),
});

// 📌 Tipo TypeScript inferido de Zod
export type NewbornVitalsFormType = z.infer<typeof NewbornVitalsSchema>;

const NewbornVitalsForm: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig();
  const session = useSession();
  const patient = usePatient(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const { conceptMetadata, conceptRanges } = useVitalsConceptMetadata();
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

  function onError(err) {
    if (err) {
      setShowErrorNotification(true);
    }
  }

  const saveNewbornVitals = useCallback(
    async (data: NewbornVitalsFormType) => {
      try {
        await savePatientVitals(
          config.vitals.encounterTypeUuid,
          config.vitals.formUuid,
          config.concepts,
          patientUuid,
          data,
          new AbortController(),
          session?.sessionLocation?.uuid,
        );

        invalidateCachedVitalsAndBiometrics();
        showSnackbar({
          title: t('newbornVitalsSaved', 'Signos vitales guardados'),
          kind: 'success',
          subtitle: t('dataSuccessfullySaved', 'Los datos han sido guardados correctamente'),
        });

        closeWorkspaceWithSavedChanges();
      } catch (error) {
        createErrorHandler();
        showSnackbar({
          title: t('saveError', 'Error al guardar'),
          kind: 'error',
          subtitle: t('checkInput', 'Revise los valores ingresados'),
        });
      }
    },
    [closeWorkspaceWithSavedChanges, patientUuid, t, config.vitals.encounterTypeUuid],
  );

  return (
    <Form className={styles.form} onSubmit={handleSubmit(saveNewbornVitals, onError)}>
      <Stack gap={4}>
        <Column>
          <p className={styles.title}>{t('recordNewbornVitals', 'Registrar signos vitales neonatales')}</p>
        </Column>
        <Row className={styles.row}>
          <Column>
            <NumberInput control={control} id="temperatura" label={t('temperatura', 'Temperatura (°C)')} />
          </Column>
          <Column>
            <NumberInput
              control={control}
              id="saturacionOxigeno"
              label={t('saturacionOxigeno', 'Saturación de O₂ (%)')}
            />
          </Column>
          <Column>
            <NumberInput
              control={control}
              id="presionSistolica"
              label={t('presionSistolica', 'Presión Sistólica (mmHg)')}
            />
          </Column>
          <Column>
            <NumberInput
              control={control}
              id="frecuenciaRespiratoria"
              label={t('frecuenciaRespiratoria', 'Frecuencia Resp.')}
            />
          </Column>
        </Row>

        <Row className={styles.row}>
          <Column>
            <NumberInput control={control} id="peso" label={t('peso', 'Peso (kg)')} />
          </Column>
          <Column>
            <NumberInput control={control} id="numeroDeposiciones" label={t('numeroDeposiciones', 'N° Deposiciones')} />
          </Column>
          <Column>
            <NumberInput
              control={control}
              id="deposicionesGramos"
              label={t('deposicionesGramos', 'Deposiciones (g)')}
            />
          </Column>
        </Row>

        <Row className={styles.row}>
          <Column>
            <NumberInput control={control} id="numeroMicciones" label={t('numeroMicciones', 'N° Micciones')} />
          </Column>
          <Column>
            <NumberInput control={control} id="miccionesGramos" label={t('miccionesGramos', 'Micciones (g/mL)')} />
          </Column>
        </Row>

        <Row className={styles.row}>
          <Column>
            <NumberInput control={control} id="numeroVomito" label={t('numeroVomito', 'N° Vómito')} />
          </Column>
          <Column>
            <NumberInput control={control} id="vomitoGramosML" label={t('vomitoGramosML', 'Vómito (g/mL)')} />
          </Column>
        </Row>
      </Stack>

      {showErrorNotification && (
        <Column className={styles.errorContainer}>
          <InlineNotification
            title={t('error', 'Error')}
            subtitle={t('pleaseFillFields', 'Por favor, complete los campos obligatorios')}
            onClose={() => setShowErrorNotification(false)}
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Descartar')}
        </Button>
        <Button kind="primary" type="submit" disabled={isSubmitting}>
          {t('submit', 'Guardar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default NewbornVitalsForm;
