import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
import { useSchemasConceptSet } from '../../hooks/useSchemesConceptSet';
import styles from './search-schema.style.scss';
import type { SchemasWidgetConfigObject, ImmunizationData } from '../../types/fhir-immunization-domain';

interface SearchSchemaProps {
  immunizationsConfig: SchemasWidgetConfigObject;
  setSelectedVaccine: (vaccine: ImmunizationData | null) => void;
}

export const SearchSchema: React.FC<SearchSchemaProps> = ({ immunizationsConfig, setSelectedVaccine }) => {
  const { t } = useTranslation();
  const { schemasConceptSet, isLoading } = useSchemasConceptSet(immunizationsConfig);

  const [searchResults, setSearchResults] = useState<ImmunizationData[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<ImmunizationData | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);

  // Inicialización de datos
  useEffect(() => {
    if (schemasConceptSet) {
      const answers = schemasConceptSet.answers || [];
      setSearchResults(
        answers.map((schema) => ({
          vaccineName: schema.display,
          vaccineUuid: schema.uuid,
          existingDoses: [],
        })),
      );
    }
  }, [schemasConceptSet]);

  const onSearch = (searchText: string) => {
    try {
      const answers = schemasConceptSet?.answers || [];
      const filteredResults = answers
        .filter((schema) => schema.display.toLowerCase().includes(searchText.toLowerCase()))
        .map((schema) => ({
          vaccineName: schema.display,
          vaccineUuid: schema.uuid,
          existingDoses: [],
        }));

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
      onSearch(searchText);
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSelectionChange = (selectedItem: string | null) => {
    const schema = searchResults.find((v) => v.vaccineUuid === selectedItem);
    if (schema) {
      setSelectedSchema(schema);
      setSelectedVaccine(schema);
    }
  };

  return (
    <div>
      <Column className={styles.column}>
        <Dropdown
          id="schema-dropdown"
          label={t('searchSchemas', 'Search Schemas')}
          titleText={t('selectSchema', 'Select a Schema')}
          items={searchResults.map((schema) => schema.vaccineName)}
          itemToString={(item) => item || ''}
          onChange={(event) => handleSelectionChange(event.selectedItem)}
          disabled={isLoading || isSearchResultsEmpty}
        />

        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {isSearchResultsEmpty && <p className={styles.text}>{t('noSchemas', 'No schemas available')}</p>}
        {searchError && (
          <span className={styles.text}>
            {t('error', 'Error')}: {searchError}
          </span>
        )}

        {selectedSchema && (
          <div>
            <h4>{t('selectedSchema', 'Selected Schema')}</h4>
            <p>
              {t('name', 'Name')}: {selectedSchema.vaccineName}
            </p>
            <p>
              {t('uuid', 'UUID')}: {selectedSchema.vaccineUuid}
            </p>
          </div>
        )}
      </Column>
    </div>
  );
};

export default SearchSchema;
