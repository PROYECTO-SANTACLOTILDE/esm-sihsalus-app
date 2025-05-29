import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR, { mutate } from 'swr';
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
import {
  createErrorHandler,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
  useSession,
  useVisit,
  navigate,
  openmrsFetch,
  restBaseUrl,
  getPatientName,
} from '@openmrs/esm-framework';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import type { ConfigObject } from '../../../config-schema';
import styles from './well-child-controls-form.scss';

// Validation schema with zod
const CREDControlsSchema = z.object({
  consultationDate: z.date({
    required_error: 'Fecha de atención es requerida',
  }),
  consultationTime: z.string().min(1, 'Hora de atención es requerida'),
  controlNumber: z.string().optional(),
  attendedAge: z.string().optional(),
});

export type CREDControlsFormType = z.infer<typeof CREDControlsSchema>;

interface FormButton {
  id: string;
  label: string;
  route: string;
  description?: string;
}

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
  const { currentVisit } = useVisit(patientUuid);
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

  // Form navigation buttons
  const formButtons: FormButton[] = [
    {
      id: 'nutrition-evaluation',
      label: 'Evaluación de la alimentación',
      route: '/nutrition-evaluation-form',
      description: 'Evaluación nutricional y alimentaria',
    },
    {
      id: 'danger-signs',
      label: 'Signos de peligro',
      route: '/danger-signs-form',
      description: 'Identificación de signos de alarma',
    },
    {
      id: 'vif-screening',
      label: 'Ficha tamizaje VIF',
      route: '/vif-screening-form',
      description: 'Tamizaje de violencia intrafamiliar',
    },
    {
      id: 'risk-factors',
      label: 'Factores de riesgo',
      route: '/risk-factors-form',
      description: 'Evaluación de factores de riesgo',
    },
  ];

  // Navigate to specific form
  const handleFormNavigation = useCallback(
    (formRoute: string, formId: string) => {
      const consultationData = watch();

      // Validate required fields before navigation
      if (!consultationData.consultationDate || !consultationData.consultationTime) {
        setShowErrorNotification(true);
        return;
      }

      setSelectedForm(formId);

      // Store consultation data in sessionStorage for the target form
      sessionStorage.setItem(
        'credConsultationData',
        JSON.stringify({
          ...consultationData,
          patientUuid,
          visitUuid: currentVisit?.uuid,
        }),
      );

      // Navigate to specific form
      navigate({
        to: formRoute,
      });
    },
    [watch, patientUuid, currentVisit],
  );

  // Save consultation base data
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
    return <div>{t('loading', 'Cargando...')}</div>;
  }

  return (
    <Form className={styles.form} onSubmit={handleSubmit(saveConsultationData, onError)}>
      <div className={styles.grid}>
        <Stack gap={4}>
          {/* Header */}
          <Column>
            <div className={styles.header}>
              <h2 className={styles.title}>Consulta</h2>
              <p className={styles.subtitle}>Control de Crecimiento y Desarrollo (CRED)</p>
            </div>
          </Column>

          {/* Basic Information */}
          <Row className={styles.row}>
            <Column lg={6} md={4} sm={2}>
              <DatePicker
                datePickerType="single"
                value={watch('consultationDate')}
                onChange={(dates) => setValue('consultationDate', dates[0])}
              >
                <DatePickerInput
                  id="consultationDate"
                  placeholder="dd/mm/yyyy"
                  labelText="Fecha atención (*)"
                  invalid={!!errors.consultationDate}
                  invalidText={errors.consultationDate?.message}
                />
              </DatePicker>
            </Column>
            <Column lg={6} md={4} sm={2}>
              <TextInput
                id="consultationTime"
                labelText="Hora atención (*)"
                type="time"
                invalid={!!errors.consultationTime}
                invalidText={errors.consultationTime?.message}
                {...register('consultationTime')}
              />
            </Column>
          </Row>

          <Row className={styles.row}>
            <Column lg={6} md={4} sm={2}>
              <TextInput
                id="controlNumber"
                labelText="Número de control CRED"
                placeholder="Ingrese número de control"
                {...register('controlNumber')}
              />
            </Column>
            <Column lg={6} md={4} sm={2}>
              <TextInput
                id="attendedAge"
                labelText="Edad atención (*)"
                value={patientAge}
                readOnly
                {...register('attendedAge')}
              />
            </Column>
          </Row>

          {/* Form Navigation Buttons */}
          <Column>
            <div className={styles.formNavigation}>
              <h3 className={styles.sectionTitle}>Seleccione el formulario a completar:</h3>
              <div className={styles.buttonGrid}>
                {formButtons.map((formButton) => (
                  <Tile
                    key={formButton.id}
                    className={`${styles.formTile} ${selectedForm === formButton.id ? styles.selected : ''}`}
                    onClick={() => handleFormNavigation(formButton.route, formButton.id)}
                  >
                    <div className={styles.tileContent}>
                      <h4 className={styles.tileTitle}>{formButton.label}</h4>
                      {formButton.description && <p className={styles.tileDescription}>{formButton.description}</p>}
                    </div>
                  </Tile>
                ))}
              </div>
            </div>
          </Column>

          {/* Recent CRED Controls */}
          {encounters.length > 0 && (
            <Column>
              <Tile className={styles.recentControls}>
                <h4>Controles CRED Recientes</h4>
                <div className={styles.controlsList}>
                  {encounters.slice(0, 3).map((encounter) => (
                    <div key={encounter.uuid} className={styles.controlItem}>
                      <div className={styles.controlDate}>
                        {new Date(encounter.encounterDatetime).toLocaleDateString('es-PE')}
                      </div>
                      <div className={styles.controlLocation}>{encounter.location?.display}</div>
                    </div>
                  ))}
                </div>
              </Tile>
            </Column>
          )}

          {/* Patient Information Summary */}
          <Column>
            <Tile className={styles.patientSummary}>
              <h4>Información del Paciente</h4>
              <div className={styles.patientInfo}>
                <p>
                  <strong>Nombre:</strong> {getPatientName(patient) || 'N/A'}
                </p>
                <p>
                  <strong>Edad:</strong> {patientAge}
                </p>
                <p>
                  <strong>Fecha de Nacimiento:</strong>{' '}
                  {patient?.birthDate ? new Date(patient.birthDate).toLocaleDateString('es-PE') : 'N/A'}
                </p>
                <p>
                  <strong>Género:</strong>{' '}
                  {patient?.gender === 'M' ? 'Masculino' : patient?.gender === 'F' ? 'Femenino' : 'No especificado'}
                </p>
              </div>
            </Tile>
          </Column>
        </Stack>
      </div>

      {showErrorNotification && (
        <Column className={styles.errorContainer}>
          <InlineNotification
            className={styles.errorNotification}
            lowContrast={false}
            onClose={() => setShowErrorNotification(false)}
            title="Error"
            subtitle="Por favor complete los campos requeridos (Fecha y Hora de atención)."
          />
        </Column>
      )}

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          Cerrar
        </Button>
        <Button className={styles.button} kind="primary" disabled={isSubmitting} type="submit">
          Guardar y Continuar
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default CREDControlsWorkspace;
