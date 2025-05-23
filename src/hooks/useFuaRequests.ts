import { useEffect, useState } from 'react';
import axios from 'axios';

export interface FuaEstado {
  uuid: string;
  id: number;
  nombre: string;
}

export interface FuaRequest {
  uuid: string;
  id: number;
  visitUuid: string;
  name: string;
  payload: string;
  fuaEstado: FuaEstado;
  fechaCreacion: number;
  fechaActualizacion: number;
}

function useFuaRequests() {
  const [data, setData] = useState<FuaRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<FuaRequest[]>(
          'http://hii1sc-dev.inf.pucp.edu.pe/openmrs/ws/module/fua/list',
          {
            auth: {
              username: 'admin',
              password: 'Admin123'
            }
          }
        );
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching FUA list:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export default useFuaRequests;
