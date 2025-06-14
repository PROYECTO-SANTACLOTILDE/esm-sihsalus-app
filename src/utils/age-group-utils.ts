// utils/age-group-utils.ts

import dayjs from 'dayjs';

export interface AgeGroup {
  id: string;
  name: string;
  minMonths: number;
  maxMonths: number;
  forms: string[];
}

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
 * Calcula la edad en días desde una fecha de nacimiento
 */
export function calculateAgeInDays(birthDate: string | Date): number {
  const birth = dayjs(birthDate);
  const now = dayjs();
  return now.diff(birth, 'day');
}

/**
 * Calcula la edad en meses desde una fecha de nacimiento
 */
export function calculateAgeInMonths(birthDate: string | Date): number {
  const birth = dayjs(birthDate);
  const now = dayjs();
  return now.diff(birth, 'month', true); // permite fracciones
}

/**
 * Devuelve el grupo etario que corresponde a una edad en meses
 */
export function getAgeGroup(ageInMonths: number): AgeGroup | null {
  return CRED_AGE_GROUPS.find((group) => ageInMonths >= group.minMonths && ageInMonths < group.maxMonths) || null;
}

/**
 * Devuelve el grupo etario que corresponde a una fecha de nacimiento
 */
export function getAgeGroupFromBirthDate(birthDate: string | Date): AgeGroup | null {
  const months = calculateAgeInMonths(birthDate);
  return getAgeGroup(months);
}
