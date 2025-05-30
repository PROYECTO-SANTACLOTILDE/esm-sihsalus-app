import { makeUrl } from '@openmrs/esm-framework';
import type { PatientProgram } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';

/**
 * Evaluates a given expression using patient data and their program enrollments.
 * @param {string} expression - The expression to evaluate, which can reference patient data and enrollment names.
 * @param {fhir.Patient} patient - The patient's FHIR data object.
 * @param {Array<PatientProgram>} enrollments - An array of PatientProgram objects representing the patient's program enrollments.
 * @returns {boolean} - The result of the evaluated expression. Returns true if the expression is successfully evaluated, or if the expression or patient data is missing. Returns false if there's an error in evaluation.
 */

export const evaluateExpression = (
  expression: string,
  patient: fhir.Patient | null | undefined,
  enrollments: Array<PatientProgram> | null | undefined,
): boolean => {
  try {
    // If no expression is provided or patient is not loaded yet, don't block rendering
    if (!expression) {
      return true;
    }

    const enrollment = enrollments
      ? enrollments.flatMap((enrollment) => enrollment?.program?.['name']).filter(Boolean)
      : [];
    const programUuids = enrollments
      ? enrollments.flatMap((enrollment) => enrollment?.program?.['uuid']).filter(Boolean)
      : [];

    // Handle missing patient data gracefully
    const ageData = patient?.birthDate
      ? calculateAge(new Date(patient.birthDate))
      : { age: 0, ageInDays: 0, ageInMonths: 0, ageInYears: 0 };

    // Ensure we have a valid patient object before evaluating patient-dependent expressions
    if (expression.includes('patient') && !patient) {
      return false;
    }

    return new Function('patient', 'enrollment', 'programUuids', `return ${expression}`)(
      patient ?? {},
      enrollment,
      programUuids,
    );
  } catch (error) {
    console.error(`Error evaluating expression "${expression}" with patient ID ${patient?.id}:`, error);
    return false;
  }
};

/**
 * Calculates the age in years, months, and days from a given date of birth.
 * @param {Date} dob - The date of birth to calculate age from.
 * @returns {Object} An object containing age in years (`ageInYears`), months (`ageInMonths`), and days (`ageInDays`), as well as a general `age` property representing age in complete years.
 */
function calculateAge(dob: Date) {
  const today = new Date();
  const birthDate = new Date(dob);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }

  const totalMonths = years * 12 + months;
  const oneDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.round(Math.abs((today.getTime() - birthDate.getTime()) / oneDay));

  return { ageInYears: years, ageInMonths: totalMonths, ageInDays: totalDays, age: years };
}

export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
}

export function extractNameString(formattedString: string): string {
  if (!formattedString) {
    return '';
  }
  const parts = formattedString.split(' - ');
  return parts.length > 1 ? parts[1] : '';
}

export const formatPatientName = (patient): string => {
  if (!patient || !patient.name || patient.name.length === 0) {
    return '';
  }

  const nameObj = patient.name[0];
  const givenNames = nameObj.given ? nameObj.given.join(' ') : '';
  const familyName = nameObj.family || '';

  return `${givenNames} ${familyName}`.trim();
};

export const uppercaseText = (text): string => {
  return text.toUpperCase();
};

export function makeUrlUrl(path: string) {
  return new URL(makeUrl(path), window.location.toString());
}

/**
 * Formats a given date string into "DD-MMM-YYYY, hh:mm A" format.
 *
 * @param {string | Date | undefined} date - The date to format.
 * @returns {string} - The formatted date or an empty string if no date is provided.
 */
export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format('DD-MMM-YYYY, hh:mm A');
};

/**
 * Calculates the number of days from the given date to today.
 *
 * @param startDate - The starting date in string or Date format.
 * @returns The number of days from the start date to today.
 */
export function convertDateToDays(startDate: string | Date): number {
  const today = dayjs();
  const start = dayjs(startDate);
  return today.diff(start, 'day');
}
