export const antenatalDashboardMeta = {
  icon: 'antenatal-care',
  slot: 'patient-chart-antenatal-dashboard-slot',
  columns: 1,
  title: 'Antenatal Care',
  path: 'antenatal-care-dashboard',
  config: {},
};

export const postnatalDashboardMeta = {
  icon: 'postnatalDashboardMeta',
  slot: 'patient-chart-postnatal-dashboard-slot',
  columns: 1,
  title: 'Postnatal Care',
  path: 'postnatal-care-dashboard',
  config: {},
};

export const labourAndDeliveryDashboardMeta = {
  icon: 'labourAndDeliveryDashboardMeta',
  slot: 'patient-chart-labour-and-delivery-dashboard-slot',
  columns: 1,
  title: 'Labour & Delivery',
  path: 'labour-and-delivery-dashboard',
  config: {},
};

export const maternalAndChildHealthNavGroup = {
  title: 'Madre Gestante',
  slotName: 'maternal-and-child-health-slot',
  isExpanded: false,
  showWhenExpression:
    'patient.gender === "female" && (enrollment.includes("Madre Gestante") || enrollment.includes("Otras Estrategias Obstetricas"))',
};
