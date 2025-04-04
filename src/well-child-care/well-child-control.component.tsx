import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Friendship, ReminderMedical } from '@carbon/react/icons';
import { usePatient, useVisit } from '@openmrs/esm-framework';
import TabbedDashboard, { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

const WellChildControl: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit, isLoading: isVisitLoading } = useVisit(patientUuid);
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const pageSize = 10;

  // Memoize patient age in months
  const patientAgeInMonths = useMemo(() => {
    if (!patient?.birthDate) return null;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  }, [patient?.birthDate]);

  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'comprehensiveCareFollowUp',
        icon: Friendship,
        slotName: 'cred-schedule-slot',
      },
      {
        labelKey: 'nonCredControl',
        icon: ReminderMedical,
        slotName: 'non-cred-control-slot',
      },
      {
        labelKey: 'additionalHealthServices',
        icon: ReminderMedical,
        slotName: 'additional-health-services-slot',
      },
    ],
    [t],
  );

  if (isVisitLoading || isPatientLoading) {
    return (
      <div>
        <p>{t('loading', 'Cargando datos...')}</p>
      </div>
    );
  }

  return (
    <TabbedDashboard
      patientUuid={patientUuid}
      titleKey="postnatalCare"
      tabs={tabs}
      ariaLabelKey="wellChildCareTabs"
      pageSize={pageSize}
      state={{ patient, patientUuid, patientAgeInMonths, currentVisit }} // Pass additional state
    />
  );
};

export default WellChildControl;
