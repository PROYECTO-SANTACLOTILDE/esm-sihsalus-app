export type OpenmrsConcept = {
  existingDoses: any[];
  uuid: string;
  display: string;
  setMembers?: Array<OpenmrsConcept>;
  answers?: Array<OpenmrsConcept>;
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

// Representa una dosis de inmunización ya administrada al paciente
export type ImmunizationDoseData = {
  immunizationObsUuid: string; // UUID único de la observación
  manufacturer: string; // Fabricante de la vacuna
  lotNumber: string; // Lote de la vacuna
  doseNumber: number; // Número de dosis
  occurrenceDateTime: string; // Fecha y hora de administración
  expirationDate: string; // Fecha de expiración de la vacuna
  meta?: {
    encounterUuid?: string; // UUID del encuentro
    location?: string; // Ubicación del encuentro
  };
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

// Secuencia de vacunación en un esquema predefinido
export type ImmunizationSequence = {
  sequenceLabel: string; // Nombre o etiqueta de la secuencia (e.g., "Dosis 1").
  sequenceNumber: number; // Número de secuencia.
};

// Definición de una secuencia de vacunación dentro de un esquema
export type ImmunizationSequenceDefinition = {
  vaccineConceptUuid: string; // UUID del concepto asociado a la vacuna
  sequences: Array<ImmunizationSequence>; // Lista de secuencias configuradas para esta vacuna
};

export type ImmunizationData = {
  vaccineName: string;
  vaccineUuid: string;
  existingDoses: Array<ImmunizationDoseData>;
  sequences?: Array<ImmunizationSequence>;
};
