// Main components
export {
  EncounterDateTimeSection,
  VisitDateTimeField,
  default as VisitDateTimeSection,
} from './encounter-date-time.component';

// Resource functions and hooks
export {
  getEncountersInDateRange,
  useEncounterDateBoundaries,
  usePatientEncounters,
  validateEncounterDate,
  type EncounterDateTimeData,
} from './encounter-date-time.resource';

// Types
export interface EncounterDateTimeProps {
  control: any;
  patientUuid: string;
  encounterTypeUuid?: string;
  showEncounterValidation?: boolean;
}

export interface EncounterDateTimeSectionProps {
  control: any;
  firstEncounterDateTime?: number;
  lastEncounterDateTime?: number;
  patientUuid?: string;
  encounterTypeUuid?: string;
}

export interface EncounterDateTimeFieldProps {
  dateField: {
    name: string;
    label: string;
  };
  timeField?: {
    name: string;
    label: string;
  };
  timeFormatField?: {
    name: string;
    label: string;
  };
  minDate?: any;
  maxDate?: any;
  disabled?: boolean;
  control?: any;
  showTimeFields?: boolean;
}
