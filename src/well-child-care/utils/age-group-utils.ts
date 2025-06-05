import dayjs from 'dayjs';

export interface AgeGroup {
  id: string;
  name: string;
  minMonths: number;
  maxMonths: number;
  forms: string[];
}

// Definición de grupos etarios CRED según las normas del MINSA
export const CRED_AGE_GROUPS: AgeGroup[] = [
  {
    id: 'rn',
    name: 'Recién Nacido (0-28 días)',
    minMonths: 0,
    maxMonths: 0.93, // ~28 días
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'newborn-screening-uuid',
      'breastfeeding-counseling-uuid',
    ],
  },
  {
    id: '2m',
    name: '2 meses',
    minMonths: 1,
    maxMonths: 2.5,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
    ],
  },
  {
    id: '4m',
    name: '4 meses',
    minMonths: 2.5,
    maxMonths: 5,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'complementary-feeding-uuid',
    ],
  },
  {
    id: '6m',
    name: '6 meses',
    minMonths: 5,
    maxMonths: 8,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'complementary-feeding-uuid',
      'anemia-screening-uuid',
    ],
  },
  {
    id: '9m',
    name: '9 meses',
    minMonths: 8,
    maxMonths: 11,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'parasitosis-screening-uuid',
    ],
  },
  {
    id: '12m',
    name: '12 meses (1 año)',
    minMonths: 11,
    maxMonths: 15,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'parasitosis-screening-uuid',
      'dental-health-uuid',
    ],
  },
  {
    id: '15m',
    name: '15 meses',
    minMonths: 15,
    maxMonths: 18,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
    ],
  },
  {
    id: '18m',
    name: '18 meses',
    minMonths: 18,
    maxMonths: 24,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
    ],
  },
  {
    id: '24m',
    name: '2 años',
    minMonths: 24,
    maxMonths: 30,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
      'social-skills-uuid',
    ],
  },
  {
    id: '30m',
    name: '30 meses',
    minMonths: 30,
    maxMonths: 36,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
      'social-skills-uuid',
      'risk-factors-uuid',
    ],
  },
  {
    id: '36m',
    name: '3 años',
    minMonths: 36,
    maxMonths: 48,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
      'social-skills-uuid',
      'risk-factors-uuid',
      'school-readiness-uuid',
    ],
  },
  {
    id: '48m',
    name: '4 años',
    minMonths: 48,
    maxMonths: 60,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
      'social-skills-uuid',
      'risk-factors-uuid',
      'school-readiness-uuid',
      'vision-hearing-screening-uuid',
    ],
  },
  {
    id: '60m',
    name: '5 años',
    minMonths: 60,
    maxMonths: Infinity,
    forms: [
      'nutrition-evaluation-uuid',
      'danger-signs-uuid',
      'vif-screening-uuid',
      'growth-development-uuid',
      'immunization-schedule-uuid',
      'anemia-screening-uuid',
      'dental-health-uuid',
      'psychomotor-development-uuid',
      'language-development-uuid',
      'social-skills-uuid',
      'risk-factors-uuid',
      'school-readiness-uuid',
      'vision-hearing-screening-uuid',
      'academic-skills-uuid',
    ],
  },
];

/**
 * Calcula la edad en meses basada en la fecha de nacimiento
 */
export function calculateAgeInMonths(birthDate: string | Date): number {
  if (!birthDate) return 0;

  const birth = dayjs(birthDate);
  const now = dayjs();

  if (!birth.isValid()) return 0;

  return now.diff(birth, 'month', true);
}

/**
 * Determina el grupo etario basado en la edad en meses
 */
export function getAgeGroup(ageInMonths: number): AgeGroup | null {
  return CRED_AGE_GROUPS.find((group) => ageInMonths >= group.minMonths && ageInMonths < group.maxMonths) || null;
}

/**
 * Obtiene el grupo etario basado en la fecha de nacimiento
 */
export function getAgeGroupFromBirthDate(birthDate: string | Date): AgeGroup | null {
  const ageInMonths = calculateAgeInMonths(birthDate);
  return getAgeGroup(ageInMonths);
}

/**
 * Obtiene los formularios correspondientes al grupo etario
 */
export function getFormsForAgeGroup(ageGroup: AgeGroup | null): string[] {
  return ageGroup ? ageGroup.forms : [];
}

/**
 * Filtra formularios basándose en el grupo etario del paciente
 */
export function filterFormsByAge(allForms: any[], birthDate: string | Date): any[] {
  const ageGroup = getAgeGroupFromBirthDate(birthDate);

  if (!ageGroup) {
    return allForms; // Si no se puede determinar la edad, mostrar todos
  }

  const allowedFormUuids = ageGroup.forms;

  return allForms.filter((formInfo) => allowedFormUuids.includes(formInfo.form.uuid));
}

/**
 * Formatea la edad para mostrar en la interfaz
 */
export function formatAgeForDisplay(birthDate: string | Date): string {
  if (!birthDate) return '';

  const birth = dayjs(birthDate);
  const now = dayjs();

  if (!birth.isValid()) return '';

  const ageInMonths = now.diff(birth, 'month');
  const ageInYears = now.diff(birth, 'year');
  const remainingMonths = ageInMonths % 12;

  if (ageInYears === 0) {
    if (ageInMonths === 0) {
      const ageInDays = now.diff(birth, 'day');
      return `${ageInDays} días`;
    }
    return `${ageInMonths} meses`;
  } else if (ageInYears === 1 && remainingMonths === 0) {
    return '1 año';
  } else if (remainingMonths === 0) {
    return `${ageInYears} años`;
  } else {
    return `${ageInYears} año${ageInYears > 1 ? 's' : ''} ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
  }
}

/**
 * Mapeo de UUIDs de formularios reales a nombres descriptivos
 * Esto debe actualizarse con los UUIDs reales del sistema
 */
export const FORM_UUID_MAPPING: Record<string, string> = {
  'nutrition-evaluation-uuid': 'Evaluación de la alimentación',
  'danger-signs-uuid': 'Signos de peligro',
  'vif-screening-uuid': 'Ficha tamizaje VIF',
  'risk-factors-uuid': 'Factores de riesgo',
  'growth-development-uuid': 'Crecimiento y desarrollo',
  'immunization-schedule-uuid': 'Esquema de vacunación',
  'newborn-screening-uuid': 'Tamizaje neonatal',
  'breastfeeding-counseling-uuid': 'Consejería en lactancia materna',
  'complementary-feeding-uuid': 'Alimentación complementaria',
  'anemia-screening-uuid': 'Tamizaje de anemia',
  'parasitosis-screening-uuid': 'Tamizaje de parasitosis',
  'dental-health-uuid': 'Salud bucal',
  'psychomotor-development-uuid': 'Desarrollo psicomotor',
  'language-development-uuid': 'Desarrollo del lenguaje',
  'social-skills-uuid': 'Habilidades sociales',
  'school-readiness-uuid': 'Preparación escolar',
  'vision-hearing-screening-uuid': 'Tamizaje de visión y audición',
  'academic-skills-uuid': 'Habilidades académicas',
};
