import React, { useState } from 'react';
import classNames from 'classnames';
import { showToast, useLayoutType, restBaseUrl } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from './types';
import SearchByVaccines from './components/search-by-vaccines/search-by-vaccines.component';
import styles from './scheduling.style.scss';
import VaccinationScheduleTable from './components/vaccination-schedule-table/vaccinationScheduleTable.component';
import SearchBySchemas from './components/search-by-schemas/search-by-schemas.component';
import SearchButtonSet from './components/search-button-set/search-button-set';

interface TabItem {
  name: string;
  component: JSX.Element;
}

const VaccinationScheduleBuilder: React.FC = () => {
  const { t } = useTranslation();
  const isLayoutTablet = useLayoutType() === 'tablet';

  const runSearch = (searchParams: SearchParams, queryDescription: string): Promise<boolean> => {
    return new Promise((resolve) => {});
  };

  return (
    <div className={classNames('omrs-main-content', styles.mainContainer, styles.cohortBuilder)}>
      <div className={classNames(isLayoutTablet ? styles.tabletContainer : styles.desktopContainer)}>
        <p className={styles.title}>{t('schemaBuilder', 'Vaccination Schema Builder')}</p>
        <div className={styles.tabContainer}>
          <p className={styles.heading}>{t('searchVaccination', 'Search Vaccine')}</p>
          <div className={styles.tab}>
            <SearchBySchemas onSubmit={runSearch} />
            <SearchByVaccines onSubmit={runSearch} />
            <SearchButtonSet
              isLoading={false}
              onHandleSubmit={function (): void {
                throw new Error('Function not implemented.');
              }}
              onHandleReset={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
            <VaccinationScheduleTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationScheduleBuilder;
