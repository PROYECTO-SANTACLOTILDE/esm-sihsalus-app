import type { PatientVitalsAndBiometrics } from "../../../common";

export interface BiometricsTableRow extends PatientVitalsAndBiometrics {
  id: string;
  dateRender: string;
  weightRender: string | number;
  heightRender: string | number;
  headCircumferenceRender: string | number;
  chestCircumferenceRender: string | number;
}

export interface BiometricsTableHeader {
  key: 'dateRender' | 'weightRender' | 'heightRender' | 'headCircumferenceRender' | 'chestCircumferenceRender';
  header: string;
  isSortable?: boolean;
  sortFunc: (valueA: BiometricsTableRow, valueB: BiometricsTableRow) => number;
}
