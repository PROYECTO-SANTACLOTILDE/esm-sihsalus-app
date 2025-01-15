import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
import { useImmunizationsConceptSet } from '../../../hooks/useImmunizationsConceptSet';
import styles from './search-concept.style.scss';
import type { ImmunizationWidgetConfigObject, ImmunizationData } from '../../../types/fhir-immunization-domain';

interface SearchVaccineProps {
  immunizationsConfig: ImmunizationWidgetConfigObject;
  setSelectedVaccine: (vaccine: ImmunizationData | null) => void;
}

export const SearchConcept: React.FC<SearchVaccineProps> = ({ immunizationsConfig, setSelectedVaccine }) => {
  const { t } = useTranslation();
  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet(immunizationsConfig);

  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [searchError, setSearchError] = useState<string>('');
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState<boolean>(false);

  useEffect(() => {
    if (immunizationsConceptSet) {
      const answers = immunizationsConceptSet.answers || [];
      setSearchResults(
        answers.map((vaccine) => ({
          vaccineName: vaccine.display,
          vaccineUuid: vaccine.uuid,
          existingDoses: [],
        })),
      );
    }
  }, [immunizationsConceptSet]);

  const onSearch = (searchText: string) => {
    try {
      const answers = immunizationsConceptSet?.answers || [];
      const filteredResults = answers
        .filter((vaccine) => vaccine.display.toLowerCase().includes(searchText.toLowerCase()))
        .map((vaccine) => ({
          vaccineName: vaccine.display,
          vaccineUuid: vaccine.uuid,
          existingDoses: [],
        }));

      setSearchResults(filteredResults);
      setIsSearchResultsEmpty(filteredResults.length === 0);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchError(t('searchError', 'An error occurred while searching.'));
    }
  };

  const debouncedSearch = useRef(
    debounce((searchText: string) => {
      onSearch(searchText);
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSelectionChange = (event: { selectedItem: string | null }) => {
    const vaccine = searchResults.find((v) => v.vaccineName === event.selectedItem);
    if (vaccine) {
      setSelectedVaccine(vaccine);
    }
  };

  return (
    <div className={styles.container}>
      <Column className={styles.column}>
        <Dropdown
          id="vaccine-dropdown"
          label={t('searchVaccines', 'Search Vaccines')}
          titleText={t('selectVaccine', 'Select a Vaccine')}
          items={searchResults.map((vaccine) => vaccine.vaccineName)}
          itemToString={(item) => item || ''}
          onChange={(event) => handleSelectionChange(event)}
          disabled={isLoading}
        />

        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {isSearchResultsEmpty && <p className={styles.noResults}>{t('noSearchItems', 'No vaccines found')}</p>}
        {searchError && (
          <span className={styles.errorText}>
            {t('error', 'Error')}: {searchError}
          </span>
        )}
      </Column>
    </div>
  );
};

export default SearchConcept;
