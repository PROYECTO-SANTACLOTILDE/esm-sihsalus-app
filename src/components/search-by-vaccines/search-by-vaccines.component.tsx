import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchVaccine } from './search-vaccine/search-vaccine.component';
import { type ImmunizationWidgetConfigObject, type ImmunizationData } from '../../types/fhir-immunization-domain';
import type { SearchParams } from '../../types';
import styles from './search-by-vaccines.style.scss';
import { Search } from '@carbon/react';
import { Button } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import { ArrowRight } from '@carbon/react/icons';

interface SearchByVaccinesProps {
  onSubmit: (searchParams: SearchParams, queryDescription: string) => Promise<boolean>;
}

const immunizationsConfig: ImmunizationWidgetConfigObject = {
  immunizationConceptSet: 'CIEL:984',
  sequenceDefinitions: [],
};

const SearchByVaccines: React.FC<SearchByVaccinesProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const responsiveSize = 'md'; // Define the responsiveSize variable
  const [selectedVaccine, setSelectedVaccine] = useState<ImmunizationData | null>(null);

  const handleSubmit = () => {
    if (selectedVaccine) {
      const searchParams: SearchParams = {
        query: {
          type: 'vaccine',
          columns: [],
          rowFilters: [{ key: 'vaccineUuid', parameterValues: { uuid: selectedVaccine.vaccineUuid } }],
          customRowFilterCombination: '',
        },
      };
      const description = `${t('vaccine', 'Vaccine')}: ${selectedVaccine.vaccineName}`;
      onSubmit(searchParams, description);
    }
  };

  return (
    <div>
      <Column>
        <h3>{t('searchVaccines', 'Search Vaccines')}</h3>{' '}
        <div className={styles.actionsContainer}>
          <SearchVaccine immunizationsConfig={immunizationsConfig} setSelectedVaccine={setSelectedVaccine} />

          <Button
            size={responsiveSize}
            kind="primary"
            renderIcon={(props) => <ArrowRight size={16} {...props} />}
            onClick={() => {
              navigate({ to: window.getOpenmrsSpaBase() + 'billable-services/add-service' });
            }}
            iconDescription={t('addNewBillableService', 'Add new billable service')}
          >
            {t('addNewService', 'Add new service')}
          </Button>
        </div>
        {selectedVaccine && (
          <div>
            <p>
              {t('name', 'Name')}: {selectedVaccine.vaccineName}
            </p>
            <p>
              {t('uuid', 'UUID')}: {selectedVaccine.vaccineUuid}
            </p>
          </div>
        )}
      </Column>
    </div>
  );
};

export default SearchByVaccines;
