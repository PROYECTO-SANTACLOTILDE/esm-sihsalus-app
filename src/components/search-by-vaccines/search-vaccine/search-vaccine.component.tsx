import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Button, Column, CodeSnippetSkeleton, Search } from '@carbon/react';
import { useImmunizationsConceptSet } from '../../../hooks/useImmunizationsConceptSet';
import styles from './search-vaccine.style.css';
import type { ImmunizationWidgetConfigObject, ImmunizationData } from '../../../types/fhir-immunization-domain';

interface SearchVaccineProps {
  immunizationsConfig: ImmunizationWidgetConfigObject;
  setSelectedVaccine: (vaccine: ImmunizationData | null) => void;
}

export const SearchVaccine: React.FC<SearchVaccineProps> = ({ immunizationsConfig, setSelectedVaccine }) => {
  const { t } = useTranslation();
  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet(immunizationsConfig);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);

  // Handle search logic
  const onSearch = async (search: string) => {
    setSearchResults([]);
    setSelectedVaccine(null);
    setIsSearching(true);
    setIsSearchResultsEmpty(false);

    try {
      if (!immunizationsConceptSet) {
        throw new Error(t('noConceptSet', 'Immunizations concept set not loaded'));
      }

      if (immunizationsConceptSet?.answers?.length > 0) {
        setSearchResults(
          immunizationsConceptSet.answers
            .filter((vaccine) => vaccine.display.toLowerCase().includes(search.toLowerCase()))
            .map((vaccine) => ({
              vaccineName: vaccine.display,
              vaccineUuid: vaccine.uuid,
              existingDoses: vaccine.existingDoses || [],
            })),
        );
      } else {
        setIsSearchResultsEmpty(true);
      }

      setIsSearching(false);
    } catch (error) {
      setSearchError(error.toString());
      setIsSearching(false);
    }
  };

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useRef(
    debounce(async (searchText: string) => {
      if (searchText) {
        await onSearch(searchText);
      }
    }, 500),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onSearchClear = () => {
    setIsSearchResultsEmpty(false);
    setSearchResults([]);
    setSelectedVaccine(null);
  };

  const handleVaccineClick = (vaccine: ImmunizationData) => {
    setSelectedVaccine(vaccine);
    setSearchResults([]);
    setIsSearchResultsEmpty(false);
  };

  const handleWithDebounce = (event) => {
    setSearchText(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <div>
      <Column className={styles.column}>
        <Search
          closeButtonLabelText={t('clearSearch', 'Clear search')}
          id="vaccine-search"
          labelText={t('searchVaccines', 'Search Vaccines')}
          placeholder={t('searchVaccines', 'Search Vaccines')}
          onChange={handleWithDebounce}
          onClear={onSearchClear}
          size="lg"
          value={searchText}
        />
        <div className={styles.search}>
          {isLoading || isSearching ? (
            <CodeSnippetSkeleton type="multi" />
          ) : (
            searchResults.map((vaccine: ImmunizationData) => (
              <div key={vaccine.vaccineUuid}>
                <Button kind="ghost" onClick={() => handleVaccineClick(vaccine)}>
                  {vaccine.vaccineName}
                </Button>
                <br />
              </div>
            ))
          )}
        </div>
        {isSearchResultsEmpty && <p className={styles.text}>{t('noSearchItems', 'There are no search items')}</p>}
        {searchError && <span>{searchError}</span>}
      </Column>
    </div>
  );
};
