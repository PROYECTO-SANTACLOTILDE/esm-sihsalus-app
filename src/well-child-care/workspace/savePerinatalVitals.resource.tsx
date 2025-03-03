import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { PerinatalRegisterFormType } from './perinatal-register-form.workspace'; // Adjust the import path as needed

export async function savePerinatalVitals(
  encounterTypeUuid: string,
  data: PerinatalRegisterFormType,
  patientUuid: string,
  abortController: AbortController,
  locationUuid: string,
) {
  const url = `${restBaseUrl}/ws/rest/v1/encounter`;

  const payload = {
    patient: patientUuid,
    encounterType: encounterTypeUuid,
    location: locationUuid,
    obs: [] as Array<{
      concept: string;
      value: string | number | Date | Array<string>;
    }>,
  };

  // Map perinatal data to OpenMRS observations
  if (data.relationshipStatus) {
    payload.obs.push({
      concept: 'RELATIONSHIP_STATUS_CONCEPT_UUID', // Replace with actual concept UUID for relationship status
      value: data.relationshipStatus,
    });
  }

  if (data.motherMedicalHistory?.length) {
    data.motherMedicalHistory.forEach((condition) => {
      payload.obs.push({
        concept: 'MOTHER_MEDICAL_HISTORY_CONCEPT_UUID', // Replace with actual concept UUID for mother's medical history
        value: condition,
      });
    });
  }

  if (data.fatherMedicalHistory?.length) {
    data.fatherMedicalHistory.forEach((condition) => {
      payload.obs.push({
        concept: 'FATHER_MEDICAL_HISTORY_CONCEPT_UUID', // Replace with actual concept UUID for father's medical history
        value: condition,
      });
    });
  }

  if (data.lastPregnancyDate) {
    payload.obs.push({
      concept: 'LAST_PREGNANCY_DATE_CONCEPT_UUID', // Replace with actual concept UUID for last pregnancy date
      value: data.lastPregnancyDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    });
  }

  if (data.lastPregnancyOutcome) {
    payload.obs.push({
      concept: 'LAST_PREGNANCY_OUTCOME_CONCEPT_UUID', // Replace with actual concept UUID for pregnancy outcome
      value: data.lastPregnancyOutcome,
    });
  }

  if (data.lastPregnancyComplications?.length) {
    data.lastPregnancyComplications.forEach((complication) => {
      payload.obs.push({
        concept: 'LAST_PREGNANCY_COMPLICATIONS_CONCEPT_UUID', // Replace with actual concept UUID for complications
        value: complication,
      });
    });
  }

  if (data.lastPregnancyBirthWeight) {
    payload.obs.push({
      concept: 'LAST_PREGNANCY_BIRTH_WEIGHT_CONCEPT_UUID', // Replace with actual concept UUID for birth weight
      value: data.lastPregnancyBirthWeight,
    });
  }

  if (data.lastPregnancyGestationalAge) {
    payload.obs.push({
      concept: 'LAST_PREGNANCY_GESTATIONAL_AGE_CONCEPT_UUID', // Replace with actual concept UUID for gestational age
      value: data.lastPregnancyGestationalAge,
    });
  }

  try {
    const response = await openmrsFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error('Failed to save perinatal data');
    }

    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}
