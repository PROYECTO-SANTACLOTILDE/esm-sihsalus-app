import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
import { useImmunizationsConceptSet } from '../../../hooks/useImmunizationsConceptSet';
import styles from './search-concept.style.scss';
import type { ImmunizationWidgetConfigObject, ImmunizationData } from '../../../types/fhir-immunization-domain';

interface SearchConceptProps {
  immunizationsConfig: ImmunizationWidgetConfigObject;
  setSelectedConcept: (concept: ImmunizationData | null) => void;
  reset?: boolean;
}

export const SearchConcept: React.FC<SearchConceptProps> = ({ immunizationsConfig, setSelectedConcept, reset }) => {
  const { t } = useTranslation();
  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet(immunizationsConfig);

  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [searchError, setSearchError] = useState<string>('');
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch immunization concept set and map to search results
  useEffect(() => {
    if (immunizationsConceptSet) {
      const answers = immunizationsConceptSet.answers || [];
      setSearchResults(
        answers.map((concept) => ({
          vaccineName: concept.display,
          vaccineUuid: concept.uuid,
          existingDoses: [],
        })),
      );
    }
  }, [immunizationsConceptSet]);

  // Handle search functionality
  const onSearch = (searchText: string) => {
    try {
      const answers = immunizationsConceptSet?.answers || [];
      const filteredResults = answers
        .filter((concept) => concept.display.toLowerCase().includes(searchText.toLowerCase()))
        .map((concept) => ({
          vaccineName: concept.display,
          vaccineUuid: concept.uuid,
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

  // Handle selection change
  const handleSelectionChange = (event: { selectedItem: string | null }) => {
    const concept = searchResults.find((c) => c.vaccineName === event.selectedItem);
    setSelectedItem(event.selectedItem);
    setSelectedConcept(concept || null);
  };

  // Reset the dropdown when reset is triggered
  useEffect(() => {
    setSelectedItem(null);
  }, [reset, setSelectedConcept]);

  return (
    <div className={styles.container}>
      <Column className={styles.column}>
        <Dropdown
          id="concept-dropdown"
          label={t('searchConcepts', 'Search Concepts')}
          titleText={t('selectConcept', 'Select a Concept')}
          items={searchResults.map((concept) => concept.vaccineName)}
          itemToString={(item) => item || ''}
          selectedItem={selectedItem} // Controlled state
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
