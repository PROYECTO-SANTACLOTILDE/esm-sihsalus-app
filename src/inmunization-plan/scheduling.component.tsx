import React, { useState } from 'react';
import classNames from 'classnames';
import { showToast, useLayoutType, restBaseUrl } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from '../types';
import styles from './scheduling.style.scss';
interface TabItem {
  name: string;
  component: JSX.Element;
}

const VaccinationScheduleBuilder: React.FC = () => {
  const { t } = useTranslation();
  const isLayoutTablet = useLayoutType() === 'tablet';

  const runSearch = (searchParams: SearchParams, queryDescription: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Implement the search logic here
      resolve(true);
    });
  };

  return (
    <div className={classNames('omrs-main-content', styles.mainContainer, styles.cohortBuilder)}>
      <div className={classNames(isLayoutTablet ? styles.tabletContainer : styles.desktopContainer)}>
        <p className={styles.title}>{t('schemaBuilder', 'Vaccination Schema Builder')}</p>
        <div className={styles.tabContainer}>
          <p className={styles.heading}>{t('searchVaccination', 'Search Vaccine')}</p>
          <div className={styles.tab}></div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationScheduleBuilder;
