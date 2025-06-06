import { Button, ButtonSet, Column, Form, InlineNotification, TextInput, Tile, Tooltip } from '@carbon/react';
import { Information as InformationIcon } from '@carbon/react/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createErrorHandler,
  navigate,
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
  const {
    filterFormsByAge,
    formatAgeForDisplay,
    getAgeGroupFromBirthDate,
    FORM_UUID_MAPPING,
  } = require('../../utils/age-group-utils');

  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const session = useSession();
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const { encounters, isLoading: isEncountersLoading } = useCREDEncounters(patientUuid);
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
    return formatAgeForDisplay(patient.birthDate);
  }, [patient?.birthDate, formatAgeForDisplay]);

  // Available forms for CRED control - all possible forms
  const allAvailableForms: CompletedFormInfo[] = useMemo(
    () => [
      {
        form: {
          uuid: 'nutrition-evaluation-uuid',
          name: 'Evaluación de la alimentación',
          display: 'Evaluación de la alimentación',
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
          uuid: 'danger-signs-uuid',
          name: 'Signos de peligro',
          display: 'Signos de peligro',
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
          uuid: 'vif-screening-uuid',
          name: 'Ficha tamizaje VIF',
          display: 'Ficha tamizaje VIF',
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
          uuid: 'risk-factors-uuid',
          name: 'Factores de riesgo',
          display: 'Factores de riesgo',
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
          uuid: 'growth-development-uuid',
          name: 'Crecimiento y desarrollo',
          display: 'Crecimiento y desarrollo',
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
          uuid: 'immunization-schedule-uuid',
          name: 'Esquema de vacunación',
          display: 'Esquema de vacunación',
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
    [],
  );

  // Filter forms based on patient's age group
  const availableForms: CompletedFormInfo[] = useMemo(() => {
    if (!patient?.birthDate) return allAvailableForms;

    try {
      return filterFormsByAge(allAvailableForms, patient.birthDate);
    } catch (error) {
      console.warn('Error filtering forms by age:', error);
      return allAvailableForms;
    }
  }, [allAvailableForms, patient?.birthDate, filterFormsByAge]);

  // Handle form opening from table
  const handleFormOpen = useCallback(
    (form: FormType, encounterUuid: string) => {
      const consultationData = watch();

      // Validate required fields before navigation
      if (!consultationData.consultationDate || !consultationData.consultationTime) {
        setShowErrorNotification(true);
        return;
      }

      setSelectedForm(form.uuid);

      // Store consultation data in sessionStorage for the target form
      sessionStorage.setItem(
        'credConsultationData',
        JSON.stringify({
          ...consultationData,
          patientUuid,
          visitUuid: currentVisit?.uuid,
          selectedFormUuid: form.uuid,
        }),
      );

      // Map form UUIDs to routes
      const formRoutes: Record<string, string> = {
        'nutrition-evaluation-uuid': '/nutrition-evaluation-form',
        'danger-signs-uuid': '/danger-signs-form',
        'vif-screening-uuid': '/vif-screening-form',
        'risk-factors-uuid': '/risk-factors-form',
      };

      const route = formRoutes[form.uuid];
      if (route) {
        navigate({
          to: route,
        });
      }
    },
    [watch, patientUuid, currentVisit],
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
              helperText={t('lastControlHelper', '* Fecha del control CRED más reciente')}
            />
          </Column>
          <Column lg={4} md={2} sm={2}>
            <TextInput
              id="controlNumber"
              labelText={t('controlNumber', 'Número de control')}
              value={credControlNumber.toString()}
              readOnly
              helperText={t('controlNumberHelper', '* Calculado automáticamente según controles previos')}
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
