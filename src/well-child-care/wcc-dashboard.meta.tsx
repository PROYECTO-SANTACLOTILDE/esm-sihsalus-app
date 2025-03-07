export const neonatalCareDashboardMeta = {
  icon: 'omrs-icon-baby',
  slot: 'patient-chart-neonatal-care-slot',
  columns: 1,
  title: 'Historia Clínica Neonatal',
  path: 'neonatal-care-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-sihsalus-app',
  config: {},
};

export const wellChildControlDashboardMeta = {
  icon: 'omrs-icon-calendar-heat-map',
  slot: 'patient-chart-well-child-care-slot',
  columns: 1,
  title: 'Control de Niño Sano',
  path: 'well-child-care-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-sihsalus-app',
  config: {},
};

export const childImmunizationScheduleDashboardMeta = {
  icon: 'omrs-icon-syringe',
  slot: 'patient-chart-child-immunization-schedule-slot',
  columns: 1,
  title: 'Esquema de Vacunación Infantil',
  path: 'child-immunization-schedule-dashboard',
  moduleName: '@pucp-gidis-hiisc/esm-sihsalus-app',
  config: {},
};

export const wellChildCareNavGroup = {
  title: 'Curso de Vida del Niño',
  slotName: 'well-child-care-slot',
  isExpanded: false,
  showWhenExpression: 'enrollment.includes("Control de Niño Sano")',
};
