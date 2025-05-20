import React, { useMemo } from 'react';
import { Friendship, ReminderMedical } from '@carbon/react/icons';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import { useTranslation } from 'react-i18next';

interface WellChildControlProps {
  patient: fhir.Patient | null;
  patientUuid: string | null;
}

export const WellChildControl: React.FC<WellChildControlProps> = ({ patient, patientUuid }) => {
  const { t } = useTranslation();

  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: t('following', 'Seguimiento'),
        icon: Friendship,
        slotName: 'cred-following-slot',
      },
      {
        labelKey: t('credControls', 'Controles CRED'),
        icon: Friendship,
        slotName: 'cred-schedule-slot',
      },
      {
        labelKey: t('nonCredControls', 'Controles NO CRED'),
        icon: ReminderMedical,
        slotName: 'non-cred-control-slot',
      },
      {
        labelKey: t('additionalServices', 'Pediatría y Servicios Adicionales'),
        icon: ReminderMedical,
        slotName: 'additional-health-services-slot',
      },
    ],
    [
      t('following', 'Seguimiento'),
      t('credControls', 'Controles CRED'),
      t('nonCredControls', 'Controles NO CRED'),
      t('additionalServices', 'Pediatría y Servicios Adicionales'),
      t('wellChildCare', 'Control de Niño Sano'),
      t('wellChildCareTabs', 'Pestañas de Control de Niño Sano'),
    ],
  );

  if (!patient || !patientUuid) {
    return null;
  }

  return (
    <TabbedDashboard
      patient={patient}
      patientUuid={patientUuid}
      titleKey={t('wellChildCare', 'Control de Niño Sano')}
      tabs={tabs}
      ariaLabelKey="wellChildCareTabs"
    />
  );
};
