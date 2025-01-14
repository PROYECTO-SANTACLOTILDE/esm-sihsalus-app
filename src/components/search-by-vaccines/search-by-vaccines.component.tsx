import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchVaccine } from './search-vaccine/search-vaccine.component';
import { type ImmunizationWidgetConfigObject, type ImmunizationData } from '../../types/fhir-immunization-domain';
import type { SearchParams } from '../../types';
import styles from './search-by-vaccines.style.scss';

interface SearchByVaccinesProps {
  onSubmit: (searchParams: SearchParams, queryDescription: string) => Promise<boolean>;
}

const immunizationsConfig: ImmunizationWidgetConfigObject = {
  immunizationConceptSet: 'CIEL:984',
  sequenceDefinitions: [],
};

const SearchByVaccines: React.FC<SearchByVaccinesProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
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
        <h3>{t('searchVaccines', 'Search Vaccines')}</h3>
        <SearchVaccine immunizationsConfig={immunizationsConfig} setSelectedVaccine={setSelectedVaccine} />
        {selectedVaccine && (
          <div>
            <h4>{t('selectedVaccine', 'Selected Vaccine')}</h4>
            <p>
              {t('name', 'Name')}: {selectedVaccine.vaccineName}
            </p>
            <p>
              {t('uuid', 'UUID')}: {selectedVaccine.vaccineUuid}
            </p>
            <button onClick={handleSubmit}>{t('submit', 'Submit')}</button>
          </div>
        )}
      </Column>
    </div>
  );
};

export default SearchByVaccines;
