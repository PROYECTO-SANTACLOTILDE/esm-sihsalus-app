/**
 * Tipos para estructura de dientes en el sistema dental
 */

// Importamos tipos relacionados si es necesario
import { Opcion } from './optionsTypes';

// Tipos para la posición y tipo de diente
type ToothPosition = 'upper' | 'lower';
type ToothType = 'molar' | 'premolar' | 'canino' | 'incisivo';

// Propiedades de visualización de un diente
interface ToothDisplayProperties {
  design: string;
  spaceBetweenLegendsLeftId: number | null;
  spaceBetweenLegendsRightId: number | null;
}

// Estructura principal de un diente
interface Tooth {
  id: number;
  position: ToothPosition;
  type: ToothType;
  findings: number[]; // IDs de hallazgos asociados al diente
  displayProperties: ToothDisplayProperties;
}

// Estructura completa de datos de dientes
interface TeethData {
  teeth: Tooth[];
}

// Props para componentes de dientes
interface ToothProps {
  tooth: Tooth;
  onToothClick?: (toothId: number) => void;
  selectedFindings?: number[];
  highlightedTooth?: boolean;
}

interface TeethGridProps {
  teeth: Tooth[];
  onToothClick?: (toothId: number) => void;
  selectedFindings?: number[];
  highlightedToothId?: number;
}

// Funciones de utilidad tipadas
type FindToothById = (id: number) => Tooth | undefined;
type FilterTeethByPosition = (position: ToothPosition) => Tooth[];
type FilterTeethByType = (type: ToothType) => Tooth[];
type GetTeethWithFinding = (findingId: number) => Tooth[];
type AddFindingToTooth = (toothId: number, findingId: number) => void;
type RemoveFindingFromTooth = (toothId: number, findingId: number) => void;

// Exportamos todos los tipos
export type {
  ToothPosition,
  ToothType,
  ToothDisplayProperties,
  Tooth,
  TeethData,
  ToothProps,
  TeethGridProps,
  FindToothById,
  FilterTeethByPosition,
  FilterTeethByType,
  GetTeethWithFinding,
  AddFindingToTooth,
  RemoveFindingFromTooth
};

// Constantes útiles
export const UPPER_TEETH_IDS = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_TEETH_IDS = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
export const ALL_TEETH_IDS = [...UPPER_TEETH_IDS, ...LOWER_TEETH_IDS];

// Función de utilidad para obtener la cuadrante de un diente basado en su ID
export function getToothQuadrant(toothId: number): 1 | 2 | 3 | 4 {
  if (toothId >= 11 && toothId <= 18) return 1;
  if (toothId >= 21 && toothId <= 28) return 2;
  if (toothId >= 31 && toothId <= 38) return 3;
  if (toothId >= 41 && toothId <= 48) return 4;
  throw new Error(`ID de diente inválido: ${toothId}`);
}