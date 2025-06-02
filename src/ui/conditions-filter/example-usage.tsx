import React from 'react';
import { useConditionsFromConceptSet, useConditionsSearchFromConceptSet } from './conditions.resource';

/**
 * Ejemplo de uso de los hooks corregidos para ConceptSet
 *
 * ConceptSet ID: 4484 - "Antecedentes Patológicos del Menor"
 * Contiene:
 * - Anemia (472)
 * - Bebé de bajo peso al nacer (352)
 * - Falta de peso o pobre patrón de crecimiento (2256)
 * - Labio Leporino (484)
 */

interface ExampleUsageProps {
  patientUuid: string;
}

const ExampleUsage: React.FC<ExampleUsageProps> = ({ patientUuid }) => {
  const conceptSetUuid = '4484'; // ID del ConceptSet "Antecedentes Patológicos del Menor"

  // Hook 1: Obtener todas las conditions del paciente filtradas por el ConceptSet
  const {
    conditions,
    conceptSet,
    error: conditionsError,
    isLoading: conditionsLoading,
  } = useConditionsFromConceptSet(patientUuid, conceptSetUuid);

  // Hook 2: Búsqueda en el ConceptSet
  const [searchTerm, setSearchTerm] = React.useState('');
  const {
    searchResults,
    error: searchError,
    isSearching,
  } = useConditionsSearchFromConceptSet(searchTerm, conceptSetUuid);

  if (conditionsLoading) {
    return <div>Cargando conditions...</div>;
  }

  if (conditionsError) {
    return <div>Error cargando conditions: {conditionsError.message}</div>;
  }

  return (
    <div>
      <h2>Antecedentes Patológicos del Menor</h2>

      {/* Información del ConceptSet */}
      {conceptSet && (
        <div>
          <h3>ConceptSet: {conceptSet.display}</h3>
          <p>UUID: {conceptSet.uuid}</p>
          <p>Miembros disponibles: {conceptSet.setMembers?.length || 0}</p>
        </div>
      )}

      {/* Búsqueda en el ConceptSet */}
      <div>
        <h3>Buscar condiciones:</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en antecedentes patológicos..."
        />

        {isSearching && <p>Buscando...</p>}

        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((result) => (
              <li key={result.uuid}>
                {result.display} ({result.uuid})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Conditions existentes del paciente */}
      <div>
        <h3>Conditions existentes del paciente:</h3>
        {conditions && conditions.length > 0 ? (
          <ul>
            {conditions.map((condition) => (
              <li key={condition.id}>
                <strong>{condition.display}</strong>
                <br />
                Status: {condition.clinicalStatus}
                <br />
                Fecha inicio: {new Date(condition.onsetDateTime).toLocaleDateString()}
                {condition.abatementDateTime && (
                  <>
                    <br />
                    Fecha fin: {new Date(condition.abatementDateTime).toLocaleDateString()}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay antecedentes patológicos registrados para este paciente.</p>
        )}
      </div>
    </div>
  );
};

export default ExampleUsage;
