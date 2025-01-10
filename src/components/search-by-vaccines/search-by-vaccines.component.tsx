import React, { useState } from 'react';
import { DatePicker, DatePickerInput, Column, Dropdown, NumberInput, Switch, ContentSwitcher } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Concept, SearchByProps } from '../../types';
import { SearchVaccine } from './search-vaccine/search-vaccine.component';

const SearchByVaccines: React.FC<SearchByProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [concept, setConcept] = useState<Concept>(null);
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <div>
        <SearchVaccine
          setConcept={setConcept}
          concept={concept}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>
    </>
  );
};

export default SearchByVaccines;
