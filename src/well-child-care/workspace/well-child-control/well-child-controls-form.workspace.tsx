import { Button, ButtonSet, Column, Form, InlineNotification, TextInput, Tile, Tooltip } from '@carbon/react';
import { Information as InformationIcon } from '@carbon/react/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  age,
  createErrorHandler,
  openmrsFetch,
  ResponsiveWrapper,
  restBaseUrl,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
  useSession,
} from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import { z } from 'zod';
import type { ConfigObject } from '../../../config-schema';
import useCREDEncounters from '../../../hooks/useEncountersCRED';
import { useLaunchCREDForm } from '../../../hooks/useLaunchCREDForm';
import EncounterDateTimeSection from '../../../ui/encounter-date-time/encounter-date-time.component';
import FormsList from './components/forms-list.component';
import type { CompletedFormInfo } from './types';
import styles from './well-child-controls-form.scss';
// Define FormType locally if not exported by the library
export interface FormType {
  uuid: string;
  name: string;
  display: string;
  version: string;
  published: boolean;
  retired: boolean;
  resources: any[];
  formCategory?: string;
}

// Validation schema
const CREDControlsSchema = z.object({
  consultationDate: z.date({
    required_error: 'Fecha de atención es requerida',
  }),
  consultationTime: z.string().min(1, 'Hora de atención es requerida'),
  controlNumber: z.string().optional(),
  attendedAge: z.string().optional(),
});

export type CREDControlsFormType = z.infer<typeof CREDControlsSchema>;

