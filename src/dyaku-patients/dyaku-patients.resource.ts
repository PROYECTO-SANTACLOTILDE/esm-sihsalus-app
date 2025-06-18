import useSWR from 'swr';

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

const DYAKU_FHIR_BASE_URL = 'https://dyaku.minsa.gob.pe/fhir';

export function useDyakuPatients(page?: number, size: number = 10) {
  const searchParams = new URLSearchParams();
  if (page) searchParams.append('_page', page.toString());
  searchParams.append('_count', size.toString());

  const url = `${DYAKU_FHIR_BASE_URL}/Patient?${searchParams.toString()}`;

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

export async function getDyakuPatientById(patientId: string): Promise<DyakuPatient> {
  const url = `${DYAKU_FHIR_BASE_URL}/Patient/${patientId}`;

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
