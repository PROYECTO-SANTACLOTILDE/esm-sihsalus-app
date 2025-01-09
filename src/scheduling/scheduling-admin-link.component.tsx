import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, ClickableTile } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';

const SchedulingAdminLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layer>
      <ClickableTile href={`${window.spaBase}/scheduling-builder`} target="_blank" rel="noopener noreferrer">
        <div>
          <div className="heading">{t('manageSchedule', 'Manage Schedule')}</div>
          <div className="content">{t('scheduleBuilder', 'Schedule Builder')}</div>
        </div>
        <div className="iconWrapper">
          <ArrowRight size={16} />
        </div>
      </ClickableTile>
    </Layer>
  );
};

export default SchedulingAdminLink;
