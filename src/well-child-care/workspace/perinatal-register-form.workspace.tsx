import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonSet, Column, Form, InlineNotification, Stack, TextInput } from '@carbon/react';
import {
  createErrorHandler,
  showSnackbar,
  useConfig,
  useLayoutType,
  useSession,
  usePatient,
  useVisit,
} from '@openmrs/esm-framework';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import type { ConfigObject } from '../../config-schema';
import { savePrenatalAntecedents, usePrenatalAntecedents } from '../../hooks/usePrenatalAntecedents';
import styles from './perinatal-register-form.scss';

// Definir el esquema de validación con Zod
const PerinatalRegisterSchema = z.object({
  gravidez: z.number().optional(),
  partoAlTermino: z.number().optional(),
  partoPrematuro: z.number().optional(),
  partoAborto: z.number().optional(),
  partoNacidoVivo: z.number().optional(),
});

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

  // Fetch the latest prenatal antecedents data
  const {
    data: formattedObs,
    isLoading: isLoadingAntecedents,
    error: antecedentsError,
  } = usePrenatalAntecedents(patientUuid);

  // Extract the latest register data
  const latestRegister = formattedObs?.[0];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<PerinatalRegisterFormType>({
    mode: 'all',
    resolver: zodResolver(PerinatalRegisterSchema),
    defaultValues: {
      gravidez: latestRegister?.gravidez,
      partoAlTermino: latestRegister?.partoAlTermino,
      partoPrematuro: latestRegister?.partoPrematuro,
      partoAborto: latestRegister?.partoAborto,
      partoNacidoVivo: latestRegister?.partoNacidoVivo,
    },
  });

  useEffect(() => {
    promptBeforeClosing(() => isDirty);
  }, [isDirty, promptBeforeClosing]);

  const savePerinatalData = useCallback(
    (data: PerinatalRegisterFormType) => {
      setIsSubmitting(true);
      setShowErrorNotification(false);

      const abortController = new AbortController();

      // Filtrar solo los campos que queremos registrar
      const filteredData = {
        gravidez: data.gravidez,
        partoAlTermino: data.partoAlTermino,
        partoPrematuro: data.partoPrematuro,
        partoAborto: data.partoAborto,
        partoNacidoVivo: data.partoNacidoVivo,
      };

      savePrenatalAntecedents(
        config.encounterTypes.prenatalControl,
        config.formsList.maternalHistory,
        config.concepts,
        patientUuid,
        filteredData,
        abortController,
        session?.sessionLocation?.uuid,
      )
        .then((response) => {
          if (response.status === 201) {
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
    [closeWorkspaceWithSavedChanges, config, patientUuid, session?.sessionLocation?.uuid, t],
  );

  function onError(err) {
    if (err?.oneFieldRequired) {
      setShowErrorNotification(true);
    }
  }

  if (!patient || !currentVisit || isLoadingAntecedents) {
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

  if (antecedentsError) {
    return (
      <Form className={styles.form}>
        <div className={styles.grid}>
          <Stack>
            <Column>
              <InlineNotification
                kind="error"
                title={t('errorLoadingData', 'Error loading data')}
                subtitle={t('errorLoadingDataDescription', 'There was an error loading the latest register data.')}
              />
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

          <Column>
            <Controller
              control={control}
              name="gravidez"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder={t('gravidez', 'Gravidez')}
                  labelText={t('gravidez', 'Gravidez')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
          </Column>

          <Column>
            <Controller
              control={control}
              name="partoAlTermino"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder={t('partoAlTermino', 'Partos a término')}
                  labelText={t('partoAlTermino', 'Partos a término')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
          </Column>

          <Column>
            <Controller
              control={control}
              name="partoPrematuro"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder={t('partoPrematuro', 'Partos prematuros')}
                  labelText={t('partoPrematuro', 'Partos prematuros')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
          </Column>

          <Column>
            <Controller
              control={control}
              name="partoAborto"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder={t('partoAborto', 'Abortos')}
                  labelText={t('partoAborto', 'Abortos')}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              )}
            />
          </Column>

          <Column>
            <Controller
              control={control}
              name="partoNacidoVivo"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  invalid={Boolean(error?.message)}
                  invalidText={error?.message}
                  {...field}
                  type="number"
                  placeholder={t('partoNacidoVivo', 'Nacidos vivos')}
                  labelText={t('partoNacidoVivo', 'Nacidos vivos')}
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
