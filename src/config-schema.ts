import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  // 1. Encounter Types
  encounterTypes: {
    _type: Type.Object,
    _description: 'List of encounter type UUIDs',
    _default: {
      specializedConsultation: '2b3c4d5e-2234-5678-9101-abcdefghij02', // Consulta Especializada
      deliveryRoomCare: '7g8h9i0j-7234-5678-9101-abcdefghij07', // Atención en Sala de Partos
      hivTestingServices: '8h9i0j1k-8234-5678-9101-abcdefghij08', // Atención de Seguimiento de Enfermedades Crónicas (reemplaza hivTestingServices)
      antenatalControl: '58a87b85-cb6c-4a4c-bc5f-0a2d1e0ff8ba', // Control Prenatal (reemplaza mchMotherConsultation)
      postnatalControl: '2v3w4x5y-2234-5678-9101-abcdefghij22', // Control Postnatal
      healthyChildControl: '3w4x5y6z-3234-5678-9101-abcdefghij23', // Control de Niño Sano
      dentalCare: '4x5y6z7a-4234-5678-9101-abcdefghij24', // Atención de Odontología
      malnutritionAnemiaCare: '7a8b9c0d-7234-5678-9101-abcdefghij27', // Atención de Paciente con Desnutrición y Anemia
      obstetricUltrasound: '8b9c0d1e-8234-5678-9101-abcdefghij28', // Ecografía Obstétrica
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
        encounterTypeUuid: '84d66c25-e2bd-48a2-8686-c1652eb9d283',
      },
      {
        id: 'home-visit-checklist',
        title: 'Home Visit Checklist Form',
        formUuid: 'ac3152de-1728-4786-828a-7fb4db0fc384',
        encounterTypeUuid: 'bfbb5dc2-d3e6-41ea-ad86-101336e3e38f',
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
      labourAndDelivery: '496c7cc3-0eea-4e84-a04c-2292949e2f7f',
      defaulterTracingFormUuid: 'a1a62d1e-2def-11e9-b210-d663bd873d93',
      htsScreening: '04295648-7606-11e8-adc0-fa7ae01bbebc',
      htsInitialTest: '402dc5d7-46da-42d4-b2be-f43ea4ad87b0',
      htsRetest: 'b08471f6-0892-4bf7-ab2b-bf79797b8ea4',
      htsLinkage: '050a7f12-5c52-4cad-8834-863695af335d',
      htsReferral: '9284828e-ce55-11e9-a32f-2a2ae2dbcce4',
      clinicalEncounterFormUuid: 'e958f902-64df-4819-afd4-7fb061f59308',
      peerCalendarOutreactForm: '7492cffe-5874-4144-a1e6-c9e455472a35',
      autopsyFormUuid: '523c711f-f3ef-4723-b4dc-89efa572153f',
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

  // 7. Concepts
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
    //faltan ACTUALIZAR LOS UUIDS
    stoolCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of stools per day',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    stoolGramsUuid: {
      _type: Type.ConceptUuid,
      _description: 'Weight of stool output in grams',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    urineCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of urinations per day',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    urineGramsUuid: {
      _type: Type.ConceptUuid,
      _description: 'Urine output in grams/mL',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    vomitCountUuid: {
      _type: Type.ConceptUuid,
      _description: 'Number of vomiting episodes per day',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    vomitGramsMLUuid: {
      _type: Type.ConceptUuid,
      _description: 'Vomit output in grams/mL',
      _default: 'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    newbornVitalSignsConceptSetUuid: {
      _type: Type.ConceptUuid,
      _description: 'Datos Vitales Recien Nacido Vivo',
      _default: 'a855816a-8bc2-43c8-9cf7-80090dabc47d',
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
        id: 'fertility-clinic',
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
  openmrsIDUuid: {
    _type: Type.String,
    _description: 'SC Identifier UUID',
    _default: '05a29f94-c0ed-11e2-94be-8c13b969e334',
  },

  // 12. Marital Status
  maritalStatusUuid: {
    _type: Type.String,
    _description: 'Marital status concept UUID',
    _default: '1054AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },

  // 13. OpenMRS Identifier Source
  openmrsIdentifierSourceUuid: {
    _type: Type.String,
    _description: 'OpenMRS Identifier Source UUID (Identifier Generator for OpenMRS ID)',
    _default: 'fb034aac-2353-4940-abe2-7bc94e7c1e71',
  },

  // 14. HIV Program
  hivProgramUuid: {
    _type: Type.String,
    _description: 'HIV Program UUID',
    _default: 'dfdc6d40-2f2f-463d-ba90-cc97350441a8',
  },

  // 16. Contact Person Attributes
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
    _description: 'List of Family relationship types (used to list contacts)',
    _default: [
      { uuid: '8d91a210-c2cc-11de-8d13-0010c6dffd0f', display: 'Padre/Hijo' },
      { uuid: '8d91a01c-c2cc-11de-8d13-0010c6dffd0f', display: 'Hermano/Hermana' },
      { uuid: '5c2f978d-3b7d-493c-9e8f-cb3d1c0b6a55', display: 'Abuelo/Nieto' },
      { uuid: '8d91a3dc-c2cc-11de-8d13-0010c6dffd0f', display: 'Tío/Sobrino' },
      { uuid: '6b1c5e8f-32f7-41b3-bc2a-8b3e97a6d937', display: 'Pareja/Conviviente' },
      { uuid: '057de23f-3d9c-4314-9391-4452970739c6', display: 'Tutor/Menor de Edad' },
    ],
  },

  // 19. PNS Relationships
  pnsRelationships: {
    _type: Type.Array,
    _description: 'List of Partner relationships (PNS - Partner Notification Service)',
    _default: [
      { uuid: '6b1c5e8f-32f7-41b3-bc2a-8b3e97a6d937', display: 'Esposo/Esposo', sexual: true },
      { uuid: '1e3f4a5b-6789-4cde-9101-abcdef123457', display: 'Pareja/Pareja', sexual: true },
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
    postnatalControl: string;
    antenatalControl: string;
    deliveryRoomCare: string;
    hivTestingServices: string;
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
    defaulterTracingFormUuid: string;
    htsScreening: string;
    htsInitialTest: string;
    htsRetest: string;
    htsLinkage: string;
    htsReferral: string;
    clinicalEncounterFormUuid: string;
    peerCalendarOutreactForm: string;
    autopsyFormUuid: string;
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
  openmrsIDUuid: string;
  maritalStatusUuid: string;
  openmrsIdentifierSourceUuid: string;
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

  // Additional keys from example
  restrictWardAdministrationToLoginLocation: {
    _type: Type.Boolean;
    _description: string;
    _default: boolean;
  };
  patientListForAdmissionUrl: {
    _type: Type.String;
    _description: string;
    _default: string;
  };
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
