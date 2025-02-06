// 1. IMPORTS
import { defineConfigSchema, getSyncLifecycle, getAsyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { createLeftPanelLink } from './left-panel-link.component';
import { createDashboardGroup } from './clinical-view-group/createDashboardGroup';

import { configSchema } from './config-schema';
import { inPatientClinicalEncounterDashboardMeta } from './clinical-encounter/clinical-encounter-dashboard-meta';
import ClinicalEncounterDashboard from './clinical-encounter/dashboard/clinical-encounter-dashboard.component';
import ClinicalViewSection from './clinical-view-group/clinical-view-section.component';

import {
  caseEncounterDashboardMeta,
  caseManagementDashboardMeta,
  contactListDashboardMeta,
  familyHistoryDashboardMeta,
  otherRelationshipsDashboardMeta,
  peerCalendarDashboardMeta,
  relationshipsDashboardMeta,
} from './dashboard.meta';

import FamilyHistory from './family-partner-history/family-history.component';
import FamilyRelationshipForm from './family-partner-history/family-relationship.workspace';

import AntenatalCare from './maternal-and-child-health/antenatal-care.component';
import PostnatalCare from './maternal-and-child-health/postnatal-care.component';
import LabourDelivery from './maternal-and-child-health/labour-delivery.component';
import {
  antenatalDashboardMeta,
  labourAndDeliveryDashboardMeta,
  postnatalDashboardMeta,
  maternalAndChildHealthNavGroup,
} from './maternal-and-child-health/mch-dashboard.meta';

import NeonatalCare from './well-child-care/neonatal-care.component';
import WellChildCare from './well-child-care/well-child-care.component';
import ChildInmunizationSchedule from './well-child-care/child-inmunization-schedule.component';
import {
  neonatalCareDashboardMeta,
  wellChildCareDashboardMeta,
  childImmunizationScheduleDashboardMeta,
  wellChildCareNavGroup,
} from './well-child-care/wcc-dashboard.meta';

import GenericDashboard from './specialized-clinics/generic-nav-links/generic-dashboard.component';
import GenericNavLinks from './specialized-clinics/generic-nav-links/generic-nav-links.component';
import DefaulterTracing from './specialized-clinics/hiv-care-and-treatment-services/defaulter-tracing/defaulter-tracing.component';
import {
  defaulterTracingDashboardMeta,
  hivCareAndTreatmentNavGroup,
  htsDashboardMeta,
} from './specialized-clinics/hiv-care-and-treatment-services/hiv-care-and-treatment-dashboard.meta';
import HivTestingEncountersList from './specialized-clinics/hiv-care-and-treatment-services/hiv-testing-services/views/hiv-testing/hiv-testing-services.component';
import { specialClinicsNavGroup } from './specialized-clinics/special-clinic-dashboard.meta';

import WrapComponent from './case-management/wrap/wrap.component';
import CaseEncounterOverviewComponent from './case-management/encounters/case-encounter-overview.component';
import CaseManagementForm from './case-management/workspace/case-management.workspace';
import EndRelationshipWorkspace from './case-management/workspace/case-management-workspace.component';

import ContactList from './contact-list/contact-list.component';
import ContactListForm from './contact-list/contact-list.workspace';

import PeerCalendar from './peer-calendar/peer-calendar.component';
import PeerForm from './peer-calendar/forms/peer-form.workspace';
import FormEntryWorkspace from './peer-calendar/forms/form-entry.workspace';

import Relationships from './relationships/relationships.component';
import RelationshipUpdateForm from './relationships/forms/relationships-update-form.workspace';
import DeleteRelationshipConfirmDialog from './relationships/modals/delete-relationship-dialog.modal';
import BirthDateCalculator from './relationships/modals/birthdate-calculator.modal';
import { OtherRelationships } from './other-relationships/other-relationships.component';
import { OtherRelationshipsForm } from './other-relationships/other-relationships.workspace';

// Traducciones
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');


// 2. CONSTANTS
const moduleName = '@Duvet05/esm-scheduling-app';
const options = {
  featureName: 'patient-clinical-view-app',
  moduleName,
};


// 3. SPECIAL CLINICS NAVIGATION GROUP
export const specialClinicsSideNavGroup = getSyncLifecycle(createDashboardGroup(specialClinicsNavGroup), options);


// 4. CLINICAL ENCOUNTERS
export const inPatientClinicalEncounterLink = getSyncLifecycle(
  createDashboardLink({ ...inPatientClinicalEncounterDashboardMeta,moduleName}),
  options,
);
export const inPatientClinicalEncounter = getSyncLifecycle(ClinicalEncounterDashboard, options);
export const clinicalViewPatientDashboard = getSyncLifecycle(ClinicalViewSection, options);


// 5. HIV CARE & TREATMENT
export const hivCareAndTreatMentSideNavGroup = getSyncLifecycle(
  createDashboardGroup(hivCareAndTreatmentNavGroup),
  options,
);
export const defaulterTracingLink = getSyncLifecycle(createDashboardLink({ ...defaulterTracingDashboardMeta, moduleName }), options);
export const htsDashboardLink = getSyncLifecycle(createDashboardLink({ ...htsDashboardMeta, moduleName }), options);
export const htsClinicalView = getSyncLifecycle(HivTestingEncountersList, options);
export const defaulterTracing = getSyncLifecycle(DefaulterTracing, options);


// 6. FAMILY HISTORY
export const familyHistory = getSyncLifecycle(FamilyHistory, options);
export const familyHistoryLink = getSyncLifecycle(createDashboardLink({ ...familyHistoryDashboardMeta, moduleName }), options);
export const familyRelationshipForm = getSyncLifecycle(FamilyRelationshipForm, options);


// 7. OTHER RELATIONSHIPS
export const otherRelationships = getSyncLifecycle(OtherRelationships, options);
export const otherRelationshipsLink = getSyncLifecycle(createDashboardLink({ ...otherRelationshipsDashboardMeta, moduleName }), options);
export const otherRelationshipsForm = getSyncLifecycle(OtherRelationshipsForm, options);


// 8. RELATIONSHIPS
export const relationshipsLink = getSyncLifecycle(createDashboardLink({ ...relationshipsDashboardMeta, moduleName }), options);
export const relationships = getSyncLifecycle(Relationships, options);
export const relationshipUpdateForm = getSyncLifecycle(RelationshipUpdateForm, options);
export const relationshipDeleteConfirmialog = getSyncLifecycle(DeleteRelationshipConfirmDialog, options);


// 9. CONTACTS
export const contactList = getSyncLifecycle(ContactList, options);
export const contactListLink = getSyncLifecycle(createDashboardLink({ ...contactListDashboardMeta, moduleName }), options);
export const contactListForm = getSyncLifecycle(ContactListForm, options);
export const birthDateCalculator = getSyncLifecycle(BirthDateCalculator, options);


// 10. PEER CALENDAR
export const peerCalendar = getSyncLifecycle(PeerCalendar, options);
export const peerCalendarDashboardLink = getSyncLifecycle(createLeftPanelLink(peerCalendarDashboardMeta), options);
export const peersForm = getSyncLifecycle(PeerForm, options);
export const peerCalendarFormEntry = getSyncLifecycle(FormEntryWorkspace, options);


// 11. MATERNAL AND CHILD HEALTH
export const maternalAndChildHealthSideNavGroup = getSyncLifecycle(
  createDashboardGroup(maternalAndChildHealthNavGroup),
  options,
);
export const antenatalCare = getSyncLifecycle(AntenatalCare, options);
export const postnatalCare = getSyncLifecycle(PostnatalCare, options);
export const labourAndDelivery = getSyncLifecycle(LabourDelivery, options);
export const antenatalCareLink = getSyncLifecycle(createDashboardLink({ ...antenatalDashboardMeta, moduleName }), options);
export const postnatalCareLink = getSyncLifecycle(createDashboardLink({ ...postnatalDashboardMeta, moduleName }), options);
export const labourAndDeliveryLink = getSyncLifecycle(
  createDashboardLink({ ...labourAndDeliveryDashboardMeta, moduleName }),
  options,
);


// 12. CASE MANAGEMENT
export const caseManagementDashboardLink = getSyncLifecycle(createLeftPanelLink(caseManagementDashboardMeta), options);
export const wrapComponent = getSyncLifecycle(WrapComponent, options);
export const caseManagementForm = getSyncLifecycle(CaseManagementForm, options);
export const caseEncounterDashboardLink = getSyncLifecycle(createDashboardLink({ ...caseEncounterDashboardMeta, moduleName }), options);
export const caseEncounterTable = getSyncLifecycle(CaseEncounterOverviewComponent, options);
export const endRelationshipWorkspace = getSyncLifecycle(EndRelationshipWorkspace, options);


// 13. WELL CHILD CARE
export const wellChildCareSideNavGroup = getSyncLifecycle(createDashboardGroup(wellChildCareNavGroup), options);
export const neonatalCareLink = getSyncLifecycle(createDashboardLink(neonatalCareDashboardMeta), options);
export const wellChildCareLink = getSyncLifecycle(createDashboardLink(wellChildCareDashboardMeta), options);
export const childImmunizationScheduleLink = getSyncLifecycle(createDashboardLink(childImmunizationScheduleDashboardMeta), options);
export const neonatalCare = getSyncLifecycle(NeonatalCare, options);
export const wellChildCare = getSyncLifecycle(WellChildCare, options);
export const childImmunizationSchedule = getSyncLifecycle(ChildInmunizationSchedule, options);


// 14. SPECIALIZED CLINICS - GENERIC
export const genericNavLinks = getSyncLifecycle(GenericNavLinks, options);
export const genericDashboard = getSyncLifecycle(GenericDashboard, options);


// 15. ASYNC LINK (SCHEDULING ADMIN)
export const schedulingAdminPageCardLink = getAsyncLifecycle(() => import('./scheduling-admin-link.component'), options);


// 16. STARTUP APP
export function startupApp(): void {
  defineConfigSchema(moduleName, configSchema);
}
