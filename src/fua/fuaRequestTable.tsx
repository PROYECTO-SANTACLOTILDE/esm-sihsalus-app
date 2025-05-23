import React, { useState } from 'react';
import useFuaRequests from '../hooks/useFuaRequests';

const FuaRequestTable: React.FC = () => {
  const { data, isLoading, error } = useFuaRequests();
  const [openPayloadIndex, setOpenPayloadIndex] = useState<number | null>(null);

  const togglePayload = (index: number) => {
    setOpenPayloadIndex(openPayloadIndex === index ? null : index);
  };

  const renderJsonAsTable = (obj: any): JSX.Element => {
    if (typeof obj !== 'object' || obj === null) {
      return <span>{String(obj)}</span>;
    }

    return (
      <table style={{ borderCollapse: 'collapse', width: '100%', marginLeft: '1rem' }}>
        <tbody>
          {Object.entries(obj).map(([key, value], index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '4px 8px', fontWeight: 500, verticalAlign: 'top' }}>{key}</td>
              <td style={{ padding: '4px 8px' }}>
                {typeof value === 'object' && value !== null
                  ? renderJsonAsTable(value)
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (isLoading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Datos de solicitudes FUA</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Nombre del FUA</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Estado</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>UUID del FUA</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>UUID de la Visita</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Fecha de Creación</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Fecha de Actualización</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Payload</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((request: any, index: number) => (
            <React.Fragment key={index}>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {request.name || 'N/A'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {request.fuaEstado?.nombre || 'N/A'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '0.75rem' }}>
                  {request.uuid}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {request.visitUuid || 'N/A'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {new Date(request.fechaCreacion).toLocaleString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {new Date(request.fechaActualizacion).toLocaleString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  <button onClick={() => togglePayload(index)}>
                    {openPayloadIndex === index ? 'Ocultar' : 'Ver'}
                  </button>
                </td>
              </tr>
              {openPayloadIndex === index && (
                <tr>
                  <td colSpan={7} style={{ padding: '10px', backgroundColor: '#fafafa' }}>
                    {(() => {
                      try {
                        const parsed = JSON.parse(request.payload);
                        return renderJsonAsTable(parsed);
                      } catch (err) {
                        return <div>{request.payload}</div>;
                      }
                    })()}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuaRequestTable;
