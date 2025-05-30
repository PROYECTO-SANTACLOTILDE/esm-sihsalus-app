import {
  Button,
  ButtonSet,
  Column,
  DatePicker,
  DatePickerInput,
  Form,
  InlineNotification,
  Row,
  Stack,
  TextInput,
  Tile,
} from '@carbon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createErrorHandler,
  navigate,
  openmrsFetch,
  PatientBannerPatientInfo,
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
import useSWR, { mutate } from 'swr';
import { z } from 'zod';
import type { ConfigObject } from '../../../config-schema';
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

interface CREDEncounter {
  uuid: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  encounterDatetime: string;
  patient: {
    uuid: string;
  };
  location: {
    uuid: string;
    display: string;
  };
  visit?: {
    uuid: string;
  };
  obs: Array<{
    uuid: string;
    concept: {
      uuid: string;
      display: string;
    };
    value: any;
  }>;
}

interface EncounterResponse {
  data: {
    results: Array<CREDEncounter>;
  };
}

// Custom hook for CRED encounters
const useCREDEncounters = (patientUuid: string) => {
  const customRepresentation = `custom:(uuid,encounterType:(uuid,display),encounterDatetime,patient:(uuid),location:(uuid,display),visit:(uuid),obs:(uuid,concept:(uuid,display),value))`;

  const { data, error, isLoading, isValidating } = useSWR<EncounterResponse>(
    patientUuid
      ? `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=CRED_ENCOUNTER_TYPE_UUID&v=${customRepresentation}`
      : null,
    openmrsFetch,
  );

  const sortedEncounters = useMemo(() => {
    const encounters = data?.data.results ?? [];
    return encounters.sort((a, b) => {
      return new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime();
    });
  }, [data?.data?.results]);

  return {
    encounters: sortedEncounters,
    error,
    isLoading,
    isValidating,
  };
};

const CREDControlsWorkspace: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
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

  // Calculate patient age
  const patientAge = useMemo(() => {
    if (!patient?.birthDate) return '';
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 12) {
      return `${totalMonths} ${totalMonths === 1 ? 'mes' : 'meses'}`;
    } else {
      const yearsOnly = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      if (remainingMonths === 0) {
        return `${yearsOnly} ${yearsOnly === 1 ? 'año' : 'años'}`;
      } else {
        return `${yearsOnly} ${yearsOnly === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
      }
    }
  }, [patient]);

  // Available forms for CRED control
  const availableForms: CompletedFormInfo[] = useMemo(
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
    ],
    [],
  );

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
    setValue('attendedAge', patientAge);
  }, [setValue, patientAge]);

  if (isPatientLoading || isEncountersLoading) {
    return (
      <ResponsiveWrapper>
        <div className={styles.loadingContainer}>{t('loading', 'Cargando...')}</div>
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <div className={styles.container}>
        <Form className={styles.form} onSubmit={handleSubmit(saveConsultationData, onError)}>
          <Stack gap={6}>
            <div className={styles.headerSection}>
              <h2 className={styles.workspaceTitle}>
                {t('credControlsTitle', 'Control de Crecimiento y Desarrollo (CRED)')}
              </h2>
            </div>

            <PatientBannerPatientInfo patient={patient} />

            <Column>
              <DatePicker
                datePickerType="single"
                value={watch('consultationDate')}
                onChange={(dates) => setValue('consultationDate', dates[0])}
              >
                <DatePickerInput
                  id="consultationDate"
                  placeholder="dd/mm/yyyy"
                  labelText={t('consultationDate', 'Fecha atención') + ' *'}
                  invalid={!!errors.consultationDate}
                  invalidText={errors.consultationDate?.message}
                />
              </DatePicker>
              <TextInput
                id="consultationTime"
                labelText={t('consultationTime', 'Hora atención') + ' *'}
                type="time"
                invalid={!!errors.consultationTime}
                invalidText={errors.consultationTime?.message}
                {...register('consultationTime')}
              />
            </Column>

            <Row className={styles.inputRow}>
              <Column lg={8} md={4} sm={4}>
                <TextInput
                  id="controlNumber"
                  labelText={t('controlNumber', 'Número de control CRED')}
                  placeholder={t('enterControlNumber', 'Ingrese número de control')}
                  {...register('controlNumber')}
                />
              </Column>
              <Column lg={8} md={4} sm={4}>
                <TextInput
                  id="attendedAge"
                  labelText={t('attendedAge', 'Edad atención') + ' *'}
                  value={patientAge}
                  readOnly
                  {...register('attendedAge')}
                />
              </Column>
            </Row>

            <div className={styles.formsSection}>
              <FormsList
                completedForms={availableForms}
                handleFormOpen={handleFormOpen}
                sectionName={t('credForms', 'Formularios CRED')}
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
          </Stack>

          {/* Action Buttons */}
          <ButtonSet className={styles.buttonSet}>
            <Button className={styles.button} kind="secondary" onClick={closeWorkspace} disabled={isSubmitting}>
              {t('cancel', 'Cancelar')}
            </Button>
            <Button className={styles.button} kind="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? t('saving', 'Guardando...') : t('saveAndContinue', 'Guardar y Continuar')}
            </Button>
          </ButtonSet>
        </Form>
      </div>
    </ResponsiveWrapper>
  );
};

export default CREDControlsWorkspace;
