import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  // 1. Tipos de Encuentro
  encounterTypes: {
    _type: Type.Object,
    _description: 'List of encounter type UUIDs',
    _default: {
      specializedConsultation: '2b3c4d5e-2234-5678-9101-abcdefghij02', // Consulta Especializada
      triage: '67a71486-1a54-468f-ac3e-7091a9a79584', // Triaje
      deliveryRoomCare: '7g8h9i0j-7234-5678-9101-abcdefghij07', // Atención en Sala de Partos
      hivTestingServices: '8h9i0j1k-8234-5678-9101-abcdefghij08', // Atención de Seguimiento de Enfermedades Crónicas (reemplaza hivTestingServices)
      prenatalControl: '58a87b85-cb6c-4a4c-bc5f-0a2d1e0ff8ba', // Control Prenatal (reemplaza mchMotherConsultation)
      postnatalControl: '2v3w4x5y-2234-5678-9101-abcdefghij22', // Control Postnatal
      healthyChildControl: '3w4x5y6z-3234-5678-9101-abcdefghij23', // Control de Niño Sano
      dentalCare: '4x5y6z7a-4234-5678-9101-abcdefghij24', // Atención de Odontología
      malnutritionAnemiaCare: '7a8b9c0d-7234-5678-9101-abcdefghij27', // Atención de Paciente con Desnutrición y Anemia
      obstetricUltrasound: '8b9c0d1e-8234-5678-9101-abcdefghij28', // Ecografía Obstétrica
      externalConsultation: '1a2b3c4d-1234-5678-9101-abcdefghij01', // Consulta Externa
      hospitalization: '4d5e6f7g-4234-5678-9101-abcdefghij04', // Hospitalización
      hospitalDischarge: '5e6f7g8h-5234-5678-9101-abcdefghij05', // Alta Hospitalaria
      emergencyCare: '6f7g8h9i-6234-5678-9101-abcdefghij06', // Atención en Emergencia
      chronicDiseaseFollowup: '8h9i0j1k-8234-5678-9101-abcdefghij08', // Atención de Seguimiento de Enfermedades Crónicas (already exists, but keeping for clarity)
      mentalHealthEvaluation: '9i0j1k2l-9234-5678-9101-abcdefghij09', // Evaluación de Salud Mental
      medicationPrescriptionDispensation: '0j1k2l3m-0234-5678-9101-abcdefghij10', // Prescripción y Dispensación de Medicamentos
      labResults: '1k2l3m4n-1234-5678-9101-abcdefghij11', // Resultados de Laboratorio
      vaccinationAdministration: '29c02aff-9a93-46c9-bf6f-48b552fcb1fa', // Administración de Vacunas
      healthEducationCounseling: '3m4n5o6p-3234-5678-9101-abcdefghij13', // Educación y Consejería en Salud
      consultation: '4n5o6p7q-4234-5678-9101-abcdefghij14', // Interconsulta
      referralCounterReferral: '5o6p7q8r-5234-5678-9101-abcdefghij15', // Referencia y Contrarreferencia
      intraHospitalTransfer: '6p7q8r9s-6234-5678-9101-abcdefghij16', // Traslado Intra-Hospitalario
      bedAssignment: '7q8r9s0t-7234-5678-9101-abcdefghij17', // Asignación de Cama
      hospitalizationProgressNote: '8r9s0t1u-8234-5678-9101-abcdefghij18', // Nota de Evolución de Hospitalización
      transferRequest: '9s0t1u2v-9234-5678-9101-abcdefghij19', // Solicitud de Traslado
      encounterCancellation: '0t1u2v3w-0234-5678-9101-abcdefghij20', // Anulación de Encuentro
      clinicalFileUpload: '5y6z7a8b-5234-5678-9101-abcdefghij25', // Carga de Archivos Clínicos
      tbTreatmentSupervision: '6z7a8b9c-6234-5678-9101-abcdefghij26', // Supervisión de Tratamiento DOT (Tuberculosis)
      covid19Management: '9c0d1e2f-9234-5678-9101-abcdefghij29', // Manejo de Personas Afectadas por COVID-19
      electiveAmbulatorySurgery: '0d1e2f3g-0234-5678-9101-abcdefghij30', // Atención de Salud Ambulatoria Quirúrgica Electiva
      order: '39da3525-afe4-45ff-8977-c53b7b359158', // Orden
    },
  },

  // 2. Case Management Forms
  caseManagementForms: {
    _type: Type.Array,
    _description: 'List of form and encounter UUIDs',
    _default: [
      {
        id: 'high-iit-intervention',
        title: 'High IIT Intervention Form',
        formUuid: '6817d322-f938-4f38-8ccf-caa6fa7a499f',
        encounterTypeUuid: '7a8b9c0d-7234-5678-9101-abcdefghij27',
      },
      {
        id: 'home-visit-checklist',
        title: 'Home Visit Checklist Form',
        formUuid: 'ac3152de-1728-4786-828a-7fb4db0fc384',
        encounterTypeUuid: '5o6p7q8r-5234-5678-9101-abcdefghij15',
      },
    ],
  },

  // 3. Forms List
  formsList: {
    _type: Type.Object,
    _description: 'List of form UUIDs',
    _default: {
      antenatal: 'e8f98494-af35-4bb8-9fc7-c409c8fed843',
      postNatal: '72aa78e0-ee4b-47c3-9073-26f3b9ecc4a7',
      atencionImmediataNewborn: '(Página 5) ATENCIÓN INMEDIATA DEL RECIÉN NACIDO',
      maternalHistory: 'OBST-001-ANTECEDENTES',
      currentPregnancy: 'OBST-002-EMBARAZO ACTUAL',
      prenatalCare: 'OBST-003-ATENCIÓN PRENATAL',
      //Pendientes
      labourAndDelivery: '496c7cc3-0eea-4e84-a04c-2292949e2f7f',
      defaulterTracingFormUuid: 'a1a62d1e-2def-11e9-b210-d663bd873d93',
      htsScreening: '04295648-7606-11e8-adc0-fa7ae01bbebc',
      htsInitialTest: '402dc5d7-46da-42d4-b2be-f43ea4ad87b0',
      htsRetest: 'b08471f6-0892-4bf7-ab2b-bf79797b8ea4',
      clinicalEncounterFormUuid: 'e958f902-64df-4819-afd4-7fb061f59308',

      // CRED
      breastfeedingObservation:
        '(Página 8) Ficha de Observación del Amamantamiento de la Consejería en Lactancia Materna',
      eedp12Months: 'Página (30, 31, 32 y 33) EEDP (12 meses)',
      tepsi: '(Página 34, 35 y 36) TEPSI',
      medicalProgressNote: '(Página 14) Nota de Evolución Médica',
      eedp5Months: 'Página (30, 31, 32 y 33) EEDP (5 meses)',
      eedp21Months: 'Página (30, 31, 32 y 33) EEDP (21 meses)',
      nursingAssessment: '(Página 11 y 12) Valoración de Enfermería',
      medicalOrders: '(Página 13) Órdenes Médicas',
      newbornNeuroEval: '(Página 6) EVALUACIÓN CÉFALO-CAUDAL Y NEUROLÓGICO DEL RECIÉN NACIDO',
      eedp15Months: 'Página (30, 31, 32 y 33) EEDP (15 meses)',
      riskInterview0to30: '(Página 19) PRIMERA ENTREVISTA EN BUSCA DE FACTORES DE RIESGO (0 - 30 meses)',
      eedp8Months: 'Página (30, 31, 32 y 33) EEDP (8 meses)',
      roomingIn: '(Página 10) Alojamiento Conjunto',
      eedp18Months: 'Página (30, 31, 32 y 33) EEDP (18 meses)',
      eedp2Months: 'Página (30, 31, 32 y 33) EEDP (2 meses)',
      childFeeding6to42: '(Página 20) Evaluación de la alimentación del niño/niña (6 - 42 meses)',
      childAbuseScreening: '(Página 37) Ficha de Tamizaje Violencia y maltrato infantil',
      epicrisis: '(Página 16) Epicrisis',
      childFeeding0to5: '(Página 20) Evaluación de la alimentación del niño/niña (0 - 5 meses)',
      // OTROS
      puerperiumLab: '(Página 4 y 5) Puerperio - Laboratorio',
      obstetricMonitor: 'HOSP-011-HOJA DE MONITORIZACIÓN OBSTÉTRICA',
      obstetricHistory: 'HOSP-002-HISTORIA CLÍNICA OBSTÉTRICA',
      obstetricProgress: 'HOSP-005-EVOLUCIÓN OBSTÉTRICA',
      obstetricAntecedents: 'OBST-001-ANTECEDENTES',
      medicalProgress: 'HOSP-004-EVOLUCIÓN MÉDICA',
      nursingNotes: 'HOSP-009-NOTAS DE ENFERMERÍA',
      therapeuticSheet: 'HOSP-008-HOJA TERAPÉUTICA',
      birthPlanForm: 'OBST-004-FICHA PLAN DE PARTO',
      vitalSignsControl: 'HOSP-001-CONTROL DE FUNCIONES VITALES',
      birthSummary: 'HOSP-007-RESUMEN DE PARTO',
      puerperiumEpicrisis: '(Página 12) Puerperio - Epicrisis',
      puerperiumDischarge: '(Página 14) Puerperio - Informe de Alta',
      clinicalHistory: 'HOSP-003-HISTORIA CLÍNICA OBSTÉTRICA',
    },
  },

  // 4. Defaulter Tracing Encounter
  defaulterTracingEncounterUuid: {
    _type: Type.String,
    _description: 'Encounter UUID for defaulter tracing',
    _default: '1495edf8-2df2-11e9-b210-d663bd873d93',
  },

  // 6. Clinical Encounter
  clinicalEncounterUuid: {
    _type: Type.String,
    _description: 'Clinical Encounter UUID',
    _default: '465a92f2-baf8-42e9-9612-53064be868e8',
  },

  // 7. Concepts (TO REVIEW)
  concepts: {
    probableCauseOfDeathConceptUuid: {
      _type: Type.ConceptUuid,
      _description:
        'Probable cause of death for a given patient determined from interviewing a family member or other non-medical personnel',
      _default: '1599AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    problemListConceptUuid: {
      _type: Type.ConceptUuid,
      _description: 'List of given problems for a given patient',
      _default: '1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },

    systolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    temperatureUuid: {
      _type: Type.ConceptUuid,
      _default: '5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    oxygenSaturationUuid: {
      _type: Type.ConceptUuid,
      _default: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    weightUuid: {
      _type: Type.ConceptUuid,
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    respiratoryRateUuid: {
      _type: Type.ConceptUuid,
      _default: '5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    //liquidos
    stoolCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of stools per day',
      _default: 'f2f19bb7-e92f-4658-bfc9-0dbf63837cca',
    },
    stoolGramsUuid: {
      _type: Type.ConceptUuid,
      _description: 'Weight of stool output in grams',
      _default: 'e2365f75-d2d5-4950-925c-d87ad9e6c4d3',
    },
    urineCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of urinations per day',
      _default: 'c3dd9ed2-592e-43a7-a1e8-e010b12f1dd0',
    },
    urineGramsUuid: {
      _type: Type.ConceptUuid,
      _description: 'Urine output in grams/mL',
      _default: '4a275a66-ea18-4ee6-a967-c2bc4a2ff607',
    },
    vomitCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of vomiting episodes per day',
      _default: '4249ecea-d5b1-4541-ba42-48e9f2f968cd',
    },
    vomitGramsMLUuid: {
      _type: Type.ConceptUuid,
      _description: 'Vomit output in grams/mL',
      _default: 'db881ca6-26ff-46df-aac5-3f9a0efd67d4',
    },
    //antropometricos
    heightUuid: {
      _type: Type.ConceptUuid,
      _description: 'Height or length measurement of the patient',
      _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    headCircumferenceUuid: {
      _type: Type.ConceptUuid,
      _description: 'Head circumference measurement of the patient',
      _default: 'c4d39248-c896-433a-bc69-e24d04b7f0e5',
    },
    chestCircumferenceUuid: {
      _type: Type.ConceptUuid,
      _description: 'Chest circumference measurement of the patient',
      _default: '911eb398-e7de-4270-af63-e4c615ec22a9',
    },
    newbornVitalSignsConceptSetUuid: {
      _type: Type.ConceptUuid,
      _description: 'Datos Vitales Recien Nacido Vivo',
      _default: 'a855816a-8bc2-43c8-9cf7-80090dabc47d',
    },
  },

  madreGestante: {
    gravidezUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número total de veces que una mujer ha estado embarazada (Gravidez)',
      _default: 'f96649ed-fca4-4b97-a9c2-509a1bd14f54', // Concepto "Gestaciones"
    },
    //paridad
    partoAlTerminoUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número de partos a término (≥37 semanas de gestación)',
      _default: '8795c05b-f286-4d70-a1e6-69172e676f05', // Concepto "Partos a término"
    },
    partoPrematuroUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número de partos prematuros (20-36 semanas de gestación)',
      _default: 'e08c2bfd-c3c9-4b46-afcf-e83e2a12c23f', // Concepto "Partos prematuros"
    },
    partoAbortoUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número de abortos (pérdidas antes de las 20 semanas de gestación)',
      _default: 'dbfad4ff-1b0c-4823-b80a-3864e1d81e94', // Concepto "Abortos"
    },
    partoNacidoVivoUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número de nacidos vivos',
      _default: '45465ea4-2e1b-474b-b0f9-4f4bc676fbf5', // Concepto "Nacidos vivos"
    },
    partoNacidoMuertoUuid: {
      _type: Type.ConceptUuid,
      _description: 'Número de nacidos muertos',
      _default: '4dc3ee54-ba0c-49e7-b907-02aa727372f4', // Concepto "Nacidos muertos"
    },

    gtpalConceptSetUuid: {
      _type: Type.ConceptUuid,
      _description: 'Concept set para el sistema GTPAL (Gravidez, Términos, Prematuros, Abortos, Vivos)',
      _default: '43244943-3df5-4640-a348-9131c8e47857', // UUID único para el concept set GTPAL
    },
    /**
    EGFechaUltimaRegla: {
      _type: Type.ConceptUuid,
      _description: 'Fecha de la última menstruación (FUR) para calcular la edad gestacional',
      _default: '57634c13-00a8-4764-93ec-dab90b6d20ce', // Concepto "Fecha de la última regla"
    },

    riskAntecedentsConceptSetUuid: {
      _type: Type.ConceptUuid,
      _description: 'Concept set para antecedentes de riesgo en el embarazo',
      _default: 'b20b322f-3d83-45aa-8169-a4a66afaf5f2', // UUID único para el concept set de antecedentes de riesgo
    },
    **/
  },

  // Niño sano
  CRED: {
    perinatalConceptSetUuid: {
      _type: Type.ConceptUuid,
      _description: 'Concept set para el seguimiento del niño sano',
      _default: 'ninio-sano-concept-set-uuid', // UUID único para el concept set de niño sano
    },
  },

  vitals: {
    useFormEngine: {
      _type: Type.Boolean,
      _default: false,
      _description:
        'Whether to use an Ampath form as the vitals and biometrics form. If set to true, encounterUuid and formUuid must be set as well.',
    },
    encounterTypeUuid: {
      _type: Type.UUID,
      _default: '2v3w4x5y-2234-5678-9101-abcdefghij22',
    },
    logo: {
      src: {
        _type: Type.String,
        _default: null,
        _description: 'A path or URL to an image. Defaults to the OpenMRS SVG sprite.',
      },
      alt: {
        _type: Type.String,
        _default: 'Logo',
        _description: 'Alt text, shown on hover',
      },
      name: {
        _type: Type.String,
        _default: null,
        _description: 'The organization name displayed when image is absent',
      },
    },
    showPrintButton: {
      _type: Type.Boolean,
      _default: false,
      _description:
        'Determines whether or not to display the Print button in the vitals datatable header. If set to true, a Print button gets shown as the right-most item in the table header. When clicked, this button enables the user to print out the contents of the table',
    },
    formUuid: {
      _type: Type.UUID,
      _default: '9f26aad4-244a-46ca-be49-1196df1a8c9a',
    },
    formName: {
      _type: Type.String,
      _default: 'Vitals',
    },
    useMuacColors: {
      _type: Type.Boolean,
      _default: false,
      _description: 'Whether to show/use MUAC color codes. If set to true, the input will show status colors.',
    },
  },

  biometrics: {
    bmiUnit: {
      _type: Type.String,
      _default: 'kg / m²',
    },
  },

  // 8. Special Clinics
  specialClinics: {
    _type: Type.Array,
    _description: 'List of special clinics',
    _default: [
      {
        id: 'dental-clinic',
        title: 'Atención de Odontología',
        formUuid: '4x5y6z7a-4234-5678-9101-abcdefghij24',
        encounterTypeUuid: '4x5y6z7a-4234-5678-9101-abcdefghij24',
      },
      {
        id: 'psicologia-clinic',
        title: 'Psicologia',
        formUuid: '32e43fc9-6de3-48e3-aafe-3b92f167753d',
        encounterTypeUuid: '9i0j1k2l-9234-5678-9101-abcdefghij09',
      },
      {
        id: 'physiotherapy-clinic',
        title: 'Terapia Fisica',
        formUuid: 'fdada8da-75fe-44c6-93e1-782d41e5565b',
        encounterTypeUuid: '465a92f2-baf8-42e9-9612-53064be868e8',
      },
    ],
  },

  // 9. Registration Encounter
  registrationEncounterUuid: {
    _type: Type.String,
    _description: 'Registration encounter UUID',
    _default: 'de1f9d67-b73e-4e1b-90d0-036166fc6995',
  },

  // 10. Registration Obs
  registrationObs: {
    encounterTypeUuid: {
      _type: Type.UUID,
      _default: null,
      _description:
        'Obs created during registration will be associated with an encounter of this type. Required for fields of type `obs`.',
    },
    encounterProviderRoleUuid: {
      _type: Type.UUID,
      _default: 'a0b03050-c99b-11e0-9572-0800200c9a66',
      _description: "Provider role to use for the registration encounter. Default is 'Unknown'.",
    },
    registrationFormUuid: {
      _type: Type.UUID,
      _default: null,
      _description: 'Form UUID to associate with the registration encounter. By default, none.',
    },
  },

  // 11. OpenMRS ID
  defaultIDUuid: {
    _type: Type.String,
    _description: 'HSC Identifier UUID',
    _default: '05a29f94-c0ed-11e2-94be-8c13b969e334',
  },

  // 12. Marital Status
  maritalStatusUuid: {
    _type: Type.String,
    _description: 'Marital status concept UUID',
    _default: 'aa345a81-3811-4e9c-be18-d6be727623e0',
  },

  // 13. IDgEN Identifier Source
  defaultIdentifierSourceUuid: {
    _type: Type.String,
    _description: 'IdGen de Identificador HSC',
    _default: '8549f706-7e85-4c1d-9424-217d50a2988b',
  },

  // 14. HIV Program
  hivProgramUuid: {
    _type: Type.String,
    _description: 'HIV Program UUID',
    _default: 'dfdc6d40-2f2f-463d-ba90-cc97350441a8',
  },

  // 16. Contact Person Attributes (TO BE DEFINED)
  contactPersonAttributesUuid: {
    _type: Type.Object,
    _description: 'Contact created patient attributes UUID',
    _default: {
      telephone: 'b2c38640-2603-4629-aebd-3b54f33f1e3a',
      baselineHIVStatus: '3ca03c84-632d-4e53-95ad-91f1bd9d96d6',
      contactCreated: '7c94bd35-fba7-4ef7-96f5-29c89a318fcf',
      preferedPnsAproach: '59d1b886-90c8-4f7f-9212-08b20a9ee8cf',
      livingWithContact: '35a08d84-9f80-4991-92b4-c4ae5903536e',
      contactIPVOutcome: '49c543c2-a72a-4b0a-8cca-39c375c0726f',
    },
  },

  // 17. Family Relationship Types
  familyRelationshipsTypeList: {
    _type: Type.Array,
    _description: 'Lista de relaciones familiares (used to list contacts)',
    _default: [
      { uuid: '8d91a210-c2cc-11de-8d13-0010c6dffdff', display: 'Madre' },
      { uuid: '8d91a210-c2cc-11de-8d13-0010c6dffd0f', display: 'Padre' },
      { uuid: '8d91a01c-c2cc-11de-8d13-0010c6dffd0f', display: 'Hermano/Hermana' },
      { uuid: '5c2f978d-3b7d-493c-9e8f-cb3d1c0b6a55', display: 'Abuelo' },
      { uuid: '8d91a3dc-c2cc-11de-8d13-0010c6dffd0f', display: 'Tío' },
      { uuid: '8d91a3dc-c2cc-11de-8d13-0010c6dffd00', display: 'Sobrino' },
      { uuid: 'a2b5c9f8-0d2a-4bdf-8d9b-6f3b2d1e5a2f', display: 'Otro' },
    ],
  },

  // 18. PNS Relationships
  pnsRelationships: {
    _type: Type.Array,
    _description: 'List of Partner relationships (PNS - Partner Notification Service)',
    _default: [
      { uuid: '6b1c5e8f-32f7-41b3-bc2a-8b3e97a6d937', display: 'Esposo', sexual: true },
      { uuid: '1e3f4a5b-6789-4cde-9101-abcdef123457', display: 'Pareja/Pareja', sexual: true },
      { uuid: 'a2b5c9f8-0d2a-4bdf-8d9b-6f3b2d1e5a2f', display: 'Otro' },
    ],
  },
};

