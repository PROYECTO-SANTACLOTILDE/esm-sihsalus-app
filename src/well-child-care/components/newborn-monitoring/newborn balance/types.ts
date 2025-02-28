import type { PatientVitalsAndBiometrics } from '../../../common';

export interface BalanceTableRow extends PatientVitalsAndBiometrics {
  id: string;
  dateRender: string;
  stoolCountRender: string | number;
  stoolGramsRender: string | number;
  urineCountRender: string | number;
  urineGramsRender: string | number;
  vomitCountRender: string | number;
  vomitGramsMLRender: string | number;
}

export interface BalanceTableHeader {
  key:
    | 'dateRender'
    | 'stoolCountRender'
    | 'stoolGramsRender'
    | 'urineCountRender'
    | 'urineGramsRender'
    | 'vomitCountRender'
    | 'vomitGramsMLRender';
  header: string;
  isSortable?: boolean;
  sortFunc: (valueA: BalanceTableRow, valueB: BalanceTableRow) => number;
}
