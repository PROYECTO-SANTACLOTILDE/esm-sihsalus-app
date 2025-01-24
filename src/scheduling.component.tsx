import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { showToast, useLayoutType, restBaseUrl } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from './types';
import { type UIVaccine, type UIVaccineData } from './types/vaccination-ui-types';
import styles from './scheduling.style.scss';
import VaccinationScheduleTable from './components/vaccination-schedule-table/vaccinationScheduleTable.component';
import SearchBySchemas from './components/search-by-schemas/search-by-schemas.component';
import SearchButtonSet from './components/search-button-set/search-button-set';
import { use } from 'i18next';

interface TabItem {
  name: string;
  component: JSX.Element;
}

const VaccinationScheduleBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [vaccinationData, setVaccinationData] = useState([]);
  const isLayoutTablet = useLayoutType() === 'tablet';

  useEffect(() => {
    setVaccinationData([
      {
        id: '1',
        vaccines: [
          {
            vaccineName: 'Administración de vacuna que contiene antígeno de virus Hepatitis B como único ingrediente',
            vaccineUuid: '782AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          },
        ],
        eligible_date_range: {
          from: {
            unit: 'years',
            value: 0,
          },
          to: {
            unit: 'months',
            value: 1,
          },
        },
      },
      {
        id: '2',
        vaccines: [
          {
            vaccineName: 'Administración de vacuna que contiene antígeno de virus Hepatitis B como único ingrediente',
            vaccineUuid: '782AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          },
        ],
        eligible_date_range: {
          from: {
            unit: 'weeks',
            value: 0,
          },
          to: {
            unit: 'years',
            value: 1,
          },
        },
      },
    ]);
  }, []);

  const updatePeriod = (newVaccine: UIVaccineData): void => {
    const index = vaccinationData.findIndex((period) => period.id === newVaccine.id);
    if (index === -1) {
      setVaccinationData([...vaccinationData, newVaccine]);
    } else {
      const newVaccinationData = [...vaccinationData];
      newVaccinationData[index] = newVaccine;
      setVaccinationData(newVaccinationData);
    }
  };

  const removePeriod = (periodId: string): void => {
    setVaccinationData(vaccinationData.filter((period) => period.id !== periodId));
  };

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
            <br />
            <VaccinationScheduleTable
              data={vaccinationData}
              onUpdatePeriod={updatePeriod}
              onRemovePeriod={removePeriod}
            />
            <br />
            <SearchButtonSet
              isLoading={false}
              onHandleSubmit={function (): void {
                throw new Error('Function not implemented.');
              }}
              onHandleReset={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationScheduleBuilder;
