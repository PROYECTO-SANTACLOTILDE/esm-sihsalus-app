import { Button } from '@carbon/react';
import { ArrowLeftIcon, useLayoutType } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLaunchCREDForm } from '../../../hooks/useLaunchCREDForm';
import FormsList from '../well-child-control/components/forms-list.component';
import type { CompletedFormInfo } from '../well-child-control/types';
import styles from './forms-selector.scss';

export interface FormsSelectorWorkspaceAdditionalProps {
  availableForms: Array<CompletedFormInfo>;
  patientAge: string;
  controlNumber: number;
  title?: string;
  subtitle?: string;
  backWorkspace?: string;
  onComplete?: () => void;
}

export interface FormsSelectorWorkspace extends DefaultPatientWorkspaceProps, FormsSelectorWorkspaceAdditionalProps {}

export default function FormsSelectorWorkspace({
  availableForms,
  patientAge,
  controlNumber,
  title,
  subtitle,
  backWorkspace = 'wellchild-control-form',
  onComplete,
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
}: FormsSelectorWorkspace) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { launchCREDForm } = useLaunchCREDForm();
  const [completedForms, setCompletedForms] = useState<Set<string>>(new Set());

  const backToPreviousWorkspace = useCallback(() => {
    closeWorkspace({
      onWorkspaceClose: () => launchPatientWorkspace(backWorkspace),
      closeWorkspaceGroup: false,
    });
  }, [closeWorkspace, backWorkspace]);

  const handleFormOpen = useCallback(
    (form: any, encounterUuid: string) => {
      // Mark form as completed (for UI feedback)
      setCompletedForms((prev) => new Set(prev).add(form.uuid));

      // Launch the form (could be CRED or any other type)
      launchCREDForm(form, encounterUuid);
    },
    [launchCREDForm],
  );

  const handleFinishControl = useCallback(() => {
    // Save all completed forms and finish
    if (onComplete) {
      onComplete();
    }

    closeWorkspaceWithSavedChanges({
      onWorkspaceClose: () => {
        // Could navigate back to main dashboard or show success message
      },
    });
  }, [closeWorkspaceWithSavedChanges, onComplete]);

  const isAnyFormCompleted = completedForms.size > 0;

  return (
    <div className={styles.container}>
      {/* Back button */}
      {!isTablet && (
        <div className={styles.backButton}>
          <Button
            iconDescription={t('backToPrevious', 'Volver')}
            kind="ghost"
            onClick={backToPreviousWorkspace}
            renderIcon={(props: ComponentProps<typeof ArrowLeftIcon>) => <ArrowLeftIcon size={24} {...props} />}
            size="sm"
          >
            <span>{t('backToPrevious', 'Volver')}</span>
          </Button>
        </div>
      )}

      {/* Header info */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title || t('formsSelection', 'Selección de Formularios')}</h2>
        <div className={styles.patientInfo}>
          <span>
            {t('patientAge', 'Edad del paciente NIGGER')}: {patientAge}
          </span>
          <span>
            {t('controlNumber', 'Control #')}: {controlNumber}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <p>
          {subtitle ||
            t(
              'formsInstructions',
              'Seleccione los formularios que desea completar. Puede completar múltiples formularios según las necesidades del paciente.',
            )}
        </p>
      </div>

      {/* Forms table */}
      <div className={styles.formsContainer}>
        <FormsList
          completedForms={availableForms}
          handleFormOpen={handleFormOpen}
          sectionName={t('availableForms', 'Formularios Disponibles')}
        />
      </div>

      {/* Completed forms counter */}
      {isAnyFormCompleted && (
        <div className={styles.progressInfo}>
          <p>
            {t('formsCompleted', 'Formularios completados')}: {completedForms.size}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actionButtons}>
        <Button kind="secondary" onClick={backToPreviousWorkspace} className={styles.actionButton}>
          {t('cancel', 'Cancelar')}
        </Button>
        <Button
          kind="primary"
          onClick={handleFinishControl}
          disabled={!isAnyFormCompleted}
          className={styles.actionButton}
        >
          {t('finishAndSign', 'Guardar y Firmar')}
        </Button>
      </div>
    </div>
  );
}
