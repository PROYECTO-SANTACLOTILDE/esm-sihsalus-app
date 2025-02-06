import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
import { useImmunizationsConceptSet } from '../../useImmunizationsConceptSet';
import styles from './search-concept.style.scss';
import type { ImmunizationWidgetConfigObject, ImmunizationData } from '../../fhir-immunization-domain';

interface SearchVaccineProps {
  immunizationsConfig: ImmunizationWidgetConfigObject;
  setSelectedConcept: (vaccine: ImmunizationData | null) => void;
}

export const SearchConcept: React.FC<SearchVaccineProps> = ({ immunizationsConfig, setSelectedConcept }) => {
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
      setSelectedConcept(vaccine);
    }
  };

  return (
    <div className={styles.container}>
      <Column className={styles.column}>
        <Dropdown
          id="concept-dropdown"
          label={t('searchConcepts', 'Search Concepts')}
          titleText={t('selectConcept', 'Select a Concept')}
          items={searchResults.map((vaccine) => vaccine.vaccineName)}
          itemToString={(item) => item || ''}
          onChange={(event) => handleSelectionChange(event)}
          disabled={isLoading}
          className={styles.dropdown}
        />

        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {isSearchResultsEmpty && <p className={styles.noResults}>{t('noSearchItems', 'No concepts found')}</p>}
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
