import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface NeonatalCareProps {
  patient: fhir.Patient | null;
  patientUuid: string | null;
}

export const NeonatalCare: React.FC<NeonatalCareProps> = ({ patient, patientUuid }) => {
  const { t } = useTranslation();

  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: t('newbornVitals', 'Signos Vitales del Recién Nacido'),
        icon: Activity,
        slotName: 'neonatal-vitals-slot',
      },
      {
        labelKey: t('perinatalRecord', 'Registro Perinatal'),
        icon: UserFollow,
        slotName: 'neonatal-perinatal-slot',
      },
      {
        labelKey: t('immediateAttention', 'Atención Inmediata'),
        icon: CloudMonitoring,
        slotName: 'neonatal-attention-slot',
      },
      {
        labelKey: t('cephalocaudalEvaluation', 'Evaluación Cefalocaudal'),
        icon: Stethoscope,
        slotName: 'neonatal-evaluation-slot',
      },
      {
        labelKey: t('breastfeedingCounseling', 'Consejeria de Lactancia Materna'),
        icon: WatsonHealthCobbAngle,
        slotName: 'neonatal-counseling-slot',
      },
    ],
    [
      t('newbornVitals', 'Signos Vitales del Recién Nacido'),
      t('perinatalRecord', 'Registro Perinatal'),
      t('immediateAttention', 'Atención Inmediata'),
      t('cephalocaudalEvaluation', 'Evaluación Cefalocaudal'),
      t('breastfeedingCounseling', 'Consejeria de Lactancia Materna'),
      t('neonatalCare', 'Historia Neonatal'),
      t('neonatalCareTabs', 'Pestañas de Atención Neonatal'),
    ],
  );

  if (!patient || !patientUuid) {
    return null;
  }

  return (
    <TabbedDashboard
      patient={patient}
      patientUuid={patientUuid}
      titleKey={t('neonatalCare', 'Historia Neonatal')}
      tabs={tabs}
      ariaLabelKey={t('neonatalCareTabs', 'Pestañas de Atención Neonatal')}
    />
  );
};
