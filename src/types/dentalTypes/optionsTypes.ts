/**
 * Tipos para sistema de hallazgos dentales
 * Definición de interfaces basadas en la estructura JSON de opciones dentales
 */

// Interfaz para los colores
interface Color {
    id: number;
    name: string;
  }
  
  // Interfaz para subopciones
  interface Subopcion {
    id: number;
    nombre: string;
    descripcion?: string;
  }
  
  // Interfaz para diseños
  interface Design {
    number: number;
    nombre: string;
    componente: string;
  }
  
  // Interfaz principal para las opciones
  interface Opcion {
    id: number;
    nombre: string;
    identificador?: string;
    colores: Color[];
    subopciones?: Subopcion[];
    designs?: Design[];
  }
  
  // Tipo para la estructura principal de datos
  interface DentalData {
    opciones: Opcion[];
  }
  
  // Tipos para componentes UI comunes
  interface OpcionSelectorProps {
    opciones: Opcion[];
    selectedOpcionId: number | null;
    onSelect: (opcionId: number) => void;
  }
  
  interface ColorSelectorProps {
    colores: Color[];
    selectedColorId: number | null;
    onSelect: (colorId: number) => void;
  }
  
  interface SubopcionSelectorProps {
    subopciones: Subopcion[] | undefined;
    selectedSubopcionId: number | null;
    onSelect: (subopcionId: number) => void;
  }
  
  interface DesignSelectorProps {
    designs: Design[] | undefined;
    selectedDesignNumber: number | null;
    onSelect: (designNumber: number) => void;
  }
  
  // Funciones de utilidad tipadas
  type FindOpcionById = (id: number) => Opcion | undefined;
  type FilterOpcionesByColorId = (colorId: number) => Opcion[];
  type GetOpcionesWithDesigns = () => Opcion[];
  type GetOpcionesWithSubopciones = () => Opcion[];
  
  // Exportación de todos los tipos
  export type {
    Color,
    Subopcion,
    Design,
    Opcion,
    DentalData,
    OpcionSelectorProps,
    ColorSelectorProps,
    SubopcionSelectorProps,
    DesignSelectorProps,
    FindOpcionById,
    FilterOpcionesByColorId,
    GetOpcionesWithDesigns,
    GetOpcionesWithSubopciones
  };