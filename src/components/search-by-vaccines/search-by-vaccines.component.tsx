import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchVaccine } from './search-vaccine/search-vaccine.component';
import { type ImmunizationWidgetConfigObject, type ImmunizationData } from '../../types/fhir-immunization-domain';
import { SearchConcept } from './search-concept/search-concept.component';
import type { SearchParams } from '../../types';
import styles from './search-by-vaccines.style.scss';
import { Search } from '@carbon/react';
import { Button } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import { ArrowRight } from '@carbon/react/icons';
import { ButtonSet } from '@carbon/react';
import { Row } from '@carbon/react';

interface SearchByVaccinesProps {
  onSubmit: (searchParams: SearchParams, queryDescription: string) => Promise<boolean>;
}

const immunizationsConfig: ImmunizationWidgetConfigObject = {
  immunizationConceptSet: 'CIEL:984',
  sequenceDefinitions: [],
};

const SearchByVaccines: React.FC<SearchByVaccinesProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const responsiveSize = 'md';
  const [selectedVaccines, setSelectedVaccines] = useState<ImmunizationData[]>(null);
  const [selectedConcept, setSelectedConcept] = useState<ImmunizationData | null>(null);

  return (
    <div>
      <Column>
        <h3>{t('searchVaccines', 'Search Vaccines')}</h3>{' '}
        <div>
          <div>
            <SearchVaccine
              immunizationsConfig={immunizationsConfig}
              setSelectedVaccines={setSelectedVaccines}
              seletectedVaccines={[]}
            />
          </div>
        </div>
      </Column>
    </div>
  );
};

export default SearchByVaccines;
