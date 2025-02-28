export const childImmunizationScheduleDashboardMeta = {
  icon: 'child-immunization-schedule',
  slot: 'patient-chart-child-immunization-schedule-slot',
  columns: 1,
  title: 'Child Immunization Schedule',
  path: 'child-immunization-schedule-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-peruhce-app',
  config: {},
};

export const neonatalCareDashboardMeta = {
  icon: 'neonatal-care',
  slot: 'patient-chart-neonatal-care-slot',
  columns: 1,
  title: 'Neonatal Care',
  path: 'neonatal-care-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-peruhce-app',
  config: {},
};

export const wellChildControlDashboardMeta = {
  icon: 'well-child-care',
  slot: 'patient-chart-well-child-care-slot',
  columns: 1,
  title: 'Well Child Care',
  path: 'well-child-care-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-peruhce-app',
  config: {},
};

export const wellChildCareNavGroup = {
  title: 'Control de Niño Sano',
  slotName: 'well-child-care-slot',
  isExpanded: false,
  showWhenExpression: 'enrollment.includes("Control de Niño Sano")',
};
