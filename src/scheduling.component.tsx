import React, { useState } from 'react';
import classNames from 'classnames';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { showToast, useLayoutType } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from './types';
import SearchByVaccines from './components/search-by-vaccines/search-by-vaccines.component';
import styles from './scheduling.style.scss';
import VaccinationScheduleTable from './components/vaccination-schedule-table/vaccinationScheduleTable.component';
import { SearchSchema } from './components/search-by-schemas/search-schema.component';

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

  const tabs: TabItem[] = [
    {
      name: t('concepts', 'Concepts'),
      component: <SearchByVaccines onSubmit={runSearch} />,
    },
    {
      name: t('schedule', 'Esquema de Vacunación'),
      component: <VaccinationScheduleTable />,
    },
  ];

  return (
    <div className={classNames('omrs-main-content', styles.mainContainer, styles.cohortBuilder)}>
      <div className={classNames(isLayoutTablet ? styles.tabletContainer : styles.desktopContainer)}>
        <p className={styles.title}>{t('schemaBuilder', 'Vaccination Schema Builder')}</p>
        <div className={styles.tabContainer}>
          <p className={styles.heading}>{t('searchVaccination', 'Search Vaccine')}</p>
          <div className={styles.tab}>
            <SearchSchema config={{ vaccinationProgramConceptSet: 'CIEL:162' }} onSchemaSelect={() => {}} />
            <SearchByVaccines onSubmit={runSearch} />
            <VaccinationScheduleTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationScheduleBuilder;
