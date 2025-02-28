// 1. CARE SETTING
export const careSetting = '6f0c9a92-6f24-11e3-af88-005056821db0';

// 2. BASE PATH
export const basePath = '${openmrsSpaBase}/patient/';

// 3. ENCOUNTER REPRESENTATIONS
export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

export const clinicalEncounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),diagnoses:(uuid,diagnosis:(coded:(display))),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

// 4. PATIENT TRACING
export const PatientTracingFormName = 'Patient Tracing Form';
export const MissedAppointmentDate_UUID = '164093AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const TracingType_UUID = 'a55f9516-ddb6-47ec-b10d-cb99d1d0bd41';
export const TracingNumber_UUID = '1639AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Contacted_UUID = '160721AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const ReasonNotContacted_UUID = '166541AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const TracingOutcome_UUID = '160433AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const PatientTracingEncounterType_UUID = '1495edf8-2df2-11e9-b210-d663bd873d93';

// 5. CLINICAL ENCOUNTERS & FORMS
export const ClinicalEncounterFormUuid = 'e958f902-64df-4819-afd4-7fb061f59308';
export const PartographEncounterFormUuid = 'd4c4dcfa-5c7b-4727-a7a6-f79a3b2c2735';

// 6. ADMISSION DETAILS
export const AdmissionDate_UUID = '1640AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const PriorityOfAdmission_UUID = '1655AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
// export const AdmittingDoctor_UUID= '';
export const AdmissionWard_UUID = '5fc29316-0869-4b3b-ae2f-cc37c6014eb7';
export const MchEncounterType_UUID = 'c6d09e05-1f25-4164-8860-9f32c5a02df0';

// 7. SOCIAL HISTORY
export const Alcohol_Use_UUID = '159449AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Alcohol_Use_Duration_UUID = '1546AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Smoking_UUID = '163201AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Smoking_Duration_UUID = '159931AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Other_Substance_Abuse_UUID = '163731AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

// 8. MEDICAL HISTORY
export const SURGICAL_HISTORY_UUID = '30fe6669-75f3-4a1d-89c3-753a060d559a';
export const ACCIDENT_TRAUMA_UUID = '159520AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const BLOOD_TRANSFUSION_UUID = '161927AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const CHRONIC_DISEASE_UUID = '1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

// 9. DELIVERY
export const ModeOfDelivery_UUID = '5630AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const GestationalSize_UUID = '1789AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const BirthAbnormally_UUID = '164122AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const BloodLoss_UUID = '161928AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const GivenVitaminK_UUID = '984AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const DeliveryForm_UUID = 'Gonzalo';
export const Form_NOMBRE = 'Sample Form';

// 0. CRED
export const Pagina_10_Alojamiento_Conjunto = 'Pagina_10_Alojamiento_Conjunto';
export const Pagina_11_Y_12_Valoracion_De_Enfermeria = 'Pagina_11_Y_12_Valoracion_De_Enfermeria';
export const Pagina_13_Ordenes_Medicas = 'Pagina_13_Ordenes_Medicas';
export const Pagina_14_Nota_De_Evolucion_Medica = 'Pagina_14_Nota_De_Evolucion_Medica';
export const Pagina_16_Epicrisis = 'Pagina_16_Epicrisis';
export const Pagina_19_Primera_Entrevista_En_Busca_De_Factores_De_Riesgo_0_30_Meses =
  'Pagina_19_Primera_Entrevista_En_Busca_De_Factores_De_Riesgo_0_30_Meses';
export const Pagina_20_Evaluacion_De_La_Alimentacion_Del_Nino_nina_0_5_Meses =
  'Pagina_20_Evaluacion_De_La_Alimentacion_Del_Nino_nina_0_5_Meses';
export const Pagina_20_Evaluacion_De_La_Alimentacion_Del_Nino_nina_6_42_Meses =
  'Pagina_20_Evaluacion_De_La_Alimentacion_Del_Nino_nina_6_42_Meses';
export const Pagina_34_35_Y_36_Tepsi_Opcion_Antigua = 'Pagina_34_35_Y_36_Tepsi_Opcion_Antigua';
export const Pagina_34_35_Y_36_Tepsi = 'Pagina_34_35_Y_36_Tepsi';
export const Pagina_37_Ficha_De_Tamizaje_Violencia_Y_Maltrato_Infantil =
  'Pagina_37_Ficha_De_Tamizaje_Violencia_Y_Maltrato_Infantil';
export const Pagina_5_Atencion_Inmediata_Del_Recien_Nacido = 'Pagina_5_Atencion_Inmediata_Del_Recien_Nacido';
export const Pagina_6_Evaluacion_Cefalocaudal_Y_Neurologico_Del_Recien_Nacido = 'bb6d43a2-ff56-4d20-929d-c30c28d1d569';
export const Pagina_8_Ficha_De_Observacion_Del_Amamantamiento_De_La_Consejeria_En_Lactancia_Materna =
  'Pagina_8_Ficha_De_Observacion_Del_Amamantamiento_De_La_Consejeria_En_Lactancia_Materna';
