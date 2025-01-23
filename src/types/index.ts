import { type OpenmrsResource } from '@openmrs/esm-framework';

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
  parameterValues?: {};
  livingStatus?: string;
  type?: string;
}

export interface Column {
  name: string;
  key: string;
  type?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  firstname?: string;
  lastname?: string;
  patientId?: number;
}

export interface Concept {
  uuid: string;
  units: string;
  answers: string[];
  hl7Abbrev: string;
  name: string;
  description: string;
  datatype: DataType;
}

export interface SimpleConcept {
  uuid: string;
  display: string;
  answers?: Concept[];
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

export interface DrugOrderDetails {
  selectedDrugs: DropdownValue[];
  selectedCareSetting: DropdownValue;
  activeOnOrBefore: string;
  activeOnOrAfter: string;
  activatedOnOrBefore: string;
  activatedOnOrAfter: string;
}

export type OpenmrsConcept = {
  existingDoses: any[];
  uuid: string;
  display: string;
  setMembers?: Array<OpenmrsConcept>;
  answers?: Array<OpenmrsConcept>;
};

export type Code = {
  code: string;
  system?: string;
  display: string;
};

export type Reference = {
  type: string;
  reference: string;
};

export type FHIRImmunizationResource = {
  resourceType: 'Immunization';
  status: 'completed';
  id: string;
  vaccineCode: { coding: Array<Code> };
  patient: Reference;
  encounter: Reference;
  occurrenceDateTime: Date;
  expirationDate: Date;
  location: Reference;
  performer: Array<{ actor: Reference }>;
  manufacturer: { display: string };
  lotNumber: string;
  protocolApplied: [
    {
      doseNumberPositiveInt: number;
      series?: string;
    },
  ];
};
export type FHIRImmunizationBundleEntry = {
  fullUrl: string;
  resource: FHIRImmunizationResource;
};

export type FHIRImmunizationBundle = {
  resourceType: 'Bundle';
  entry: Array<FHIRImmunizationBundleEntry>;
};

export type ImmunizationSequence = {
  sequenceLabel: string;
  sequenceNumber: number;
};

export type ImmunizationSequenceDefinition = {
  vaccineConceptUuid: string;
  sequences: Array<ImmunizationSequence>;
};

export type ImmunizationWidgetConfigObject = {
  immunizationConceptSet: string;
  sequenceDefinitions: Array<ImmunizationSequenceDefinition>;
};

export type ImmunizationDoseData = {
  immunizationObsUuid: string;
  manufacturer: string;
  lotNumber: string;
  doseNumber: number;
  occurrenceDateTime: string;
  expirationDate: string;
  meta?: {
    encounterUuid?: string;
    location?: string;
  };
};

/*This represents a single consolidated immunization used on the UI with below details
- Vaccine name and uuid
- Existing doese given to patient for that vaccine
- Sequences configured for that vaccine
  */
export type ImmunizationData = {
  vaccineName: string;
  vaccineUuid: string;
  existingDoses: Array<ImmunizationDoseData>;
  sequences?: Array<ImmunizationSequence>;
};


// Código y sistema asociado (e.g., SNOMED, LOINC, etc.)
export type FHIRCode = {
  code: string;
  system?: string; // URL del sistema (e.g., "http://snomed.info/sct")
  display: string;
};

// Referencia a un recurso FHIR relacionado
export type FHIRReference = {
  type: string; // Tipo del recurso (e.g., "Patient", "Practitioner", "Location")
  reference: string; // Referencia al recurso (e.g., "Patient/12345")
  display?: string; // Nombre legible del recurso
};


// Representa un esquema consolidado de vacunación para un paciente
export type ImmunizationScheduleData = {
  scheduleName: string; // Nombre del esquema de vacunación (e.g., "Esquema Nacional").
  scheduleUuid: string; // UUID único que identifica el esquema.
  existingDoses: Array<ImmunizationDoseData>; // Lista de dosis administradas al paciente.
};

// Representa un plan predefinido de vacunación (e.g., Esquema Nacional)
export type VaccinationPlanData = {
  planName: string; // Nombre del plan de vacunación (e.g., "Esquema Nacional de Vacunación").
  planUuid: string; // UUID único del plan.
  plannedSequences: Array<{
    sequenceLabel: string; // Nombre o etiqueta de la secuencia (e.g., "Dosis 1").
    sequenceNumber: number; // Número de secuencia.
    targetAge: {
      value: number; // Edad objetivo para la secuencia.
      unit: 'days' | 'months' | 'years'; // Unidad de tiempo.
    };
  }>;
};

// Representa una recomendación específica para un paciente
export type FHIRImmunizationRecommendation = {
  resourceType: 'ImmunizationRecommendation';
  id: string; // ID único del recurso
  patient: FHIRReference; // Referencia al paciente
  recommendation: Array<{
    vaccineCode: {
      coding: Array<FHIRCode>; // Código de la vacuna recomendada
    };
    targetDisease?: Array<FHIRCode>; // Enfermedades objetivo
    forecastStatus: FHIRCode; // Estado de la recomendación (e.g., "due", "overdue")
    dateCriterion?: Array<{
      code: FHIRCode; // Código que define el criterio (e.g., "earliest date")
      value: string; // Fecha del criterio
    }>;
    supportingImmunization?: Array<FHIRReference>; // Inmunizaciones relacionadas
    supportingPatientInformation?: Array<FHIRReference>; // Información del paciente
  }>;
};

// Entrada del Bundle FHIR de recomendaciones
export type FHIRImmunizationRecommendationBundleEntry = {
  fullUrl: string; // URL completa del recurso
  resource: FHIRImmunizationRecommendation;
};

// Bundle FHIR de recomendaciones de inmunización
export type FHIRImmunizationRecommendationBundle = {
  resourceType: 'Bundle';
  type: 'collection'; // Tipo de Bundle
  entry: Array<FHIRImmunizationRecommendationBundleEntry>;
};

export type SchemasWidgetConfigObject = {
  schemasConceptSet: string;
  sequenceDefinitions: Array<ImmunizationSequenceDefinition>;
};

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

export interface ConceptToFormLabelMap {
  display: string;
  answers: null | Array<string>;
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

export interface Peer {
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
  displayBIsToA: String;
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

export type ReportingPeriod = {
  year: number;
  month: number;
};

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
