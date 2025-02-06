import React, { useEffect, useState } from 'react';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import styles from './vaccinationScheduleWidget.style.scss';

// Definimos los encabezados de la tabla
const headers = [
  { key: 'age', header: 'Edad' },
  { key: 'vaccines', header: 'Vacunas' },
];

// Definimos el componente
const VaccinationScheduleWidget: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const [rows, setRows] = useState<any[]>([]); // Estado para los datos de vacunación
  const [loading, setLoading] = useState<boolean>(true); // Estado para la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Fetch de datos al cargar el componente
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/programs/${patientUuid}`); // Llamada a la API
        if (!response.ok) {
          throw new Error(`Error al obtener los programas: ${response.statusText}`);
        }
        const data = await response.json();
        setRows(data); // Guardamos los datos obtenidos
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar los programas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [patientUuid]);

  return (
    <div className={styles.vaccinationWidgetContainer}>
      <h2>Esquema Regular de Vacunación</h2>

      {loading ? (
        <p>Cargando...</p> // Indicador de carga
      ) : error ? (
        <p className={styles.error}>Error: {error}</p> // Mensaje de error
      ) : rows.length > 0 ? (
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps }) => (
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      ) : (
        <p>No se encontraron programas de vacunación para este paciente.</p> // Mensaje si no hay datos
      )}
    </div>
  );
};

export default VaccinationScheduleWidget;
