import React, { useState } from 'react';
import classNames from 'classnames';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { showToast, useLayoutType } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { getCohortMembers, getDataSet, search } from './cohort-builder.resources';
import { addToHistory } from './cohort-builder.utils';
import type { Patient, SearchParams } from './types';
import SearchByConcepts from './components/search-by-vaccines/search-by-vaccines.component';
import styles from './scheduling.scss';

interface TabItem {
  name: string;
  component: JSX.Element;
}

const CohortBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isHistoryUpdated, setIsHistoryUpdated] = useState(true);
  const isLayoutTablet = useLayoutType() === 'tablet';

  const runSearch = (searchParams: SearchParams, queryDescription: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setPatients([]);
      search(searchParams)
        .then(({ data: { rows } }) => {
          rows.map((patient: Patient) => {
            patient.id = patient.patientId.toString();
            patient.name = `${patient.firstname} ${patient.lastname}`;
          });
          setPatients(rows);
          addToHistory(queryDescription, rows, searchParams.query);
          showToast({
            title: t('success', 'Success!'),
            kind: 'success',
            critical: true,
            description: t('searchIsCompleted', `Search is completed with ${rows.length} result(s)`, {
              numOfResults: rows.length,
            }),
          });
          setIsHistoryUpdated(true);
          resolve(true);
        })
        .catch((error) => {
          showToast({
            title: t('error', 'Error'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
          resolve(true);
        });
    });
  };

  const tabs: TabItem[] = [
    {
      name: t('concepts', 'Concepts'),
      component: <SearchByConcepts onSubmit={runSearch} />,
    },
  ];

  return (
    <div className={classNames('omrs-main-content', styles.mainContainer, styles.cohortBuilder)}>
      <div className={classNames(isLayoutTablet ? styles.tabletContainer : styles.desktopContainer)}>
        <p className={styles.title}>{t('schemaBuilder', 'Vaccination Schema Builder')}</p>
        <div className={styles.tabContainer}>
          <p className={styles.heading}>{t('searchCriteria', 'Search Criteria')}</p>
          <div className={styles.tab}>
            <Tabs
              className={classNames(styles.verticalTabs, {
                [styles.tabletTab]: isLayoutTablet,
                [styles.desktopTab]: !isLayoutTablet,
              })}
            >
              <TabList aria-label="navigation">
                {tabs.map((tab: TabItem, index: number) => (
                  <Tab key={index}>{tab.name}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabs.map((tab: TabItem, index: number) => (
                  <TabPanel key={index}>{tab.component}</TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortBuilder;
