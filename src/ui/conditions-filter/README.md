# Conditions Filter con ConceptSet Support

Este módulo proporciona hooks y componentes para manejar conditions filtradas por ConceptSets en OpenMRS.

## Problema Resuelto

Los hooks originales tenían varios problemas de implementación:

1. **URL incorrecta del ConceptSet**: Usaba `?references=` en lugar de la URL directa
2. **Estructura de datos incorrecta**: Buscaba `answers` en lugar de `setMembers`
3. **Representación del concepto incorrecta**: No coincidía con la estructura real de OpenMRS
4. **Filtrado mal implementado**: No manejaba correctamente los UUIDs vs códigos

## Hooks Disponibles

### `useConditionsFromConceptSet(patientUuid: string, conceptSetUuid: string)`

Obtiene todas las conditions del paciente filtradas por un ConceptSet específico.

**Parámetros:**
- `patientUuid`: UUID del paciente
- `conceptSetUuid`: UUID del ConceptSet (ej: "4484" para "Antecedentes Patológicos del Menor")

**Retorna:**
```typescript
{
  conditions: Condition[] | null,
  conceptSet: OpenmrsConcept | null,
  error: Error | null,
  isLoading: boolean,
  isValidating: boolean,
  mutate: () => void
}
```

### `useConditionsSearchFromConceptSet(searchTerm: string, conceptSetUuid: string)`

Realiza búsqueda local en los miembros de un ConceptSet.

**Parámetros:**
- `searchTerm`: Término de búsqueda
- `conceptSetUuid`: UUID del ConceptSet

**Retorna:**
```typescript
{
  searchResults: CodedCondition[],
  conceptSet: OpenmrsConcept | null,
  error: Error | null,
  isSearching: boolean
}
```

## Uso con el ConceptSet "Antecedentes Patológicos del Menor"

### Información del ConceptSet:
- **ID**: 4484
- **Nombre**: "Antecedentes Patológicos del Menor"
- **Miembros**:
  - Anemia (472)
  - Bebé de bajo peso al nacer (352)
  - Falta de peso o pobre patrón de crecimiento (2256)
  - Labio Leporino (484)

### Ejemplo de uso:

```tsx
import { useConditionsFromConceptSet, useConditionsSearchFromConceptSet } from './conditions.resource';

const MyComponent = ({ patientUuid }) => {
  const conceptSetUuid = '4484'; // Antecedentes Patológicos del Menor
  
  // Obtener conditions existentes
  const { conditions, conceptSet, isLoading } = useConditionsFromConceptSet(
    patientUuid, 
    conceptSetUuid
  );
  
  // Búsqueda en el ConceptSet
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, isSearching } = useConditionsSearchFromConceptSet(
    searchTerm, 
    conceptSetUuid
  );
  
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
};
```

## Cambios Realizados

### 1. Corrección de URLs
```typescript
// ANTES (incorrecto)
const conceptSetUrl = `${restBaseUrl}/concept?references=${conceptSetUuid}&v=${conceptRepresentation}`;

// DESPUÉS (correcto)
const conceptSetUrl = `${restBaseUrl}/concept/${conceptSetUuid}?v=${conceptRepresentation}`;
```

### 2. Corrección de estructura de datos
```typescript
// ANTES (incorrecto)
const conceptRepresentation = 'custom:(uuid,display,answers:(uuid,display))';

// DESPUÉS (correcto)
const conceptRepresentation = 'custom:(uuid,display,setMembers:(uuid,display))';
```

### 3. Corrección de tipos TypeScript
```typescript
// ANTES (incorrecto)
export type OpenmrsConcept = {
  uuid: string;
  display: string;
  answers?: Array<{
    uuid: string;
    display: string;
  }>;
};

// DESPUÉS (correcto)
export type OpenmrsConcept = {
  uuid: string;
  display: string;
  setMembers?: Array<{
    uuid: string;
    display: string;
  }>;
};
```

### 4. Corrección de respuesta de API
```typescript
// ANTES (incorrecto)
useSWR<{ data: { results: Array<OpenmrsConcept> } }, Error>

// DESPUÉS (correcto)
useSWR<{ data: OpenmrsConcept }, Error>
```

## Estructura de Archivos

```
src/ui/conditions-filter/
├── conditions.resource.ts          # Hooks corregidos
├── conditions-widget.component.tsx # Componente principal
├── types.ts                        # Definiciones de tipos
├── example-usage.tsx              # Ejemplo de uso
└── README.md                      # Esta documentación
```

## Testing

Para probar los hooks corregidos:

1. Usar el componente de ejemplo en `example-usage.tsx`
2. Verificar que se cargan los miembros del ConceptSet
3. Probar la búsqueda local
4. Verificar el filtrado de conditions existentes

## Notas Importantes

- Los hooks usan SWR para cache automático
- La búsqueda es local (no hace requests adicionales)
- El filtrado compara UUIDs de concepts
- Soporta debouncing en la búsqueda
- Maneja estados de loading y error apropiadamente