const CREDControlsWorkspace: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  // Import age group utilities
  const { filterFormsByAge, getAgeGroupFromBirthDate, FORM_UUID_MAPPING } = require('./utils/age-group-utils');

  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const session = useSession();
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const { encounters, isLoading: isEncountersLoading } = useCREDEncounters(patientUuid);
  const { launchCREDForm } = useLaunchCREDForm();
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting, errors },
    register,
    setValue,
  } = useForm<CREDControlsFormType>({
    mode: 'all',
    resolver: zodResolver(CREDControlsSchema),
    defaultValues: {
      consultationDate: new Date(),
      consultationTime: new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    },
  });

  useEffect(() => {
    promptBeforeClosing(() => isDirty);
  }, [isDirty, promptBeforeClosing]);

  // Calculate CRED control number automatically (count of previous CRED encounters)
  const credControlNumber = useMemo(() => {
    return encounters ? encounters.length + 1 : 1;
  }, [encounters]);

  // Calculate age group from patient's birth date
  const ageGroup = useMemo(() => {
    if (!patient?.birthDate) return null;
    return getAgeGroupFromBirthDate(patient.birthDate);
  }, [patient?.birthDate, getAgeGroupFromBirthDate]);

  // Format age for display
  const formattedAge = useMemo(() => {
    if (!patient?.birthDate) return '';
    return age(patient.birthDate);
  }, [patient?.birthDate]);

  // Available forms for CRED control - using actual form UUIDs from config
  const allAvailableForms: CompletedFormInfo[] = useMemo(
    () => [
      {
        form: {
          uuid: config.formsList.childFeeding0to5,
          name: 'Evaluación de la alimentación (0-5 meses)',
          display: 'Evaluación de la alimentación (0-5 meses)',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.childFeeding6to42,
          name: 'Evaluación de la alimentación (6-42 meses)',
          display: 'Evaluación de la alimentación (6-42 meses)',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.childAbuseScreening,
          name: 'Tamizaje de Violencia y Maltrato Infantil',
          display: 'Tamizaje de Violencia y Maltrato Infantil',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.riskInterview0to30,
          name: 'Entrevista de Factores de Riesgo',
          display: 'Entrevista de Factores de Riesgo (0-30 meses)',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.eedp12Months,
          name: 'EEDP - 12 meses',
          display: 'EEDP - Evaluación del desarrollo psicomotor (12 meses)',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.tepsi,
          name: 'TEPSI',
          display: 'TEPSI - Test de desarrollo psicomotor',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.nursingAssessment,
          name: 'Valoración de Enfermería',
          display: 'Valoración de Enfermería',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
      {
        form: {
          uuid: config.formsList.medicalOrders,
          name: 'Órdenes Médicas',
          display: 'Órdenes Médicas',
          version: '1.0',
          published: true,
          retired: false,
          resources: [],
          formCategory: 'CRED',
        },
        associatedEncounters: [],
        lastCompletedDate: undefined,
      },
    ],
    [config.formsList],
  );

  // Filter forms based on patient's age group (temporarily disabled to show all forms)
  const availableForms: CompletedFormInfo[] = useMemo(() => {
    // For debugging: always return all forms to ensure they show up
    return allAvailableForms;

    // Original filtering logic (commented out for now):
    // if (!patient?.birthDate) return allAvailableForms;
    // try {
    //   return filterFormsByAge(allAvailableForms, patient.birthDate);
    // } catch (error) {
    //   console.warn('Error filtering forms by age:', error);
    //   return allAvailableForms;
    // }
  }, [allAvailableForms]);

  // Handle form opening from table
  const handleFormOpen = useCallback(
    (form: FormType, encounterUuid: string) => {
      const consultationData = watch();

      // Validate required fields before launching form
      if (!consultationData.consultationDate || !consultationData.consultationTime) {
        setShowErrorNotification(true);
        return;
      }

      // Validate that there's an active visit
      if (!currentVisit) {
        setShowErrorNotification(true);
        return;
      }

      setSelectedForm(form.uuid);

      // Store consultation data in sessionStorage for the target form (optional, for form context)
      sessionStorage.setItem(
        'credConsultationData',
        JSON.stringify({
          ...consultationData,
          patientUuid,
          visitUuid: currentVisit?.uuid,
          selectedFormUuid: form.uuid,
        }),
      );

      // Use the CRED form launcher to open the form in workspace
      launchCREDForm(form, encounterUuid);

      // Close this workspace after launching the form
      closeWorkspace();
    },
    [watch, patientUuid, currentVisit, launchCREDForm, closeWorkspace],
  );

  const saveConsultationData = useCallback(
    async (data: CREDControlsFormType) => {
      setShowErrorNotification(false);

      try {
        const encounterPayload = {
          encounterType: config.encounterTypes.healthyChildControl || 'CRED_ENCOUNTER_TYPE_UUID',
          form: config.formsList.childAbuseScreening || 'CRED_FORM_UUID',
          patient: patientUuid,
          location: session?.sessionLocation?.uuid,
          visit: currentVisit?.uuid,
          encounterDatetime: data.consultationDate?.toISOString(),
          obs: [
            {
              concept: config.concepts?.consultationTime || 'CONSULTATION_TIME_CONCEPT_UUID',
              value: data.consultationTime,
            },
            data.controlNumber && {
              concept: config.concepts?.controlNumber || 'CONTROL_NUMBER_CONCEPT_UUID',
              value: data.controlNumber,
            },
            data.attendedAge && {
              concept: config.concepts?.attendedAge || 'ATTENDED_AGE_CONCEPT_UUID',
              value: data.attendedAge,
            },
          ].filter(Boolean),
        };

        const response = await openmrsFetch(`${restBaseUrl}/encounter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(encounterPayload),
        });

        if (response.ok) {
          // Invalidate and refetch encounters
          mutate(`${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=CRED_ENCOUNTER_TYPE_UUID`);

          closeWorkspaceWithSavedChanges();
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('consultationSaved', 'Consulta Guardada'),
            subtitle: t('dataSaved', 'Los datos han sido guardados exitosamente.'),
          });
        } else {
          throw new Error('Error al guardar la consulta');
        }
      } catch (error) {
        createErrorHandler();
        showSnackbar({
          title: t('saveError', 'Error al guardar'),
          kind: 'error',
          isLowContrast: false,
          subtitle: error?.message || 'Error desconocido',
        });
      }
    },
    [patientUuid, currentVisit, session?.sessionLocation?.uuid, config, closeWorkspaceWithSavedChanges, t],
  );

  const onError = (err) => {
    if (Object.keys(err).length > 0) {
      setShowErrorNotification(true);
    }
  };

  // Set current date and time on component mount
  useEffect(() => {
    const now = new Date();
    setValue('consultationDate', now);
    setValue(
      'consultationTime',
      now.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    );

    // Set control number automatically
    setValue('controlNumber', credControlNumber.toString());

    // Set age group or formatted age
    setValue('attendedAge', ageGroup ? ageGroup.name : formattedAge);
  }, [setValue, patient, credControlNumber, ageGroup, formattedAge]);

  if (isPatientLoading || isEncountersLoading) {
    return (
      <ResponsiveWrapper>
        <div className={styles.loadingContainer}>{t('loading', 'Cargando...')}</div>
      </ResponsiveWrapper>
    );
  }

  return (
    <Form className={styles.form}>
      <div className={styles.grid}>
        <EncounterDateTimeSection
          control={control}
          firstEncounterDateTime={
            encounters[0]?.encounterDatetime ? new Date(encounters[0].encounterDatetime).getTime() : undefined
          }
          lastEncounterDateTime={
            encounters[encounters.length - 1]?.encounterDatetime
              ? new Date(encounters[encounters.length - 1].encounterDatetime).getTime()
              : undefined
          }
        />

        <div className={styles.controlInfoRow}>
          <Column lg={4} md={2} sm={2}>
            <TextInput
              id="lastControlDate"
              labelText={t('lastControlDate', 'Fecha de Último control')}
              value={
                encounters && encounters.length > 0
                  ? new Date(encounters[encounters.length - 1].encounterDatetime).toLocaleDateString('es-PE')
                  : t('neverPerformed', 'Nunca se ha hecho')
              }
              readOnly
              helperText={t('lastControlHelper', '* Fecha del último control realizado')}
            />
          </Column>
          <Column lg={4} md={2} sm={2}>
            <TextInput
              id="controlNumber"
              labelText={t('controlNumber', 'Número de control')}
              value={credControlNumber.toString()}
              readOnly
              helperText={t('controlNumberHelper', '* Según controles previos')}
              {...register('controlNumber')}
            />
          </Column>
        </div>

        <div className={styles.controlInfoRow}>
          <Column lg={4} md={2} sm={2}>
            <TextInput
              id="ageGroup"
              labelText={t('patientAgeGroup', 'Grupo Etario del Paciente')}
              value={ageGroup ? ageGroup.name : t('unknownAgeGroup', 'No determinado')}
              readOnly
              helperText={
                ageGroup
                  ? t('ageGroupInfo', 'Edad actual: {{age}} | Formularios disponibles: {{count}}', {
                      age: formattedAge,
                      count: availableForms.length,
                    })
                  : t('ageGroupHelper', '* Grupo etario basado en la edad del paciente')
              }
            />
          </Column>
          <Tooltip
            align="top"
            label={
              <div className={styles.ageGroupTooltipInfo}>
                <p className={styles.tooltipTitle}>{t('ageGroupsInfo', 'Información de Grupos Etarios CRED:')}</p>
                <ul className={styles.ageGroupsList}>
                  <li>{t('recienNacido', 'Recién Nacido: 0-28 días')}</li>
                  <li>{t('lactanteMenor', 'Lactante Menor: 29 días - 11 meses')}</li>
                  <li>{t('lactanteMayor', 'Lactante Mayor: 12-23 meses')}</li>
                  <li>{t('preescolar', 'Preescolar: 2-4 años')}</li>
                  <li>{t('escolar', 'Escolar: 5-11 años')}</li>
                </ul>
              </div>
            }
          >
            <button className={styles.tooltipButton} type="button">
              <InformationIcon className={styles.icon} size={20} />
            </button>
          </Tooltip>
        </div>

        <div className={styles.formsSection}>
          {/* Debug info */}
          <div style={{ margin: '1rem 0', padding: '1rem', background: '#f4f4f4', borderRadius: '4px' }}>
            <h4>Debug Info:</h4>
            <p>Total forms available: {availableForms?.length || 0}</p>
            <p>Config loaded: {config ? 'Yes' : 'No'}</p>
            <p>First form UUID: {availableForms?.[0]?.form?.uuid}</p>
            <p>Patient age: {formattedAge}</p>
          </div>

          <FormsList
            completedForms={availableForms}
            handleFormOpen={handleFormOpen}
            sectionName={t('allowedForms', 'Formularios Disponibles')}
          />
        </div>

        {encounters.length > 0 && (
          <Tile className={styles.recentControlsTile}>
            <h3 className={styles.sectionTitle}>{t('recentCredControls', 'Controles CRED Recientes')}</h3>
            <div className={styles.recentControlsList}>
              {encounters.slice(0, 3).map((encounter) => (
                <div key={encounter.uuid} className={styles.recentControlItem}>
                  <div className={styles.controlDate}>
                    {new Date(encounter.encounterDatetime).toLocaleDateString('es-PE')}
                  </div>
                  <div className={styles.controlLocation}>{encounter.location?.display}</div>
                </div>
              ))}
            </div>
          </Tile>
        )}

        {/* Error Notification */}
        {showErrorNotification && (
          <InlineNotification
            className={styles.errorNotification}
            lowContrast={false}
            onClose={() => setShowErrorNotification(false)}
            title={t('error', 'Error')}
            subtitle={t(
              'completeRequiredFields',
              'Por favor complete los campos requeridos (Fecha y Hora de atención).',
            )}
          />
        )}
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
          onClick={handleSubmit(saveConsultationData, onError)}
          disabled={isSubmitting}
          type="submit"
        >
          {t('submit', 'Guardar y Cerrar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default CREDControlsWorkspace;
