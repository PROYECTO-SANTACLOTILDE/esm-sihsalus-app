import type { OpenmrsResource, FetchResponse, FHIRResource } from '@openmrs/esm-framework';

export interface OpenmrsEncounter extends OpenmrsResource {
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  patient: string;
  location: string;
  encounterProviders?: Array<{
    encounterRole: string;
    provider: { uuid: string; person: { uuid: string; display: string }; name: string };
    display?: string;
  }>;
  obs: Array<OpenmrsResource>;

  form?: { name: string; uuid: string };

  visit?: {
    visitType: {
      uuid: string;
      display: string;
    };
  };
  diagnoses?: Array<{
    uuid: string;
    diagnosis: { coded: { display: string } };
  }>;
}
export interface LocationData {
  display: string;
  uuid: string;
}

export interface Concept {
  uuid: string;
  display: string;
  answers?: Concept[];
}

export interface Observation {
  uuid: string;
  concept: {
    uuid: string;
    display?: string;
    conceptClass?: {
      uuid: string;
      display: string;
    };
    name?: {
      uuid: string;
      name: string;
    };
  };
  display?: string;
  groupMembers: null | Array<{
    uuid: string;
    concept: {
      uuid: string;
      display: string;
    };
    value: any;
    display: string;
  }>;
  value: any;
  obsDatetime?: string;
}

export interface Relationship {
  display: string;
  uuid: string;
  personA: Person;
  personB: Person;
  relationshipType: {
    uuid: string;
    display: string;
    aIsToB: string;
    bIsToA: string;
  };
  startDate: string;
  endDate: string | null;
}

export interface Contact {
  uuid: string;
  name: string;
  display: string;
  relativeAge: number;
  dead: boolean;
  causeOfDeath: string;
  relativeUuid: string;
  relationshipType: string;
  patientUuid: string;
  gender: string;
  contact: string | null;
  startDate: string | null;
  endDate: string | null;
  baselineHIVStatus: string | null;
  personContactCreated: string | null;
  livingWithClient: string | null;
  pnsAproach: string | null;
  ipvOutcome: string | null;
  age: number | null;
}

export interface Person {
  uuid: string;
  age: number;
  dead: boolean;
  display: string;
  causeOfDeath: string;
  gender: string;
  deathDate: string;
  attributes: {
    uuid: string;
    display: string;
    value: string;
    attributeType: {
      uuid: string;
      display: string;
    };
  }[];
}

export interface Patient {
  uuid: string;
  person: Person;
  identifiers: {
    uuid: string;
  }[];
}

export interface RelationShipType {
  uuid: string;
  displayAIsToB: string;
  displayBIsToA: string;
}

export interface Enrollment {
  uuid: string;
  program: {
    name: string;
    uuid: string;
  };
}

export interface HTSEncounter {
  uuid: string;
  display: string;
  encounterDatetime: string;
  obs: {
    uuid: string;
    display: string;
    value: {
      uuid: string;
      display: string;
    };
  }[];
}

export interface BedDetails extends Bed {
  patient: null | {
    uuid: string;
    person: {
      gender: string;
      age: number;
      preferredName: {
        givenName: string;
        familyName: string;
      };
    };
    identifiers: Array<{ identifier: string }>;
  };
}

export type AdmissionLocation = {
  ward: {
    uuid: string;
    display: string;
    name: string;
    description: string;
  };
  totalBeds: number;
  occupiedBeds: number;
  bedLayouts: Array<BedDetails>;
};

export interface Bed {
  id: number;
  bedId: number;
  uuid: string;
  bedNumber: string;
  bedType: {
    uuid: string;
    name: string;
    displayName: string;
    description: string;
    resourceVersion: string;
  };
  row: number;
  column: number;
  status: 'AVAILABLE' | string;
  location: string;
}

export type MappedBedData = Array<{
  id: number;
  number: string;
  name: string;
  description: string;
  status: string;
  uuid: string;
}>;

export interface Encounter {
  uuid: string;
  display: string;
  encounterDatetime: string;
  location: {
    uuid: string;
    display: string;
  };
}

export interface Visit {
  uuid: string;
  display?: string;
  startDatetime: string;
  stopDatetime?: string;
  encounters;
}

export interface ProgramsFetchResponse {
  results: Array<PatientProgram>;
}

export interface PatientProgram {
  uuid: string;
  patient?: DisplayMetadata;
  program: Program;
  display: string;
  dateEnrolled: string;
  dateCompleted: string | null;
  location?: {
    uuid: string;
    display: string;
    links?: Links;
  };
  voided?: boolean;
  outcome?: null;
  states?: ProgramWorkflowState[];
  links?: Links;
  resourceVersion?: string;
}

export interface ProgramWorkflowState {
  state: {
    uuid: string;
    concept: DisplayMetadata;
  };
  startDate: string;
  endDate: string;
  voided: boolean;
}

export type Links = Array<{
  rel: string;
  uri: string;
}>;

export interface DisplayMetadata {
  display?: string;
  links?: Links;
  uuid?: string;
}

export interface Program {
  uuid: string;
  display: string;
  name: string;
  allWorkflows: Array<{
    uuid: string;
    concept: DisplayMetadata;
    retired: boolean;
    states: Array<{
      uuid: string;
      concept: DisplayMetadata;
    }>;
    links?: Links;
  }>;
  concept: {
    uuid: string;
    display: string;
  };
  links?: Links;
}


