import React, { useEffect } from 'react';
import styles from './program-management-section.scss';
import { useTranslation } from 'react-i18next';
import { Information } from '@carbon/react/icons';
import { Tooltip } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { type DashboardGroupExtensionProps } from './dashboard-group.component';
import { registerNavGroup } from '@openmrs/esm-patient-common-lib';

export const ProgramManagementSection: React.FC<DashboardGroupExtensionProps> = ({ title, basePath }) => {
  const slotName = 'program-management-section';
  const { t } = useTranslation();
  useEffect(() => {
    registerNavGroup(slotName);
  }, [slotName]);
  return (
    <>
      <div className={styles.container}>
        <span style={{ fontWeight: 'bold' }}>{t('programManagement', 'Programas Inscritos')}</span>
        <Tooltip
          align="top"
          label={t(
            'customViews',
            "In this section, you'll find custom clinical views tailored to patients' conditions and enrolled care programs.",
          )}
        >
          <button style={{ border: 'none' }} className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </div>
      <ExtensionSlot style={{ width: '100%', minWidth: '15rem' }} name={slotName ?? title} state={{ basePath }} />
    </>
  );
};

export default ProgramManagementSection;
