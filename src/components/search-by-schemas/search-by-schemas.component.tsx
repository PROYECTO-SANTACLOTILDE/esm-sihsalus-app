import React, { useState } from 'react';
import { Column } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { SearchSchema } from './search-schema/search-schema.component';
import type { SchemasWidgetConfigObject, ImmunizationData } from '../../types/fhir-immunization-domain';
import type { SearchParams } from '../../types';

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
    <div>
      <Column>
        <h3>{t('searchSchemas', 'Search Schemas')}</h3>
        <SearchSchema immunizationsConfig={immunizationsConfig} setSelectedVaccine={setSelectedSchema} />
        {selectedSchema && (
          <div>
            <h4>{t('selectedSchema', 'Selected Schema')}</h4>
            <p>
              {t('name', 'Name')}: {selectedSchema.vaccineName}
            </p>
            <p>
              {t('uuid', 'UUID')}: {selectedSchema.vaccineUuid}
            </p>
            <button onClick={handleSubmit}>{t('submit', 'Submit')}</button>
          </div>
        )}
      </Column>
    </div>
  );
};

export default SearchBySchemas;
