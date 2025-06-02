import { fhirBaseUrl, openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

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
    display: string;
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
  // Agregamos category para filtrar por concept sets
  category?: Array<{
    coding: Array<CodingData>;
    text?: string;
  }>;
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

export interface DataCaptureComponentProps {
  entryStarted: () => void;
  entrySubmitted: () => void;
  entryCancelled: () => void;
  closeComponent: () => void;
}

export type Condition = {
  clinicalStatus: string;
  conceptId: string;
  display: string;
  onsetDateTime: string;
  recordedDate: string;
  id: string;
  abatementDateTime?: string;
};

export interface ConditionDataTableRow {
  cells: Array<{
    id: string;
    value: string;
    info: {
      header: string;
    };
  }>;
  id: string;
}

export type CodedCondition = {
  display: string;
  uuid: string;
};

// Nuevo tipo para configuración del concept set
export interface ConceptSetConfig {
  uuid: string; // UUID del concept set "Antecedentes Patológicos del Menor" creado en OCL
  display: string;
}

type CreatePayload = {
  clinicalStatus: {
    coding: [
      {
        system: string;
        code: string;
      },
    ];
  };
  code: {
    coding: [
      {
        code: string;
        display: string;
      },
    ];
  };
  onsetDateTime: string;
  recorder: {
    reference: string;
  };
  recordedDate: string;
  resourceType: string;
  subject: {
    reference: string;
  };
  abatementDateTime?: string;
  // Agregamos category para clasificar la condición
  category?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text?: string;
  }>;
};

type EditPayload = CreatePayload & {
  id: string;
};

export type FormFields = {
  clinicalStatus: string;
  conceptId: string;
  display: string;
  abatementDateTime: string;
  onsetDateTime: string;
  patientId: string;
  userId: string;
};

// Hook mejorado que filtra por concept set específico
export function usePediatricMedicalHistoryConditions(patientUuid: string) {
  const config = useConfig();

  // UUID del concept set "Antecedentes Patológicos del Menor" que debe ser creado en OCL
  // Este valor debería venir de la configuración del módulo
  const pediatricHistoryConceptSetUuid =
    config?.pediatricHistoryConceptSetUuid || 'c33ef45d-aa69-4d9a-9214-1dbb52609601';

  // Hook para obtener los miembros del concept set
  const conceptSetMembersUrl = `${restBaseUrl}/concept/${pediatricHistoryConceptSetUuid}?v=full`;

  const { data: conceptSetData, error: conceptSetError } = useSWR<{ data: any }, Error>(
    pediatricHistoryConceptSetUuid ? conceptSetMembersUrl : null,
    openmrsFetch,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  // Extraer los UUIDs de los conceptos miembros del set
  const memberConceptUuids = useMemo(() => {
    if (!conceptSetData?.data?.setMembers) return [];
    return conceptSetData.data.setMembers.map((member: any) => member.uuid);
  }, [conceptSetData]);

  // Construir la URL para filtrar condiciones por los conceptos del set
  const conditionsUrl = useMemo(() => {
    if (!patientUuid || memberConceptUuids.length === 0) return null;

    // Usando FHIR API para filtrar por código (conceptos específicos)
    const conceptCodes = memberConceptUuids.join(',');
    return `${fhirBaseUrl}/Condition?patient=${patientUuid}&code=${conceptCodes}&_count=100`;
  }, [patientUuid, memberConceptUuids]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: FHIRConditionResponse }, Error>(
    conditionsUrl,
    openmrsFetch,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  const formattedConditions = useMemo(() => {
    if (!data?.data?.total) return null;
    return data.data.entry
      .map((entry) => entry.resource ?? [])
      .map(mapConditionProperties)
      .sort((a, b) => new Date(b.onsetDateTime).getTime() - new Date(a.onsetDateTime).getTime());
  }, [data]);

  // Función para invalidar y refrescar datos después de crear/editar/eliminar
  const refreshConditions = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    conditions: formattedConditions,
    error: error || conceptSetError,
    isLoading: isLoading,
    isValidating,
    mutate,
    refreshConditions, // Nueva función para refrescar manualmente
    conceptSetMembers: memberConceptUuids, // Exponer los miembros del concept set
  };
}

// Hook original mantenido para compatibilidad
export function useConditions(patientUuid: string) {
  const conditionsUrl = `${fhirBaseUrl}/Condition?patient=${patientUuid}&_count=100`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: FHIRConditionResponse }, Error>(
    patientUuid ? conditionsUrl : null,
    openmrsFetch,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  const formattedConditions = useMemo(() => {
    if (!data?.data?.total) return null;
    return data.data.entry
      .map((entry) => entry.resource ?? [])
      .map(mapConditionProperties)
      .sort((a, b) => new Date(b.onsetDateTime).getTime() - new Date(a.onsetDateTime).getTime());
  }, [data]);

  return {
    conditions: formattedConditions,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useConditionsSearch(conditionToLookup: string) {
  const config = useConfig();
  const conditionConceptClassUuid = config?.conditionConceptClassUuid;
  const conditionsSearchUrl = `${restBaseUrl}/concept?name=${conditionToLookup}&searchType=fuzzy&class=${conditionConceptClassUuid}&v=custom:(uuid,display)`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<CodedCondition> } }, Error>(
    conditionToLookup ? conditionsSearchUrl : null,
    openmrsFetch,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
    },
  );

  return {
    searchResults: data?.data?.results ?? [],
    error,
    isSearching: isLoading,
  };
}

