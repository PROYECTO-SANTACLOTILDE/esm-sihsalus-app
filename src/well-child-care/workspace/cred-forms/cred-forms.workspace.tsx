import { Button, ButtonSet, Form, InlineNotification, Tile } from '@carbon/react';
import { age, ResponsiveWrapper, useConfig, useLayoutType, usePatient } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfigObject } from '../../../config-schema';
import { useLaunchCREDForm } from '../../../hooks/useLaunchCREDForm';
import styles from './cred-forms.scss';

const CREDFormsWorkspace: React.FC<DefaultPatientWorkspaceProps> = ({ patientUuid, closeWorkspace }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const config = useConfig<ConfigObject>();
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const { launchCREDForm, launchCREDFormByKey, launchNutritionEvaluation, launchEEDPForm } = useLaunchCREDForm();
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  // Calculate patient age information
  const patientAgeInfo = useMemo(() => {
    if (!patient?.birthDate) return null;

    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const formattedAge = age(patient.birthDate);

    return {
      ageInMonths,
      formattedAge,
      birthDate,
    };
  }, [patient?.birthDate]);

  // Determine age group and available forms
  const availableForms = useMemo(() => {
    if (!patientAgeInfo) return [];

    const { ageInMonths } = patientAgeInfo;
    const forms: Array<{
      category: string;
      forms: Array<{
        key: keyof ConfigObject['formsList'];
        name: string;
        description: string;
        recommended?: boolean;
      }>;
    }> = [];

    // Newborn forms (0-28 days)
    if (ageInMonths === 0) {
      forms.push({
        category: 'Recién Nacido (0-28 días)',
        forms: [
          {
            key: 'atencionImmediataNewborn',
            name: 'Atención Inmediata del Recién Nacido',
            description: 'Evaluación inmediata post-nacimiento',
            recommended: true,
          },
          {
            key: 'newbornNeuroEval',
            name: 'Evaluación Céfalo-Caudal y Neurológico',
            description: 'Evaluación neurológica del recién nacido',
            recommended: true,
          },
          {
            key: 'breastfeedingObservation',
            name: 'Observación del Amamantamiento',
            description: 'Evaluación de lactancia materna',
          },
          {
            key: 'roomingIn',
            name: 'Alojamiento Conjunto',
            description: 'Seguimiento en alojamiento conjunto',
          },
        ],
      });
    }

    // Infant forms (1-11 months)
    if (ageInMonths >= 1 && ageInMonths <= 11) {
      forms.push({
        category: 'Lactante (1-11 meses)',
        forms: [
          {
            key: 'childFeeding0to5',
            name: 'Evaluación de Alimentación (0-5 meses)',
            description: 'Evaluación nutricional para lactantes menores',
            recommended: ageInMonths <= 5,
          },
          {
            key: 'childFeeding6to42',
            name: 'Evaluación de Alimentación (6-42 meses)',
            description: 'Evaluación nutricional para lactantes mayores',
            recommended: ageInMonths >= 6,
          },
          {
            key: 'riskInterview0to30',
            name: 'Entrevista de Factores de Riesgo',
            description: 'Identificación de factores de riesgo',
            recommended: true,
          },
        ],
      });
    }

    // EEDP forms based on age
    const eedpForms = [];
    if (ageInMonths >= 2 && ageInMonths <= 3) {
      eedpForms.push({
        key: 'eedp2Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 2 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 4 && ageInMonths <= 6) {
      eedpForms.push({
        key: 'eedp5Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 5 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 7 && ageInMonths <= 10) {
      eedpForms.push({
        key: 'eedp8Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 8 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 11 && ageInMonths <= 14) {
      eedpForms.push({
        key: 'eedp12Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 12 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 15 && ageInMonths <= 17) {
      eedpForms.push({
        key: 'eedp15Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 15 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 18 && ageInMonths <= 20) {
      eedpForms.push({
        key: 'eedp18Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 18 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths >= 21 && ageInMonths <= 24) {
      eedpForms.push({
        key: 'eedp21Months' as keyof ConfigObject['formsList'],
        name: 'EEDP - 21 meses',
        description: 'Evaluación del desarrollo psicomotor',
        recommended: true,
      });
    }
    if (ageInMonths > 24) {
      eedpForms.push({
        key: 'tepsi' as keyof ConfigObject['formsList'],
        name: 'TEPSI',
        description: 'Test de desarrollo psicomotor para preescolares',
        recommended: true,
      });
    }

    if (eedpForms.length > 0) {
      forms.push({
        category: 'Desarrollo Psicomotor',
        forms: eedpForms,
      });
    }

    // General forms available for all ages
    forms.push({
      category: 'Formularios Generales',
      forms: [
        {
          key: 'childAbuseScreening',
          name: 'Tamizaje de Violencia y Maltrato Infantil',
          description: 'Detección de signos de maltrato',
        },
        {
          key: 'nursingAssessment',
          name: 'Valoración de Enfermería',
          description: 'Evaluación completa de enfermería',
        },
        {
          key: 'medicalOrders',
          name: 'Órdenes Médicas',
          description: 'Prescripciones y órdenes médicas',
        },
        {
          key: 'medicalProgressNote',
          name: 'Nota de Evolución Médica',
          description: 'Seguimiento médico del paciente',
        },
      ],
    });

    return forms;
  }, [patientAgeInfo]);

  const handleFormLaunch = useCallback(
    (formKey: keyof ConfigObject['formsList']) => {
      if (!currentVisit) {
        setShowErrorNotification(true);
        return;
      }

      setShowErrorNotification(false);
      launchCREDFormByKey(formKey);
      closeWorkspace();
    },
    [currentVisit, launchCREDFormByKey, closeWorkspace],
  );

  const handleQuickLaunch = useCallback(
    (action: 'nutrition' | 'eedp') => {
      if (!currentVisit || !patientAgeInfo) {
        setShowErrorNotification(true);
        return;
      }

      setShowErrorNotification(false);

      if (action === 'nutrition') {
        launchNutritionEvaluation(patientAgeInfo.ageInMonths);
      } else if (action === 'eedp') {
        launchEEDPForm(patientAgeInfo.ageInMonths);
      }

      closeWorkspace();
    },
    [currentVisit, patientAgeInfo, launchNutritionEvaluation, launchEEDPForm, closeWorkspace],
  );

  if (isPatientLoading) {
    return (
      <ResponsiveWrapper>
        <div className={styles.loadingContainer}>{t('loading', 'Cargando...')}</div>
      </ResponsiveWrapper>
    );
  }

  if (!patientAgeInfo) {
    return (
      <ResponsiveWrapper>
        <Tile className={styles.errorTile}>
          <p>{t('patientAgeError', 'No se pudo determinar la edad del paciente.')}</p>
        </Tile>
      </ResponsiveWrapper>
    );
  }

  return (
    <Form className={styles.form}>
      <div className={styles.container}>
        {/* Patient Information */}
        <Tile className={styles.patientInfoTile}>
          <h3 className={styles.sectionTitle}>{t('patientInformation', 'Información del Paciente')}</h3>
          <div className={styles.patientInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>{t('age', 'Edad')}:</span>
              <span className={styles.value}>{patientAgeInfo.formattedAge}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>{t('ageInMonths', 'Edad en meses')}:</span>
              <span className={styles.value}>{patientAgeInfo.ageInMonths} meses</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>{t('currentVisit', 'Visita actual')}:</span>
              <span className={styles.value}>
                {currentVisit ? t('visitActive', 'Activa') : t('noVisit', 'Sin visita activa')}
              </span>
            </div>
          </div>
        </Tile>

        {/* Quick Actions */}
        <Tile className={styles.quickActionsTile}>
          <h3 className={styles.sectionTitle}>{t('quickActions', 'Acciones Rápidas')}</h3>
          <div className={styles.quickActions}>
            <Button kind="tertiary" size="sm" onClick={() => handleQuickLaunch('nutrition')} disabled={!currentVisit}>
              {t('nutritionEvaluation', 'Evaluación Nutricional')}
            </Button>
            <Button
              kind="tertiary"
              size="sm"
              onClick={() => handleQuickLaunch('eedp')}
              disabled={!currentVisit || patientAgeInfo.ageInMonths < 2}
            >
              {t('developmentEvaluation', 'Evaluación del Desarrollo')}
            </Button>
          </div>
        </Tile>

        {/* Available Forms by Category */}
        {availableForms.map((category) => (
          <Tile key={category.category} className={styles.categoryTile}>
            <h3 className={styles.sectionTitle}>{category.category}</h3>
            <div className={styles.formsGrid}>
              {category.forms.map((form) => (
                <div key={form.key} className={`${styles.formCard} ${form.recommended ? styles.recommended : ''}`}>
                  <div className={styles.formHeader}>
                    <h4 className={styles.formName}>{form.name}</h4>
                    {form.recommended && (
                      <span className={styles.recommendedBadge}>{t('recommended', 'Recomendado')}</span>
                    )}
                  </div>
                  <p className={styles.formDescription}>{form.description}</p>
                  <Button
                    kind="primary"
                    size="sm"
                    onClick={() => handleFormLaunch(form.key)}
                    disabled={!currentVisit}
                    className={styles.launchButton}
                  >
                    {t('openForm', 'Abrir Formulario')}
                  </Button>
                </div>
              ))}
            </div>
          </Tile>
        ))}

        {/* Error Notification */}
        {showErrorNotification && (
          <InlineNotification
            className={styles.errorNotification}
            lowContrast={false}
            onClose={() => setShowErrorNotification(false)}
            title={t('error', 'Error')}
            subtitle={t(
              'noActiveVisit',
              'No hay una visita activa. Por favor, inicie una visita para acceder a los formularios.',
            )}
          />
        )}
      </div>

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('close', 'Cerrar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default CREDFormsWorkspace;
