/**
 * Tipos para espacios interdentales en el sistema dental
 */

// Importamos los tipos previos si los necesitamos
import { Opcion, Color } from './optionsTypes';

// Interfaz para un espacio interdental individual
interface IntermediateSpace {
  id: number;
  leftToothId: number;
  rightToothId: number;
  dynamicDesign: string | null;
  color: Color | null;
  findings: number[]; // IDs de los hallazgos asociados a este espacio
}

// Tipado para el objeto principal de espacios
interface IntermediateSpacesData {
  // Espacios entre leyendas
  spaceBetweenLegends: IntermediateSpace[];
  
  // Espacios para cada tipo de hallazgo
  intermediateSpaceOnTheCanvasOfFinding1: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding2: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding6: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding7: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding24: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding25: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding26: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding30: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding31: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding32: IntermediateSpace[];
  intermediateSpaceOnTheCanvasOfFinding39: IntermediateSpace[];
  [key: string]: IntermediateSpace[]; // Índice de tipo string para acceso dinámico
}

// Tipo para representar el ID de un hallazgo específico
type FindingId = 1 | 2 | 6 | 7 | 24 | 25 | 26 | 30 | 31 | 32 | 39;

// Función tipada para obtener los espacios de un hallazgo específico
type GetIntermediateSpacesForFinding = (findingId: FindingId) => IntermediateSpace[] | undefined;

// Props para componentes que renderizan espacios
interface IntermediateSpaceProps {
  space: IntermediateSpace;
  findingId?: FindingId;
  onSpaceClick?: (spaceId: number) => void;
}

interface IntermediateSpacesListProps {
  spaces: IntermediateSpace[];
  findingId?: FindingId;
  onSpaceClick?: (spaceId: number) => void;
}

// Funciones de utilidad tipadas
type FindSpaceById = (spaceId: number, findingId?: FindingId) => IntermediateSpace | undefined;
type UpdateSpaceColor = (spaceId: number, findingId: FindingId, color: Color | null) => void;
type UpdateSpaceDesign = (spaceId: number, findingId: FindingId, design: string | null) => void;
type AddFindingToSpace = (spaceId: number, findingId: FindingId, findingToAdd: number) => void;

// Exportamos todos los tipos
export type {
  IntermediateSpace,
  IntermediateSpacesData,
  FindingId,
  GetIntermediateSpacesForFinding,
  IntermediateSpaceProps,
  IntermediateSpacesListProps,
  FindSpaceById,
  UpdateSpaceColor,
  UpdateSpaceDesign,
  AddFindingToSpace
};

// Función de utilidad para obtener la clave correcta para un hallazgo específico
export function getKeyForFinding(findingId: FindingId): string {
  return `intermediateSpaceOnTheCanvasOfFinding${findingId}`;
}