import React from 'react';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component'; // Default import
import { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component'; // Named type import

const NeonatalCare: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const tabs: TabConfig[] = [
    {
      labelKey: 'vitalsNewborn',
      icon: Activity,
      slotName: 'neonatal-vitals-slot',
    },
    {
      labelKey: 'perinatal',
      icon: UserFollow,
      slotName: 'neonatal-perinatal-slot',
    },
    {
      labelKey: 'atencionInmediata',
      icon: CloudMonitoring,
      slotName: 'neonatal-attention-slot',
    },
    {
      labelKey: 'evaluacionInmediata',
      icon: Stethoscope,
      slotName: 'neonatal-evaluation-slot',
    },
    {
      labelKey: 'consejeriaLactancia',
      icon: WatsonHealthCobbAngle,
      slotName: 'neonatal-counseling-slot',
    },
  ];

  return (
    <TabbedDashboard patientUuid={patientUuid} titleKey="neonatalCare" tabs={tabs} ariaLabelKey="neonatalCareTabs" />
  );
};

export default NeonatalCare;
