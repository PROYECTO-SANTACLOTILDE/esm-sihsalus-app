import type { PatientVitalsAndBiometrics } from '../../../common';

export interface LabourHistoryTableRow extends PatientVitalsAndBiometrics  {
  id: string; // Unique identifier for the row
  date: string; // Date of the observation or encounter
  admissionDate?: string; // Date and time of admission
  terminationDate?: string; // Date and time of termination
  maternalPulse?: number | string; // Maternal pulse in beats per minute (bpm)
  systolicBP?: number | string; // Systolic blood pressure in mmHg
  diastolicBP?: number | string; // Diastolic blood pressure in mmHg
  maternalWeight?: number | string; // Maternal weight in Kg
  gestationalAge?: number | string; // Gestational age in weeks
  fetalHeartRate?: number | string; // Fetal heart rate in bpm
  uterineHeight?: number | string; // Uterine height in cm
  dilatation?: number | string; // Cervical dilatation in cm
  amnioticFluid?: string; // Description of amniotic fluid
  ruptureDate?: string; // Date of membrane rupture
  deliveryStart?: string; // Start of delivery
  deliveryType?: string; // Type of delivery
}


export interface LabourHistoryTableHeader {
  key:
    | 'maternalPulseRender'    // New key
    | 'systolicBPRender'       // New key
    | 'diastolicBPRender'      // New key
    | 'maternalWeightRender'   // New key
    | 'gestationalAgeRender'   // New key
    | 'fetalHeartRateRender'   // New key
    | 'uterineHeightRender'    // New key
    | 'dilatationRender'       // New key
    | 'amnioticFluidRender'    // New key
    | 'membranesRender'        // New key
    | 'ruptureDateRender'      // New key
    | 'deliveryStartRender'    // New key
    | 'deliveryTypeRender';    // New key

  header: string;
  isSortable?: boolean;
  sortFunc: (valueA: LabourHistoryTableRow, valueB: LabourHistoryTableRow) => number;
}


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
