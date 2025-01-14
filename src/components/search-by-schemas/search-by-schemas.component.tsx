import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchSchema } from './search-schema/search-schema.component';
import type { SchemasWidgetConfigObject, ImmunizationData } from '../../types/fhir-immunization-domain';
import type { SearchParams } from '../../types';
import styles from './search-by-schemas.style.scss';

interface SearchBySchemasProps {
  onSubmit: (searchParams: SearchParams, queryDescription: string) => Promise<boolean>;
}

const immunizationsConfig: SchemasWidgetConfigObject = {
  schemasConceptSet: 'PERUHCE:CRED01',
  sequenceDefinitions: [],
};

const SearchBySchemas: React.FC<SearchBySchemasProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [selectedSchema, setSelectedSchema] = useState<ImmunizationData | null>(null);

  const handleSubmit = () => {
    if (selectedSchema) {
      const searchParams: SearchParams = {
        query: {
          type: 'schema',
          columns: [],
          rowFilters: [{ key: 'schemaUuid', parameterValues: { uuid: selectedSchema.vaccineUuid } }],
          customRowFilterCombination: '',
        },
      };
      const description = `${t('schema', 'Schema')}: ${selectedSchema.vaccineName}`;
      onSubmit(searchParams, description);
    }
  };

  return (
    <div className={styles.searchBySchemasContainer}>
      <Column>
        <h3 className={styles.searchBySchemasHeading}>{t('searchSchemas', 'Search Schemas')}</h3>
        <SearchSchema immunizationsConfig={immunizationsConfig} setSelectedVaccine={setSelectedSchema} />
        {selectedSchema && (
          <div className={styles.selectedSchemaContainer}>
            <h4 className={styles.selectedSchemaTitle}>{t('selectedSchema', 'Selected Schema')}</h4>
            <div className={styles.schemaDetails}>
              <p>
                <strong>{t('name', 'Name')}:</strong> {selectedSchema.vaccineName}
              </p>
              <p>
                <strong>{t('uuid', 'UUID')}:</strong> {selectedSchema.vaccineUuid}
              </p>
            </div>
            <button onClick={handleSubmit} className={styles.submitButton}>
              {t('submit', 'Submit')}
            </button>
          </div>
        )}
      </Column>
    </div>
  );
};

export default SearchBySchemas;
