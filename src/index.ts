/**
 * Entrypoint file of the application. It communicates the
 * key features of this microfrontend to the app shell.
 * It connects the app shell to the React applications that comprise this microfrontend.
 */
import { getSyncLifecycle, getAsyncLifecycle, defineConfigSchema } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import GenericNavLinks from './components/nav-links/generic-nav-links.component';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { wellChildControlsDashboardMeta } from './dashboard.meta';
import { createLeftPanelLink } from './left-panel-link.component';
import ActiveProgramSummary from './active-program-summary/active-program-summary.component';

const moduleName = '@openmrs/esm-scheduling-app';
const options = {
  featureName: 'root-world',
  moduleName,
};

/**
 * Define how translation files should be obtained.
 * The translations are JSON files located in `../translations` directory.
 */
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

/**
 * Initializes the microfrontend by defining the configuration schema.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * Async lifecycle methods for loading components when needed.
 */
export const schedulingBuilder = getAsyncLifecycle(() => import('./scheduling.component'), options);

export const schedulingAdminPageCardLink = getAsyncLifecycle(
  () => import('./scheduling-admin-link.component'),
  options
);



export const clinicalViewPatientDashboard = getAsyncLifecycle(
  () => import('./components/program-management/program-management-section.component'),
  options
);

/**
 * Sync lifecycle methods for components that should load immediately.
 */
export const wellChildControlsDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...wellChildControlsDashboardMeta,
    moduleName,
  }),
  options
);

export const activeProgram = getSyncLifecycle(ActiveProgramSummary, options);
