import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
import { useImmunizationsConceptSet } from '../../../hooks/useImmunizationsConceptSet';
import styles from './search-vaccine.style.scss';
import type { ImmunizationWidgetConfigObject, ImmunizationData } from '../../../types/fhir-immunization-domain';
import { FilterableMultiSelect } from '@carbon/react';

interface SearchVaccineProps {
  immunizationsConfig: ImmunizationWidgetConfigObject;
  setSelectedVaccines: (vaccines: ImmunizationData[]) => void;
  selectedVaccines: ImmunizationData[];
  setSelectedVaccine: (vaccine: ImmunizationData | null) => void;
  reset?: boolean;
}

export const SearchVaccine: React.FC<SearchVaccineProps> = ({
  immunizationsConfig,
  setSelectedVaccine,
  selectedVaccines,
  reset,
}) => {
  const { t } = useTranslation();
  const { immunizationsConceptSet, isLoading } = useImmunizationsConceptSet(immunizationsConfig);

  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [searchError, setSearchError] = useState<string>('');
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Cargar las opciones iniciales del Dropdown
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

  // Manejar búsquedas en tiempo real
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
    setSelectedItem(event.selectedItem);
    setSelectedVaccine(vaccine || null);
  };

  useEffect(() => {
    setSelectedItem(null);
  }, [reset, setSelectedItem]);

  return (
    <div className={styles.container}>
      <Column className={styles.column}>
        <FilterableMultiSelect
          id="vaccine-dropdown"
          titleText={t('searchVaccines', 'Search Vaccines')}
          items={searchResults.map((vaccine) => ({
            vaccineName: vaccine.vaccineName,
            vaccineUuid: vaccine.vaccineUuid,
          }))}
          itemToString={(item) => (item ? item.vaccineName : '')}
          initialSelectedItems={selectedVaccines.map((vaccine) => ({
            vaccineName: vaccine.vaccineName,
            vaccineUuid: vaccine.vaccineUuid,
          }))}
          selectionFeedback="top-after-reopen"
          onChange={(event) => setSelectedVaccine(event.selectedItems)}
          label={t('searchVaccines', 'Search Vaccines')}
          disabled={isLoading}
          className={styles.dropdown}
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

export default SearchVaccine;
