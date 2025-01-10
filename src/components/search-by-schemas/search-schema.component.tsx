import React, { useEffect, useState, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { useTranslation } from 'react-i18next';
import { Column, Table, TableContainer, TableHead, TableRow, TableHeader, TableBody, TableCell, TextInput, CodeSnippetSkeleton } from '@carbon/react';
import { useSchemesConceptSet } from '../../hooks/useSchemesConceptSet';
import type { OpenmrsConcept } from '../../types/fhir-immunization-domain';
import styles from './search-schema.style.scss';

interface SearchSchemaProps {
  config: {
    vaccinationProgramConceptSet: string;
    baseUrl?: string;
  };
  onSchemaSelect: (schema: OpenmrsConcept) => void;
}

export const SearchSchema: React.FC<SearchSchemaProps> = ({ config, onSchemaSelect }) => {
  const { t } = useTranslation();
  const { vaccinationPrograms, isLoading, error: hookError } = useSchemesConceptSet(config);
  const [searchText, setSearchText] = useState('');
  const [filteredSchemas, setFilteredSchemas] = useState<OpenmrsConcept[]>([]);
  const [searchError, setSearchError] = useState('');

  const filterSchemas = (text: string) => {
    if (!vaccinationPrograms) {
      return;
    }
    const lowerText = text.toLowerCase();
    const results = vaccinationPrograms.filter((s) => s.display.toLowerCase().includes(lowerText));
    setFilteredSchemas(results);
  };

  const debouncedFilter = useRef(
    debounce((text: string) => {
      filterSchemas(text);
    }, 300),
  ).current;

  useEffect(() => {
    if (vaccinationPrograms) {
      setFilteredSchemas(vaccinationPrograms);
    }
  }, [vaccinationPrograms]);

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const text = evt.target.value;
    setSearchText(text);
    debouncedFilter(text);
  };

  const handleSchemaSelect = (schema: OpenmrsConcept) => {
    onSchemaSelect(schema);
  };

  return (
    <div>
      <Column>
        <h3>{t('searchSchemas', 'Search Schemas')}</h3>
        <TextInput
          id="schema-search"
          labelText={t('search', 'Search')}
          value={searchText}
          onChange={handleSearchChange}
          placeholder={t('enterSearchTerm', 'Enter search term...')}
        />
        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {(hookError || searchError) && (
          <span>{t('error', 'Error')}: {hookError || searchError}</span>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t('name', 'Name')}</TableHeader>
                <TableHeader>{t('uuid', 'UUID')}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchemas.map((schema) => (
                <TableRow key={schema.uuid} onClick={() => handleSchemaSelect(schema)} className={styles.clickableRow}>
                  <TableCell>{schema.display}</TableCell>
                  <TableCell>{schema.uuid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Column>
    </div>
  );
};