export interface ConfigurableProgram extends PatientProgram {
  uuid: string;
  display: string;
  enrollmentFormUuid: string;
  discontinuationFormUuid: string;
  enrollmentStatus: string;
  dateEnrolled: string;
  dateCompleted: string;
}

export interface Immunization {
  sequences?: Array<Sequence>;
  existingDoses: Array<ExistingDoses>;
  vaccineName: string;
  vaccineUuid: string;
  immunizationObsUuid?: string;
  manufacturer?: string;
  expirationDate?: string;
  occurrenceDateTime?: string;
  lotNumber?: string;
  doseNumber?: number;
  formChanged?: any;
}

export interface ImmunizationGrouped {
  vaccineName: string;
  vaccineUuid: string;
  existingDoses: Array<ExistingDoses>;
  sequences?: Array<Sequence>;
}

export interface ImmunizationFormState {
  vaccineUuid: string;
  immunizationId?: string;
  vaccinationDate: Date;
  doseNumber: number;
  expirationDate: Date;
  lotNumber: string;
  manufacturer: string;
  visitId?: string;
  locationId?: string;
  providers?: string[];
}

export interface ImmunizationFormData extends ImmunizationFormState {
  patientUuid: string;
  vaccineName: string;
}

export interface Sequence {
  sequenceLabel: string;
  sequenceNumber: string | number;
}

export interface ExistingDoses {
  expirationDate: string;
  immunizationObsUuid: string;
  visitUuid?: string;
  lotNumber: string;
  manufacturer: string;
  occurrenceDateTime: string;
  doseNumber: number;
}
export interface SearchParams {
  query: Query;
}

export interface Query {
  type: string;
  columns: Column[];
  rowFilters: RowFilters[];
  customRowFilterCombination: string;
  name?: string;
  description?: string;
}

export interface RowFilters {
  key?: string;
  parameterValues?: unknown;
  livingStatus?: string;
  type?: string;
}

export interface Column {
  name: string;
  key: string;
  type?: string;
}


export interface DataType {
  uuid: string;
  hl7Abbreviation: string;
  description: string;
  name: string;
}

export interface Cohort {
  id?: string;
  uuid?: string;
  display?: string;
  name: string;
  description: string;
  memberIds?: number[];
}

export interface SearchHistoryItem {
  id: string;
  parameters?: Query;
  results: string;
  description: string;
  patients: Patient[];
}

export interface PaginationData {
  page: number;
  pageSize: number;
}

export interface DropdownValue {
  id: number;
  label: string;
  value: string;
}

export interface SearchByProps {
  onSubmit: (searchParams: SearchParams, queryDescription: string) => Promise<boolean>;
}

export interface Response {
  uuid: string;
  display: string;
  description?: string;
  name?: string;
  id?: string;
}

export interface EncounterDetails {
  onOrAfter: string;
  onOrBefore: string;
  atLeastCount: number;
  atMostCount: number;
  encounterForms: DropdownValue[];
  encounterLocations: DropdownValue[];
  selectedEncounterTypes: DropdownValue[];
}

export interface DefinitionDataRow {
  id: string;
  name: string;
  description: string;
}

export type PatientAppointment = {
  [key: string]: any;
  serviceType: string;
  appointmentDate: string;
  appointmentId: string;
};

export interface AppointmentFilterCalendarProps {
  patientId: string;
  appointmentTypeFilter?: string;
}

export interface FHIRConditionResponse {
  entry: Array<{
    resource: FHIRCondition;
  }>;
  id: string;
  meta: {
    lastUpdated: string;
  };
  resourceType: string;
  total: number;
  type: string;
}

export interface FHIRCondition {
  clinicalStatus: {
    coding: Array<CodingData>;
    display: String;
  };
  code: {
    coding: Array<CodingData>;
  };
  id: string;
  onsetDateTime: string;
  recordedDate: string;
  recorder: {
    display: string;
    reference: string;
    type: string;
  };
  resourceType: string;
  subject: {
    display: string;
    reference: string;
    type: string;
  };
  text: {
    div: string;
    status: string;
  };
  abatementDateTime?: string;
}

export interface CodingData {
  code: string;
  display: string;
  extension?: Array<ExtensionData>;
  system?: string;
}

export interface ExtensionData {
  extension: [];
  url: string;
}

type ReferenceRangeValue = number | null | undefined;

export type FHIRSearchBundleResponse = FetchResponse<{
  entry: Array<FHIRResource>;
  link: Array<{ relation: string; url: string }>;
}>;

export interface ObsReferenceRanges {
  hiAbsolute: ReferenceRangeValue;
  hiCritical: ReferenceRangeValue;
  hiNormal: ReferenceRangeValue;
  lowNormal: ReferenceRangeValue;
  lowCritical: ReferenceRangeValue;
  lowAbsolute: ReferenceRangeValue;
}

export type ObservationInterpretation = 'critically_low' | 'critically_high' | 'high' | 'low' | 'normal';

export type MappedVitals = {
  code: string;
  interpretation: string;
  recordedDate: Date;
  value: number;
};
