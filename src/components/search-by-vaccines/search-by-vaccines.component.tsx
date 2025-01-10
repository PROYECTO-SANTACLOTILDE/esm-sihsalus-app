import React, { useState } from 'react';
import { DatePicker, DatePickerInput, Column, Dropdown, NumberInput, Switch, ContentSwitcher } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { composeJson, queryDescriptionBuilder } from '../../schema-builder.utils';
import type { Concept, SearchByProps } from '../../types';
import { SearchConcept } from './search-vaccine/search-vaccine.component';
import SearchButtonSet from '../../search-button-set/search-button-set';
import styles from './search-by-vaccines.style.scss';

const operators = [
  {
    id: 0,
    label: '<',
    value: 'LESS_THAN',
  },
  {
    id: 1,
    label: '<=',
    value: 'LESS_EQUAL',
  },
  {
    id: 2,
    label: '=',
    value: 'EQUAL',
  },
  {
    id: 3,
    label: '>=',
    value: 'GREATER_EQUAL',
  },
  {
    id: 4,
    label: '>',
    value: 'GREATER_THAN',
  },
];

interface Observation {
  timeModifier: string;
  question: string;
  operator1: string;
  modifier: string;
  onOrBefore: string;
  onOrAfter: string;
  value1: string;
}

const types = {
  CWE: 'codedObsSearchAdvanced',
  NM: 'numericObsSearchAdvanced',
  DT: 'dateObsSearchAdvanced',
  ST: 'dateObsSearchAdvanced',
  TS: 'textObsSearchAdvanced',
  ZZ: 'codedObsSearchAdvanced',
  BIT: 'codedObsSearchAdvanced',
};

const SearchByVaccines: React.FC<SearchByProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [concept, setConcept] = useState<Concept>(null);
  const [lastDays, setLastDays] = useState(0);
  const [lastMonths, setLastMonths] = useState(0);
  const [operatorValue, setOperatorValue] = useState(0);
  const [operator, setOperator] = useState('LESS_THAN');
  const [timeModifier, setTimeModifier] = useState('ANY');
  const [onOrAfter, setOnOrAfter] = useState('');
  const [onOrBefore, setOnOrBefore] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const observationOptions = [
    {
      id: 'option-0',
      label: t('haveObservations', 'Patients who have these observations'),
      value: 'ANY',
    },
    {
      id: 'option-1',
      label: t('haveNoObservations', 'Patients who do not have these observations'),
      value: 'NO',
    },
  ];

  const whichObservation = [
    {
      id: 'option-0',
      label: t('any', 'Any'),
      value: 'ANY',
    },
    {
      id: 'option-1',
      label: t('none', 'None'),
      value: 'NO',
    },
    {
      id: 'option-2',
      label: t('earliest', 'Earliest'),
      value: 'FIRST',
    },
    {
      id: 'option-3',
      label: t('recent', 'Most Recent'),
      value: 'LAST',
    },
    {
      id: 'option-4',
      label: t('lowest', 'Lowest'),
      value: 'MIN',
    },
    {
      id: 'option-5',
      label: t('highest', 'Highest'),
      value: 'MAX',
    },
    {
      id: 'option-6',
      label: t('average', 'Average'),
      value: 'AVG',
    },
  ];

  const reset = () => {
    setConcept(null);
    setLastDays(0);
    setSearchText('');
    setOnOrAfter('');
    setOnOrBefore('');
    setLastMonths(0);
    setOperatorValue(0);
    setOperator('LESS_THAN');
    setTimeModifier('ANY');
  };

  const getOnOrBefore = () => {
    if (lastDays > 0 || lastMonths > 0) {
      return dayjs().subtract(lastDays, 'days').subtract(lastMonths, 'months').format();
    }
  };

  const submit = async () => {
    setIsLoading(true);
    const observations: Observation = {
      modifier: '',
      operator1: operator,
      value1: operatorValue > 0 ? operatorValue.toString() : '',
      question: concept.uuid,
      onOrBefore: getOnOrBefore() || onOrBefore,
      onOrAfter,
      timeModifier,
    };
    const dataType = types[concept.hl7Abbrev];
    const params = { [dataType]: [] };
    Object.keys(observations).forEach((key) => {
      observations[key] !== ''
        ? params[dataType].push({
            name: key === 'modifier' ? (['CWE', 'TS'].includes(concept.hl7Abbrev) ? 'values' : 'value1') : key,
            value:
              key === 'modifier' && ['CWE', 'TS'].includes(concept.hl7Abbrev) ? [observations[key]] : observations[key],
          })
        : '';
    });
    await onSubmit(composeJson(params), queryDescriptionBuilder(observations, concept.name));
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <SearchConcept
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
