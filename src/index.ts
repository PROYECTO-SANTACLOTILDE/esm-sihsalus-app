/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import { getSyncLifecycle, getAsyncLifecycle, defineConfigSchema } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import GenericNavLinks from './nav-links/generic-nav-links.component';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { benefitsPackageDashboardMeta, dashboardMeta } from './dashboard.meta';

const moduleName = '@openmrs/esm-scheduling-app';

const options = {
  featureName: 'root-world',
  moduleName,
};

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/root`.
 */
export const schedulingBuilder = getAsyncLifecycle(() => import('./scheduling.component'), options);

/**
 * The following are named exports for the extensions defined in this frontend modules. See the `routes.json` file to see how these are used.
 */
export const schedulingAdminPageCardLink = getAsyncLifecycle(() => import('./scheduling-admin-link.component'), options);

export const clinicalViewPatientDashboard  = getAsyncLifecycle(() => import('./component/clinical-view-section.component'), options);

//export const genericNavLinks = getSyncLifecycle(() => import('./nav-links/generic-nav-links.component'), options);

export const genericNavLinks = getSyncLifecycle(GenericNavLinks, options);

export const billingDashboardLink = getSyncLifecycle(
  createDashboardGroup({
    title: 'Billing',
    slotName: 'billing-dashboard-link-slot',
    isExpanded: false,
  }),
  options,
);

export const benefitsPackageDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...benefitsPackageDashboardMeta,
    moduleName,
  }),
  options,
);

//= getSyncLifecycle(ClinicalViewSection, options);
