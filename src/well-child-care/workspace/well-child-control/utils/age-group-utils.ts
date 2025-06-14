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
  // (tu definición original de los grupos, no se repite aquí por brevedad)
  // ...
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