function mapConditionProperties(condition: FHIRCondition): Condition {
  const status = condition?.clinicalStatus?.coding[0]?.code;
  return {
    clinicalStatus: status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '',
    conceptId: condition?.code?.coding[0]?.code ?? '',
    display: condition?.code?.coding[0]?.display ?? '',
    abatementDateTime: condition?.abatementDateTime,
    onsetDateTime: condition?.onsetDateTime ?? '',
    recordedDate: condition?.recordedDate ?? '',
    id: condition?.id ?? '',
  };
}

// Función mejorada para crear condición con category específica
export async function createPediatricCondition(payload: FormFields, conceptSetUuid: string): Promise<any> {
  const controller = new AbortController();
  const url = `${fhirBaseUrl}/Condition`;

  const completePayload: CreatePayload = {
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: payload.clinicalStatus.toLowerCase(),
        },
      ],
    },
    code: {
      coding: [
        {
          code: payload.conceptId,
          display: payload.display,
        },
      ],
    },
    // Agregamos la category para identificar que pertenece a "Antecedentes Patológicos del Menor"
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'problem-list-item',
            display: 'Problem List Item',
          },
          {
            system: 'http://openmrs.org/conceptset',
            code: conceptSetUuid,
            display: 'Antecedentes Patológicos del Menor',
          },
        ],
        text: 'Antecedentes Patológicos del Menor',
      },
    ],
    abatementDateTime: payload.abatementDateTime || undefined,
    onsetDateTime: payload.onsetDateTime || new Date().toISOString(),
    recorder: {
      reference: `Practitioner/${payload.userId}`,
    },
    recordedDate: new Date().toISOString(),
    resourceType: 'Condition',
    subject: {
      reference: `Patient/${payload.patientId}`,
    },
  };

  try {
    const res = await openmrsFetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(completePayload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Failed to create condition: ${res.statusText}`);
    return res;
  } catch (error) {
    throw new Error(`Error creating condition: ${error.message}`);
  } finally {
    controller.abort();
  }
}

// Funciones existentes mantenidas para compatibilidad
export async function createCondition(payload: FormFields): Promise<any> {
  const controller = new AbortController();
  const url = `${fhirBaseUrl}/Condition`;

  const completePayload: CreatePayload = {
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: payload.clinicalStatus.toLowerCase(),
        },
      ],
    },
    code: {
      coding: [
        {
          code: payload.conceptId,
          display: payload.display,
        },
      ],
    },
    abatementDateTime: payload.abatementDateTime || undefined,
    onsetDateTime: payload.onsetDateTime || new Date().toISOString(),
    recorder: {
      reference: `Practitioner/${payload.userId}`,
    },
    recordedDate: new Date().toISOString(),
    resourceType: 'Condition',
    subject: {
      reference: `Patient/${payload.patientId}`,
    },
  };

  try {
    const res = await openmrsFetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(completePayload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Failed to create condition: ${res.statusText}`);
    return res;
  } catch (error) {
    throw new Error(`Error creating condition: ${error.message}`);
  } finally {
    controller.abort();
  }
}