// --------------- INTERFACES ---------------
export interface BiometricsConfigObject {
  bmiUnit: string;
  heightUnit: string;
  weightUnit: string;
}

export interface ConfigObject {
  encounterTypes: {
    specializedConsultation: string;
    triage: string;
    deliveryRoomCare: string;
    hivTestingServices: string;
    prenatalControl: string;
    postnatalControl: string;
    healthyChildControl: string;
    dentalCare: string;
    malnutritionAnemiaCare: string;
    obstetricUltrasound: string;
    externalConsultation: string;
    hospitalization: string;
    hospitalDischarge: string;
    emergencyCare: string;
    chronicDiseaseFollowup: string;
    mentalHealthEvaluation: string;
    medicationPrescriptionDispensation: string;
    labResults: string;
    vaccinationAdministration: string;
    healthEducationCounseling: string;
    consultation: string;
    referralCounterReferral: string;
    intraHospitalTransfer: string;
    bedAssignment: string;
    hospitalizationProgressNote: string;
    transferRequest: string;
    encounterCancellation: string;
    clinicalFileUpload: string;
    tbTreatmentSupervision: string;
    covid19Management: string;
    electiveAmbulatorySurgery: string;
    order: string;
  };
  vitals: {
    useFormEngine: boolean;
    encounterTypeUuid: string;
    formUuid: string;
    formName: string;
    useMuacColors: boolean;
    showPrintButton: boolean;
  };
  biometrics: BiometricsConfigObject;
  madreGestante: Record<string, string>;
  CRED: Record<string, string>;
  caseManagementForms: Array<{
    id: string;
    title: string;
    formUuid: string;
    encounterTypeUuid: string;
  }>;
  formsList: {
    antenatal: string;
    postnatal: string;
    labourAndDelivery: string;
    atencionImmediataNewborn: string;
    maternalHistory: string;
    currentPregnancy: string;
    prenatalCare: string;
    defaulterTracingFormUuid: string;
    htsScreening: string;
    htsInitialTest: string;
    htsRetest: string;
    clinicalEncounterFormUuid: string;
    breastfeedingObservation: string;
    eedp12Months: string;
    tepsi: string;
    medicalProgressNote: string;
    eedp5Months: string;
    eedp21Months: string;
    nursingAssessment: string;
    medicalOrders: string;
    newbornNeuroEval: string;
    eedp15Months: string;
    riskInterview0to30: string;
    eedp8Months: string;
    roomingIn: string;
    eedp18Months: string;
    eedp2Months: string;
    childFeeding6to42: string;
    childAbuseScreening: string;
    epicrisis: string;
    childFeeding0to5: string;
    puerperiumLab: string;
    obstetricMonitor: string;
    obstetricHistory: string;
    obstetricProgress: string;
    obstetricAntecedents: string;
    medicalProgress: string;
    nursingNotes: string;
    therapeuticSheet: string;
    birthPlanForm: string;
    vitalSignsControl: string;
    birthSummary: string;
    puerperiumEpicrisis: string;
    puerperiumDischarge: string;
    clinicalHistory: string;
  };
  defaulterTracingEncounterUuid: string;
  clinicalEncounterUuid: string;
  concepts: Record<string, string>;
  specialClinics: Array<{
    id: string;
    formUuid: string;
    encounterTypeUuid: string;
    title: string;
  }>;
  registrationEncounterUuid: string;
  registrationObs: {
    encounterTypeUuid: string | null;
    encounterProviderRoleUuid: string;
    registrationFormUuid: string | null;
  };
  defaultIDUuid: string;
  maritalStatusUuid: string;
  defaultIdentifierSourceUuid: string;
  hivProgramUuid: string;
  contactPersonAttributesUuid: {
    telephone: string;
    baselineHIVStatus: string;
    contactCreated: string;
    preferedPnsAproach: string;
    livingWithContact: string;
    contactIPVOutcome: string;
  };
  familyRelationshipsTypeList: Array<{
    uuid: string;
    display: string;
  }>;
  pnsRelationships: Array<{
    uuid: string;
    display: string;
    sexual: boolean;
  }>;
}

export interface PartograpyComponents {
  id: string;
  date: string;
  fetalHeartRate: number;
  cervicalDilation: number;
  descentOfHead: string;
}

export interface ConfigPartographyObject {
  concepts: {
    obsDateUiid: string;
    timeRecordedUuid: string;
    fetalHeartRateUuid: string;
    cervicalDilationUiid: string;
    descentOfHead: string;
  };
}
