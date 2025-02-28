import type { Visit } from '@openmrs/esm-framework';
import { launchPatientWorkspace, launchStartVisitPrompt } from '@openmrs/esm-patient-common-lib';

export function launchNewbornVitalsAndBiometricsForm(currentVisit: Visit): void {
  if (!currentVisit) {
    launchStartVisitPrompt();
    return;
  }
  launchPatientWorkspace('patient-form-entry-workspace');
}
