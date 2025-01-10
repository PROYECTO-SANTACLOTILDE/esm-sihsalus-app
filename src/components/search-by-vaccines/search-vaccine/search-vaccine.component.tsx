import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Button, Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
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

  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [selectedVaccine, setLocalSelectedVaccine] = useState<ImmunizationData | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);

  // Inicialización de datos
  useEffect(() => {
    if (immunizationsConceptSet) {
      console.log('Datos iniciales (immunizationsConceptSet):', immunizationsConceptSet);
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

      console.log('Resultados filtrados:', filteredResults);

      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
        setIsSearchResultsEmpty(false);
      } else {
        setSearchResults([]);
        setIsSearchResultsEmpty(true);
      }
    } catch (error) {
      console.error('Error durante la búsqueda:', error);
      setSearchError(error.toString());
    }
  };

  const debouncedSearch = useRef(
    debounce((searchText: string) => {
      console.log('Texto de búsqueda:', searchText);
      onSearch(searchText);
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSelectionChange = (selectedItem) => {
    const vaccine = searchResults.find((v) => v.vaccineUuid === selectedItem);
    if (vaccine) {
      setLocalSelectedVaccine(vaccine);
      setSelectedVaccine(vaccine);
      console.log('Vacuna seleccionada:', vaccine);
    }
  };

  return (
    <div>
      <Column className={styles.column}>
        <Dropdown
          id="vaccine-dropdown"
          label={t('searchVaccines', 'Search Vaccines')}
          titleText={t('selectVaccine', 'Select a Vaccine')}
          items={searchResults.map((vaccine) => vaccine.vaccineName)}
          itemToString={(item) => item || ''}
          onChange={(event) => handleSelectionChange(event.selectedItem)}
        />
        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {isSearchResultsEmpty && <p className={styles.text}>{t('noSearchItems', 'No vaccines found')}</p>}
        {searchError && (
          <span className={styles.text}>
            {t('error', 'Error')}: {searchError}
          </span>
        )}
        {selectedVaccine && (
          <div>
            <h4>{t('selectedVaccine', 'Selected Vaccine')}</h4>
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
