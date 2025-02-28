import type { Visit } from '@openmrs/esm-framework';
import { launchPatientWorkspace, launchStartVisitPrompt } from '@openmrs/esm-patient-common-lib';

/**
 * Launches the appropriate workspace based on the current visit and configuration.
 * @param currentVisit - The current visit.
 * @param config - The configuration object.
 */
export function launchGenericForm(currentVisit: Visit, formName: string): void {
  if (!currentVisit) {
    launchStartVisitPrompt();
    return;
  }

  launchPatientWorkspace(formName);
}