export const Pagina_30_31_32_Y_33_Eedp_12_Meses = 'Pagina_30_31_32_Y_33_Eedp_12_Meses';
export const Pagina_30_31_32_Y_33_Eedp_15_Meses = 'Pagina_30_31_32_Y_33_Eedp_15_Meses';
export const Pagina_30_31_32_Y_33_Eedp_18_Meses = 'Pagina_30_31_32_Y_33_Eedp_18_Meses';
export const Pagina_30_31_32_Y_33_Eedp_2_Meses = 'Pagina_30_31_32_Y_33_Eedp_2_Meses';
export const Pagina_30_31_32_Y_33_Eedp_21_Meses = 'Pagina_30_31_32_Y_33_Eedp_21_Meses';
export const Pagina_30_31_32_Y_33_Eedp_5_Meses = 'Pagina_30_31_32_Y_33_Eedp_5_Meses';
export const Pagina_30_31_32_Y_33_Eedp_8_Meses = 'Pagina_30_31_32_Y_33_Eedp_8_Meses';

// 10. PARTOGRAPHY
export const Progress_UUID = '160116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const OneTime_UUID = '162135AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Tier_UUID = '166065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const TierThree_UUID = '166066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const TierFour_UUID = '166067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const Hours72To120 = '163734AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const DeviceRecorded = '163286AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const FetalHeartRate = '1440AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const CervicalDilation = '162261AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const SurgicalProcedure = '1810AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const descentOfHeadObj = {
  '162135AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '1/5',
  '166065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '2/5',
  '166066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '3/5',
  '166067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '4/5',
  '163734AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '5/5',
};

// 11. FORMATTING
export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

// 12. SPA PATHS & APP INFO
export const spaRoot = window['getOpenmrsSpaBase'];
export const spaHomePage = `${window.spaBase}/home`;
export const appointmentLocationTagName = 'Appointment Location';
export const moduleName = '@openmrs/esm-appointments-app';

// 13. DATE PICKERS
export const datePickerPlaceHolder = 'dd/mm/yyyy';
export const dateFormat = 'DD/MM/YYYY';
export const datePickerFormat = 'd/m/Y';

// 14. WEEKDAYS
export const weekDays = [
  { id: 'MONDAY', label: 'Monday', labelCode: 'monday', order: 0 },
  { id: 'TUESDAY', label: 'Tuesday', labelCode: 'tuesday', order: 1 },
  { id: 'WEDNESDAY', label: 'Wednesday', labelCode: 'wednesday', order: 2 },
  { id: 'THURSDAY', label: 'Thursday', labelCode: 'thursday', order: 3 },
  { id: 'FRIDAY', label: 'Friday', labelCode: 'friday', order: 4 },
  { id: 'SATURDAY', label: 'Saturday', labelCode: 'saturday', order: 5 },
  { id: 'SUNDAY', label: 'Sunday', labelCode: 'sunday', order: 6 },
];

// 15. NEWBORN MONITORING PERIODS
export const newbornDayPeriodSlots = [
  {
    id: 'DAY1_M',
    label: 'Day 1 Morning',
    day: 1,
    period: 'M',
    order: 0,
    labelCode: 'day1_morning',
  },
  {
    id: 'DAY1_T',
    label: 'Day 1 Afternoon',
    day: 1,
    period: 'T',
    order: 1,
    labelCode: 'day1_afternoon',
  },
  {
    id: 'DAY1_N',
    label: 'Day 1 Night',
    day: 1,
    period: 'N',
    order: 2,
    labelCode: 'day1_night',
  },
  {
    id: 'DAY2_M',
    label: 'Day 2 Morning',
    day: 2,
    period: 'M',
    order: 3,
    labelCode: 'day2_morning',
  },
  {
    id: 'DAY2_T',
    label: 'Day 2 Afternoon',
    day: 2,
    period: 'T',
    order: 4,
    labelCode: 'day2_afternoon',
  },
  {
    id: 'DAY2_N',
    label: 'Day 2 Night',
    day: 2,
    period: 'N',
    order: 5,
    labelCode: 'day2_night',
  },
  {
    id: 'DAY3_M',
    label: 'Day 3 Morning',
    day: 3,
    period: 'M',
    order: 6,
    labelCode: 'day3_morning',
  },
  {
    id: 'DAY3_T',
    label: 'Day 3 Afternoon',
    day: 3,
    period: 'T',
    order: 7,
    labelCode: 'day3_afternoon',
  },
  {
    id: 'DAY3_N',
    label: 'Day 3 Night',
    day: 3,
    period: 'N',
    order: 8,
    labelCode: 'day3_night',
  },
];
