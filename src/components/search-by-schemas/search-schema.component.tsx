import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, CodeSnippetSkeleton, Dropdown } from '@carbon/react';
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
  const [selectedSchema, setSelectedSchema] = useState<OpenmrsConcept | null>(null);
  const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);

  useEffect(() => {
    setIsSearchResultsEmpty(!vaccinationPrograms?.length);
  }, [vaccinationPrograms]);

  useEffect(() => {
    if (vaccinationPrograms?.length) {
      // You can add any necessary logic here if needed
    }
  }, [vaccinationPrograms]);

  const handleSelectionChange = (selectedItem) => {
    const schema = vaccinationPrograms?.find((p) => p.display === selectedItem);
    if (schema) {
      setSelectedSchema(schema);
      onSchemaSelect(schema);
    }
  };

  const getProgramDisplayName = (program) => {
    return program.name || program.display || program.concept?.display || t('unnamedProgram', 'Unnamed Program');
  };

  return (
    <div>
      <Column className={styles.column}>
        <Dropdown
          id="schema-dropdown"
          label={t('searchSchemas', 'Search Schemas')}
          titleText={t('selectSchema', 'Select a Schema')}
          items={vaccinationPrograms?.map((program) => getProgramDisplayName(program)) ?? []}
          itemToString={(item) => item || t('unnamedProgram', 'Unnamed Program')}
          onChange={(event) => handleSelectionChange(event.selectedItem)}
          disabled={isLoading || isSearchResultsEmpty}
          selectedItem={selectedSchema ? getProgramDisplayName(selectedSchema) : ''}
        />
        {isLoading && <CodeSnippetSkeleton type="multi" />}
        {isSearchResultsEmpty && (
          <p className={styles.text}>{t('noSchemas', 'No schemas available')}</p>
        )}
        {hookError && (
          <span className={styles.text}>
            {t('error', 'Error')}: {hookError}
          </span>
        )}
        {selectedSchema && (
          <div>
            <h4>{t('selectedSchema', 'Selected Schema')}</h4>
            <p>
              {t('name', 'Name')}: {getProgramDisplayName(selectedSchema)}
            </p>
            <p>
              {t('uuid', 'UUID')}: {selectedSchema.uuid}
            </p>
          </div>
        )}
      </Column>
    </div>
  );
};
