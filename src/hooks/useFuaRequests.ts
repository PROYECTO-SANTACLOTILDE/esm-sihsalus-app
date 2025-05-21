import { useState, useEffect } from 'react';

// Helper to parse a date string "DD/MM/YYYY" into a Date object
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map((num) => parseInt(num, 10));
  // Note: month in Date constructor is 0-indexed (0 = January)
  return new Date(year, month - 1, day);
};

/**
 * Type for a FUA request record
 */
interface FuaRequest {
  id: string;
  documentType: string;
  documentNumber: string;
  patientName: string;
  status: string;
  appointmentDate: string; // in format "DD/MM/YYYY" for display
  professional: string;
}

/**
 * Type for filter criteria
 */
interface FuaRequestFilter {
  documentType?: string;
  documentNumber?: string;
  startDate?: Date;
  endDate?: Date;
  professional?: string;
}

/**
 * Custom hook to simulate fetching FUA requests from an external endpoint.
 * It returns mock data filtered according to the provided filter criteria.
 */
function useFuaRequests(filters: FuaRequestFilter) {
  const [data, setData] = useState<FuaRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Static mock data for FUA requests (could be replaced with real API calls)
  const MOCK_DATA: FuaRequest[] = [
    {
      id: '1',
      documentType: 'DNI',
      documentNumber: '12345678',
      patientName: 'JUAN PEREZ',
      status: 'Confirmada',
      appointmentDate: '20/05/2025',
      professional: 'Dr. Alice',
    },
    {
      id: '2',
      documentType: 'DNI',
      documentNumber: '87654321',
      patientName: 'MARIA GOMEZ',
      status: 'Pendiente',
      appointmentDate: '20/05/2025',
      professional: 'Dr. Bob',
    },
    {
      id: '3',
      documentType: 'CE',
      documentNumber: '000112233',
      patientName: 'CARLOS LOPEZ',
      status: 'Confirmada',
      appointmentDate: '15/05/2025',
      professional: 'Dr. Alice',
    },
    {
      id: '4',
      documentType: 'OTROS', // "OTROS" will simulate search by name
      documentNumber: '', // (no document number, but name search term could apply)
      patientName: 'ANA FERNANDEZ',
      status: 'Confirmada',
      appointmentDate: '10/05/2025',
      professional: 'Dr. Charlie',
    },
    // ... (add more mock entries as needed)
  ];

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      try {
        let result = [...MOCK_DATA]; // copy the full dataset

        // Apply date range filter (if both start and end dates are provided)
        if (filters.startDate && filters.endDate) {
          result = result.filter((item) => {
            const itemDate = parseDate(item.appointmentDate);
            return itemDate >= filters.startDate! && itemDate <= filters.endDate!;
          });
        }

        // Apply document type/number filter
        if (filters.documentType) {
          const docType = filters.documentType;
          const docNumber = filters.documentNumber?.trim() || '';
          if (docType === 'OTROS') {
            // "OTROS": search by patient name (name contains the query)
            if (docNumber) {
              const query = docNumber.toLowerCase();
              result = result.filter((item) => item.patientName.toLowerCase().includes(query));
            }
            // If 'OTROS' selected but no search term, do not filter by name
          } else {
            if (docNumber) {
              // Filter by exact document type and number
              result = result.filter((item) => item.documentType === docType && item.documentNumber === docNumber);
            } else {
              // If document number is empty, filter by document type only
              result = result.filter((item) => item.documentType === docType);
            }
          }
        }

        // Apply professional filter (if not "Todos" or empty)
        if (filters.professional && filters.professional !== 'Todos') {
          result = result.filter((item) => item.professional === filters.professional);
        }

        setData(result);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching FUA requests:', err);
        setError(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer); // cleanup timeout if filters change quickly
  }, [
    filters.documentType,
    filters.documentNumber,
    filters.startDate,
    filters.endDate,
    filters.professional,
    parseDate,
  ]);

  return { data, isLoading, error };
}

export default useFuaRequests;
