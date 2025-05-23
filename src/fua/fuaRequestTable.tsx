import React from 'react';
import useFuaRequests from '../hooks/useFuaRequests';

const FuaRequestTable: React.FC = () => {
  const { data, isLoading, error } = useFuaRequests();
  console.log("pruebas:", data)

  if (isLoading) return <div>Cargando datos...</div>;
  console.log("pruebas2:", data)

  if (error) return <div>Error: {error.message}</div>;
  console.log("pruebas3:", data)

  return (
    <div>
      <h2>Datos de solicitudes FUA</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FuaRequestTable;
