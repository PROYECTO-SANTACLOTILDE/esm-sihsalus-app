import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchVaccine } from './search-vaccine/search-vaccine.component';
import { type ImmunizationWidgetConfigObject, type ImmunizationData } from '../../types/fhir-immunization-domain';
import { SearchConcept } from './search-concept/search-concept.component';
import type { SearchParams } from '../../types';
import styles from './search-by-vaccines.style.scss';
import { Button, ButtonSet, Row } from '@carbon/react';

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
  const [selectedConcept, setSelectedConcept] = useState<ImmunizationData | null>(null);
  const [reset, setReset] = useState(false);

  const handleClean = () => {
    setSelectedVaccine(null);
    setSelectedConcept(null);
    setReset((prev) => !prev); // Alterna el estado para activar el reset
  };

  return (
    <div>
      <Column>
        <h3>{t('searchVaccines', 'Search Vaccines')}</h3>
        <div className={styles.actionsContainer}>
          <div>
            <SearchVaccine
              immunizationsConfig={immunizationsConfig}
              setSelectedVaccine={setSelectedVaccine}
              reset={reset}
            />
            <SearchConcept immunizationsConfig={immunizationsConfig} setSelectedConcept={setSelectedConcept} />
          </div>
          <Row sm={1} md={{ offset: 4 }} className={styles.container}>
            <ButtonSet className={styles.buttonSet} stacked>
              <Button kind="danger" data-testid="reset-btn" onClick={handleClean}>
                {t('clean', 'Clean')}
              </Button>
              <Button kind="primary" data-testid="search-btn" onClick={handleClean}>
                {t('addNewVaccine', 'Add new vaccine')}
              </Button>
            </ButtonSet>
          </Row>
        </div>
      </Column>
    </div>
  );
};

export default SearchByVaccines;
