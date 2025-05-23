import { useMemo } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { Appointment } from '../types';

export interface CREDEncounter {
  uuid: string;
  encounterDatetime: string;
  appointmentDate: string;
  serviceName: string;
  serviceType: string;
  status: string;
  obs: Array<{
    concept: {
      display: string;
    };
    value: string | number | boolean;
  }>;
  creator?: {
    uuid: string;
  };
  provider?: {
    uuid: string;
  };
}

interface AppointmentsFetchResponse {
  data: Array<Appointment>;
}

const appointmentsSearchUrl = `${restBaseUrl}/appointments/search`;

// CRED service identifiers - these should be configured based on your OpenMRS setup
const CRED_SERVICE_NAMES = [
  'CRED',
  'Control CRED',
  'Controles CRED',
  'Control de Niño Sano',
  'Niño Sano',
  'Well Child Control',
  'Healthy Child Control'
];

const useEncountersCRED = (patientUuid: string) => {
  // Calculate date range for appointments (last 2 years to next 1 year)
  const startDate = dayjs().subtract(2, 'years').format('YYYY-MM-DD');
  
  const fetcher = () =>
    openmrsFetch(appointmentsSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        patientUuid: patientUuid,
        startDate: startDate,
      },
    });

  const { data, error, isLoading } = useSWR<AppointmentsFetchResponse, Error>(
    patientUuid ? `${appointmentsSearchUrl}-${patientUuid}` : null,
    fetcher,
  );

  const encounters = useMemo(() => {
    if (!data?.data) return [];

    // Filter appointments for CRED services
    const credAppointments = data.data.filter((appointment: Appointment) => {
      const serviceName = appointment.service?.name?.toLowerCase() || '';
      return CRED_SERVICE_NAMES.some(credService => 
        serviceName.includes(credService.toLowerCase())
      );
    });

    // Transform appointments to CREDEncounter format
    return credAppointments.map((appointment: Appointment): CREDEncounter => ({
      uuid: appointment.uuid,
      encounterDatetime: appointment.startDateTime,
      appointmentDate: dayjs(appointment.startDateTime).format('YYYY-MM-DD'),
      serviceName: appointment.service?.name || 'CRED',
      serviceType: appointment.service?.name?.includes('CRED') ? 'CRED' : 'Complementaria',
      status: appointment.status || 'Scheduled',
      obs: [
        {
          concept: { display: 'Tipo de servicio' },
          value: appointment.service?.name || 'CRED',
        },
        {
          concept: { display: 'Estado de cita' },
          value: appointment.status || 'Scheduled',
        },
        {
          concept: { display: 'Fecha de cita' },
          value: dayjs(appointment.startDateTime).format('DD/MM/YYYY'),
        },
      ],
      creator: { uuid: 'system' },
      provider: { uuid: 'system' },
    }));
  }, [data]);

  return { 
    encounters, 
    isLoading, 
    error: error || null 
  };
};

export default useEncountersCRED;
