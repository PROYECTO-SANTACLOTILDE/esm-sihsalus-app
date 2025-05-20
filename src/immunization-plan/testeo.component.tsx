import React, { useState, useCallback } from 'react';
import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  ComboBox,
  Loading,
  InlineNotification,
  Modal,
} from '@carbon/react';
import { Add, Subtract, Save, Warning } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useImmunizationsConceptSet } from '../hooks/useImmunizationsConceptSet';
import styles from './immunization-plan-builder.scss';
import ImmunizationPlanHeader from './immunization-plan-header/immunization-plan-header.component';

interface ImmunizationPeriod {
  label: string;
  id: string;
  minAge?: number;
  maxAge?: number;
}

interface Vaccine {
  id: number;
  name: string;
  uuid?: string;
  periods: Record<
    string,
    {
      status: 'required' | 'optional' | 'conditional';
      notes?: string;
    }
  >;
}

const initialPeriods: ImmunizationPeriod[] = [
  { id: '0', label: 'R.N.', maxAge: 1 },
  { id: '2', label: '2 meses', minAge: 2, maxAge: 3 },
  { id: '4', label: '4 meses', minAge: 4, maxAge: 5 },
  { id: '6', label: '6 meses', minAge: 6, maxAge: 7 },
  { id: '12', label: '12 meses', minAge: 12, maxAge: 14 },
  { id: '15', label: '15 meses', minAge: 15, maxAge: 17 },
  { id: '18', label: '18 meses', minAge: 18, maxAge: 20 },
  { id: '24', label: '24 meses', minAge: 24, maxAge: 26 },
];

const ImmunizationPlanBuilder: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <ImmunizationPlanHeader title={t('immunizationPlanBuilder', 'Immunization Plan Management')} />
    </div>
  );
};

export default ImmunizationPlanBuilder;
