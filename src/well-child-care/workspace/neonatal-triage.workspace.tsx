import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonSet, Column, Form, InlineNotification, Row, Stack } from '@carbon/react';
import { showSnackbar, useConfig, useLayoutType, useSession, usePatient, useVisit } from '@openmrs/esm-framework';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import { invalidateCachedVitalsAndBiometrics, saveVitalsAndBiometrics as savePatientVitals } from '../common';
import NewbornVitalsInput from './newborn-vitals-input.component';
import styles from './newborn-vitals-form.scss';

// 📌 Esquema de validación con Zod
const NewbornVitalsSchema = z.object({
  // Signos vitales
  temperatura: z.number().min(30).max(45),
  saturacionOxigeno: z.number().min(50).max(100),
  presionSistolica: z.number().min(60).max(150),
  frecuenciaRespiratoria: z.number().min(10).max(100),
  peso: z.number().min(0.5).max(10),
  altura: z.number().min(30).max(100),
  imc: z.number().optional(),

  // Balance de líquidos
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

  // Calcular IMC automáticamente cuando cambian el peso y la altura
  const peso = watch('peso');
  const altura = watch('altura');

  useEffect(() => {
    if (peso && altura) {
      const imc = peso / (altura / 100) ** 2;
      setValue('imc', parseFloat(imc.toFixed(2))); // Guardamos el IMC con dos decimales
    }
  }, [peso, altura, setValue]);

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
        showSnackbar({
          title: t('saveError', 'Error al guardar'),
          kind: 'error',
          subtitle: t('checkInput', 'Revise los valores ingresados'),
        });
      }
    },
    [closeWorkspaceWithSavedChanges, patientUuid, t, config],
  );

  return (
    <Form className={styles.form} onSubmit={handleSubmit(saveNewbornVitals)}>
      <Stack gap={4}>
        {/* Sección de signos vitales */}
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
        </Row>

        {/* Sección de balance de líquidos */}
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
      </Stack>

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
