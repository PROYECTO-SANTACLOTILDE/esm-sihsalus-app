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
    id: '0-2',
    name: '0 a 2 meses',
    minMonths: 0,
    maxMonths: 2,
    forms: ['CRED_0_2'],
  },
  {
    id: '3-5',
    name: '3 a 5 meses',
    minMonths: 3,
    maxMonths: 5,
    forms: ['CRED_3_5'],
  },
  {
    id: '6-11',
    name: '6 a 11 meses',
    minMonths: 6,
    maxMonths: 11,
    forms: ['CRED_6_11'],
  },
  {
    id: '12-23',
    name: '12 a 23 meses',
    minMonths: 12,
    maxMonths: 23,
    forms: ['CRED_12_23'],
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
