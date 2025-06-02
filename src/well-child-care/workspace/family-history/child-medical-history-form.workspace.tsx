import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, ButtonSet, Form, InlineLoading, InlineNotification } from '@carbon/react';
import { useLayoutType, useSession } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import {
  type Condition,
  usePediatricMedicalHistoryConditions,
  createCondition,
  updateCondition,
} from '../../components/neonatal-register/family-history/conditions.resource';
import ChildMedicalHistoryWidget from './child-medical-history-widget.component';
import styles from './conditions-form.scss';

interface ChildMedicalHistoryFormProps extends DefaultPatientWorkspaceProps {
  condition?: Condition;
  formContext: 'creating' | 'editing';
  conceptSetMembers?: Array<any>;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const createSchema = (formContext: 'creating' | 'editing', t: Function) => {
  const isCreating = formContext === 'creating';
  const clinicalStatusValidation = z.string().refine((clinicalStatus) => !isCreating || !!clinicalStatus, {
    message: t('clinicalStatusRequired', 'El estado clínico es requerido'),
  });
  const conditionNameValidation = z.string().refine((conditionName) => !isCreating || !!conditionName, {
    message: t('conditionRequired', 'El antecedente patológico es requerido'),
  });

  return z.object({
    abatementDateTime: z.date().optional().nullable(),
    clinicalStatus: clinicalStatusValidation,
    conditionName: conditionNameValidation,
    onsetDateTime: z.date().nullable(),
    conceptId: z.string().optional(),
  });
};

export type ChildMedicalHistoryFormSchema = z.infer<ReturnType<typeof createSchema>>;

const ChildMedicalHistoryForm: React.FC<ChildMedicalHistoryFormProps> = ({
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  condition,
  formContext,
  patientUuid,
  promptBeforeClosing,
  conceptSetMembers,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { conditions, refreshConditions } = usePediatricMedicalHistoryConditions(patientUuid);
  const { user } = useSession();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [errorCreating, setErrorCreating] = useState(null);
  const [errorUpdating, setErrorUpdating] = useState(null);
  const isEditing = formContext === 'editing';

  const matchingCondition = conditions?.find((c) => c?.id === condition?.id);

  const schema = createSchema(formContext, t);

  const defaultValues = {
    abatementDateTime:
      isEditing && matchingCondition?.abatementDateTime ? new Date(matchingCondition?.abatementDateTime) : null,
    conditionName: isEditing ? (matchingCondition?.display ?? '') : '',
    clinicalStatus: isEditing ? (matchingCondition?.clinicalStatus?.toLowerCase() ?? '') : 'active',
    onsetDateTime:
      isEditing && matchingCondition?.onsetDateTime ? new Date(matchingCondition?.onsetDateTime) : new Date(),
    conceptId: isEditing ? matchingCondition?.conceptId : '',
  };

  const methods = useForm<ChildMedicalHistoryFormSchema>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    promptBeforeClosing(() => isDirty);
  }, [isDirty, promptBeforeClosing]);

  const onFormSubmit: SubmitHandler<ChildMedicalHistoryFormSchema> = async (data) => {
    setIsSubmittingForm(true);
    const userId = user?.uuid;

    const payload = {
      clinicalStatus: data.clinicalStatus,
      conceptId: data.conceptId || (isEditing ? matchingCondition?.conceptId : ''),
      display: data.conditionName,
      abatementDateTime: data.abatementDateTime?.toISOString() ?? undefined,
      onsetDateTime: data.onsetDateTime?.toISOString() ?? new Date().toISOString(),
      patientId: patientUuid,
      userId: userId,
    };

    try {
      if (isEditing && condition?.id) {
        // Actualizar condición existente
        const response = await updateCondition(condition.id, payload);
        if (response.status === 200) {
          refreshConditions();
          if (onSubmit) onSubmit();
          closeWorkspaceWithSavedChanges();
        }
      } else {
        // Crear nueva condición
        const response = await createCondition(payload);
        if (response.status === 201) {
          refreshConditions();
          if (onSubmit) onSubmit();
          closeWorkspaceWithSavedChanges();
        }
      }
    } catch (error) {
      if (isEditing) {
        setErrorUpdating(error);
      } else {
        setErrorCreating(error);
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const onError = () => setIsSubmittingForm(false);

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeWorkspace();
  };

  return (
    <FormProvider {...methods}>
      <Form className={styles.form} onSubmit={methods.handleSubmit(onFormSubmit, onError)}>
        <ChildMedicalHistoryWidget
          closeWorkspaceWithSavedChanges={closeWorkspaceWithSavedChanges}
          conditionToEdit={condition}
          isEditing={isEditing}
          isSubmittingForm={isSubmittingForm}
          patientUuid={patientUuid}
          setErrorCreating={setErrorCreating}
          setErrorUpdating={setErrorUpdating}
          setIsSubmittingForm={setIsSubmittingForm}
          conceptSetMembers={conceptSetMembers}
        />
        <div>
          {errorCreating ? (
            <div className={styles.errorContainer}>
              <InlineNotification
                className={styles.error}
                role="alert"
                kind="error"
                lowContrast
                title={t('errorCreatingCondition', 'Error al crear el antecedente patológico')}
                subtitle={errorCreating?.message}
              />
            </div>
          ) : null}
          {errorUpdating ? (
            <div className={styles.errorContainer}>
              <InlineNotification
                className={styles.error}
                role="alert"
                kind="error"
                lowContrast
                title={t('errorUpdatingCondition', 'Error al actualizar el antecedente patológico')}
                subtitle={errorUpdating?.message}
              />
            </div>
          ) : null}
          <ButtonSet className={classNames({ [styles.tablet]: isTablet, [styles.desktop]: !isTablet })}>
            <Button className={styles.button} kind="secondary" onClick={handleCancel}>
              {t('cancel', 'Cancelar')}
            </Button>
            <Button className={styles.button} disabled={isSubmittingForm} kind="primary" type="submit">
              {isSubmittingForm ? (
                <InlineLoading className={styles.spinner} description={t('saving', 'Guardando') + '...'} />
              ) : (
                <span>{t('saveAndClose', 'Guardar y cerrar')}</span>
              )}
            </Button>
          </ButtonSet>
        </div>
      </Form>
    </FormProvider>
  );
};

export default ChildMedicalHistoryForm;
