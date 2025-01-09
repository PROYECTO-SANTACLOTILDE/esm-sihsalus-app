/**
 * From here, the application is pretty typical React, but with lots of
 * support from `@openmrs/esm-framework`. Check out `Greeter` to see
 * usage of the configuration system, and check out `PatientGetter` to
 * see data fetching using the OpenMRS FHIR API.
 *
 * Check out the Config docs:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { showToast, useLayoutType } from '@openmrs/esm-framework';
//import { getCohortMembers, getDataSet, search } from './cohort-builder.resources';
import { useTranslation } from 'react-i18next';
import styles from './scheduling.scss';

const SchedulingBuilder: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>{t('welcomeText', 'Welcome to the O3 Template app')}</h3>
      <p className={styles.explainer}>
        {t('explainer', 'The following examples demonstrate some key features of the O3 framework')}.
      </p>
    </div>
  );
};

export default SchedulingBuilder;
