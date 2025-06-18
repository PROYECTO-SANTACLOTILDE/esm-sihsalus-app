import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import type { ConfigObject } from '../config-schema';

export interface DyakuPatient {
  resourceType: 'Patient';
  id: string;
  identifier?: Array<{
    type?: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
    };
    value?: string;
  }>;
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
  telecom?: Array<{
    system?: 'email' | 'phone';
    value?: string;
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
}

export interface DyakuPatientsResponse {
  resourceType: 'Bundle';
  id: string;
  type: 'searchset';
  total?: number;
  entry?: Array<{
    resource: DyakuPatient;
  }>;
}

export interface SyncResult {
  success: boolean;
  synchronized: number;
  failed: number;
  errors: string[];
}

export function useDyakuPatients(page?: number, size: number = 10) {
  const config = useConfig<ConfigObject>();
  const dyakuConfig = config.dyaku;

  const searchParams = new URLSearchParams();
  if (page) searchParams.append('_page', page.toString());
  searchParams.append('_count', size.toString());

  const url = `${dyakuConfig.fhirBaseUrl}/Patient?${searchParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<{ data: DyakuPatientsResponse }, Error>(
    `dyaku-patients-${page}-${size}`,
    () => fetchDyakuPatients(url),
  );

  return {
    data: data?.data?.entry?.map((entry) => entry.resource) || [],
    total: data?.data?.total || 0,
    error,
    isLoading,
    mutate,
  };
}

async function fetchDyakuPatients(url: string): Promise<{ data: DyakuPatientsResponse }> {
  try {
    // Intentar con fetch directo primero para evitar problemas de CORS
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching Dyaku patients:', error);
    throw new Error(`Error al conectar con Dyaku FHIR: ${error.message}`);
  }
}

export async function getDyakuPatientById(patientId: string, fhirBaseUrl: string): Promise<DyakuPatient> {
  const url = `${fhirBaseUrl}/Patient/${patientId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    console.error('Error fetching Dyaku patient by ID:', fetchError);
    throw new Error(`Error al obtener paciente de Dyaku: ${fetchError.message}`);
  }
}

// Función para sincronizar pacientes de Dyaku a OpenMRS
export async function syncDyakuPatientsToOpenMRS(fhirBaseUrl: string, batchSize: number = 50): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synchronized: 0,
    failed: 0,
    errors: [],
  };

  try {
    // Obtener pacientes de Dyaku
    const dyakuUrl = `${fhirBaseUrl}/Patient?_count=${batchSize}`;
    const dyakuResponse = await fetchDyakuPatients(dyakuUrl);
    const dyakuPatients = dyakuResponse.data.entry?.map((entry) => entry.resource) || [];

    for (const dyakuPatient of dyakuPatients) {
      try {
        // Verificar si el paciente ya existe en OpenMRS
        const existingPatient = await findPatientByIdentifier(dyakuPatient.identifier?.[0]?.value);

        if (!existingPatient) {
          // Crear nuevo paciente en OpenMRS
          await createPatientInOpenMRS(dyakuPatient);
          result.synchronized++;
        } else {
          // Actualizar paciente existente si es necesario
          await updatePatientInOpenMRS(existingPatient.uuid, dyakuPatient);
          result.synchronized++;
        }
      } catch (patientError) {
        result.failed++;
        result.errors.push(`Error procesando paciente ${dyakuPatient.id}: ${patientError.message}`);
      }
    }

    result.success = result.failed === 0;
    return result;
  } catch (error) {
    result.errors.push(`Error general de sincronización: ${error.message}`);
    return result;
  }
}

async function findPatientByIdentifier(identifier?: string): Promise<any> {
  if (!identifier) return null;

  try {
    const response = await openmrsFetch(`/ws/rest/v1/patient?identifier=${identifier}&v=default`);
    const patients = response.data?.results || [];
    return patients.length > 0 ? patients[0] : null;
  } catch (error) {
    console.error('Error buscando paciente por identificador:', error);
    return null;
  }
}

async function createPatientInOpenMRS(dyakuPatient: DyakuPatient): Promise<void> {
  const openMRSPatient = mapDyakuToOpenMRSPatient(dyakuPatient);

  try {
    await openmrsFetch('/ws/rest/v1/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: openMRSPatient,
    });
  } catch (error) {
    throw new Error(`Error creando paciente en OpenMRS: ${error.message}`);
  }
}

async function updatePatientInOpenMRS(patientUuid: string, dyakuPatient: DyakuPatient): Promise<void> {
  const openMRSPatient = mapDyakuToOpenMRSPatient(dyakuPatient);

  try {
    await openmrsFetch(`/ws/rest/v1/patient/${patientUuid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: openMRSPatient,
    });
  } catch (error) {
    throw new Error(`Error actualizando paciente en OpenMRS: ${error.message}`);
  }
}

function mapDyakuToOpenMRSPatient(dyakuPatient: DyakuPatient): any {
  const name = dyakuPatient.name?.[0];
  const identifier = dyakuPatient.identifier?.[0];
  const email = dyakuPatient.telecom?.find((t) => t.system === 'email')?.value;
  const phone = dyakuPatient.telecom?.find((t) => t.system === 'phone')?.value;

  return {
    identifiers: identifier
      ? [
          {
            identifier: identifier.value,
            identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334', // Default identifier type
            location: null,
            preferred: true,
          },
        ]
      : [],
    person: {
      names: name
        ? [
            {
              givenName: name.given?.join(' ') || '',
              familyName: name.family || '',
              preferred: true,
            },
          ]
        : [],
      gender: dyakuPatient.gender === 'female' ? 'F' : dyakuPatient.gender === 'male' ? 'M' : 'U',
      birthdate: dyakuPatient.birthDate || null,
      attributes: [
        ...(email
          ? [
              {
                attributeType: 'b2c38640-2603-4629-aebd-3b54f33f1e3a', // Email attribute type
                value: email,
              },
            ]
          : []),
        ...(phone
          ? [
              {
                attributeType: '14d4f066-15f5-102d-96e4-000c29c2a5d7', // Phone attribute type
                value: phone,
              },
            ]
          : []),
      ],
    },
  };
}

export function useDyakuSync() {
  const config = useConfig<ConfigObject>();
  const dyakuConfig = config.dyaku;

  const syncPatients = async (): Promise<SyncResult> => {
    if (!dyakuConfig.syncEnabled) {
      throw new Error('Sincronización deshabilitada en la configuración');
    }

    return await syncDyakuPatientsToOpenMRS(dyakuConfig.fhirBaseUrl, dyakuConfig.syncBatchSize);
  };

  return {
    syncPatients,
    isEnabled: dyakuConfig.syncEnabled,
    batchSize: dyakuConfig.syncBatchSize,
    intervalMinutes: dyakuConfig.syncIntervalMinutes,
  };
}