export async function updateCondition(conditionId: string, payload: FormFields): Promise<any> {
  const controller = new AbortController();
  const url = `${fhirBaseUrl}/Condition/${conditionId}`;

  const completePayload: EditPayload = {
    id: conditionId,
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: payload.clinicalStatus.toLowerCase(),
        },
      ],
    },
    code: {
      coding: [
        {
          code: payload.conceptId,
          display: payload.display,
        },
      ],
    },
    abatementDateTime: payload.abatementDateTime || undefined,
    onsetDateTime: payload.onsetDateTime || new Date().toISOString(),
    recorder: {
      reference: `Practitioner/${payload.userId}`,
    },
    recordedDate: new Date().toISOString(),
    resourceType: 'Condition',
    subject: {
      reference: `Patient/${payload.patientId}`,
    },
  };

  try {
    const res = await openmrsFetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(completePayload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Failed to update condition: ${res.statusText}`);
    return res;
  } catch (error) {
    throw new Error(`Error updating condition: ${error.message}`);
  } finally {
    controller.abort();
  }
}

export async function deleteCondition(conditionId: string): Promise<any> {
  const controller = new AbortController();
  const url = `${fhirBaseUrl}/Condition/${conditionId}`;

  try {
    const res = await openmrsFetch(url, {
      method: 'DELETE',
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Failed to delete condition: ${res.statusText}`);
    return res;
  } catch (error) {
    throw new Error(`Error deleting condition: ${error.message}`);
  } finally {
    controller.abort();
  }
}

// Interfaces y funciones de sorting mantenidas
export interface ConditionTableRow extends Condition {
  id: string;
  condition: string;
  abatementDateTime: string;
  onsetDateTimeRender: string;
}

export interface ConditionTableHeader {
  key: 'display' | 'onsetDateTimeRender' | 'status';
  header: string;
  isSortable: true;
  sortFunc: (valueA: ConditionTableRow, valueB: ConditionTableRow) => number;
}

export function useConditionsSorting(tableHeaders: Array<ConditionTableHeader>, tableRows: Array<ConditionTableRow>) {
  const [sortParams, setSortParams] = useState<{
    key: ConditionTableHeader['key'] | '';
    sortDirection: 'ASC' | 'DESC' | 'NONE';
  }>({ key: '', sortDirection: 'NONE' });

  const sortRow = (
    cellA: any,
    cellB: any,
    { key, sortDirection }: { key: string; sortDirection: 'ASC' | 'DESC' | 'NONE' },
  ) => {
    setSortParams({ key: key as ConditionTableHeader['key'], sortDirection });
  };

  const sortedRows = useMemo(() => {
    if (sortParams.sortDirection === 'NONE' || !tableRows) return tableRows;

    const { key, sortDirection } = sortParams;
    const tableHeader = tableHeaders.find((h) => h.key === key);

    return [...tableRows].sort((a, b) => {
      const sortingNum = tableHeader?.sortFunc(a, b) || 0;
      return sortDirection === 'DESC' ? sortingNum : -sortingNum;
    });
  }, [sortParams, tableRows, tableHeaders]);

  return {
    sortedRows,
    sortRow,
  };
}
