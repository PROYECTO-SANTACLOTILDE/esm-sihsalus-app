import { create } from 'zustand';
import { opciones as initialOpciones } from '../data/optionsData.json';

interface Option {
  id: string;
  colores?: string[];
  designs?: string[];
  subopciones?: string[];
}

// Estado del store
interface DentalFormStore {
  opciones: Option[];
  selectedOption: string | null;
  selectedColor: string | null;
  selectedSuboption: string | null;
  isComplete: boolean;
  selectedDesign: string | null;

  // Funciones para actualizar el estado
  setSelectedOption: (optionId: string) => void;
  setSelectedColor: (color: string | null) => void;
  setSelectedSuboption: (suboption: string | null) => void;
  setSelectedDesign: (design: string | null) => void;
  resetSelection: () => void;
}

const useDentalFormStore = create<DentalFormStore>((set, get) => ({
  opciones: initialOpciones.map((op: any) => ({
    ...op,
    id: String(op.id),  // Convertir id de number a string
  })) || [],
  selectedOption: null,
  selectedColor: null,
  selectedSuboption: null,
  isComplete: false,
  selectedDesign: null,


  //VALIDAR
  setSelectedOption: (optionId) => {
    const selectedItem = get().opciones.find((op) => op.id === optionId);
    let autoSelectedColor = null;
    let autoSelectedDesign = null;
    let autoIsComplete = false;

    if (selectedItem) {
      // Autocompletado de color si solo hay uno disponible y no hay subopciones
      if (
        (!selectedItem.subopciones || selectedItem.subopciones.length === 0) &&
        selectedItem.colores?.length === 1
      ) {
        autoSelectedColor = selectedItem.colores[0];

        // Si también solo hay un diseño disponible, se selecciona automáticamente
        if (selectedItem.designs?.length === 1) {
          autoSelectedDesign = selectedItem.designs[0];
          autoIsComplete = true; // Completo si hay un diseño seleccionado automáticamente
        } else {
          // Si hay varios diseños o ninguno, no está completo hasta que se seleccione uno
          autoIsComplete = !selectedItem.designs || selectedItem.designs.length === 0;
        }
      } else {
        // Si no hay colores pero hay un solo diseño
        if (
          (!selectedItem.colores || selectedItem.colores.length === 0) &&
          selectedItem.designs?.length === 1 &&
          (!selectedItem.subopciones || selectedItem.subopciones.length === 0)
        ) {
          autoSelectedDesign = selectedItem.designs[0];
          autoIsComplete = true;
        }
      }
    }

    set({
      selectedOption: optionId,
      selectedColor: autoSelectedColor,
      selectedSuboption: null,
      selectedDesign: autoSelectedDesign,
      isComplete: autoIsComplete,
    });
  },

  setSelectedColor: (color) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Autocompletado de diseño si solo hay uno disponible después de seleccionar color
      let autoSelectedDesign = null;
      if (selectedItem && selectedItem.designs?.length === 1 && !state.selectedDesign) {
        autoSelectedDesign = selectedItem.designs[0];
      }

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!color) &&
        (!selectedItem?.subopciones?.length || !!state.selectedSuboption) &&
        (!selectedItem?.designs?.length || !!autoSelectedDesign || !!state.selectedDesign);

      return {
        selectedColor: color,
        selectedDesign: autoSelectedDesign || state.selectedDesign,
        isComplete: isCompleteNow,
      };
    });
  },

  setSelectedSuboption: (suboption) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Autocompletado de color si hay un solo color disponible
      let autoSelectedColor = null;
      if (
        selectedItem &&
        selectedItem.subopciones?.length > 0 &&
        selectedItem.colores?.length === 1 &&
        !state.selectedColor
      ) {
        autoSelectedColor = selectedItem.colores[0];
      }

      // Autocompletado de diseño si hay un solo diseño disponible
      let autoSelectedDesign = null;
      if (selectedItem && selectedItem.designs?.length === 1 && !state.selectedDesign) {
        autoSelectedDesign = selectedItem.designs[0];
      }

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!autoSelectedColor || !!state.selectedColor) &&
        (!selectedItem?.subopciones?.length || !!suboption) &&
        (!selectedItem?.designs?.length || !!autoSelectedDesign || !!state.selectedDesign);

      return {
        selectedSuboption: suboption,
        selectedColor: autoSelectedColor || state.selectedColor,
        selectedDesign: autoSelectedDesign || state.selectedDesign,
        isComplete: isCompleteNow,
      };
    });
  },

  // Nueva función para establecer el diseño seleccionado
  setSelectedDesign: (design) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!state.selectedColor) &&
        (!selectedItem?.subopciones?.length || !!state.selectedSuboption) &&
        (!selectedItem?.designs?.length || !!design);

      return {
        selectedDesign: design,
        isComplete: isCompleteNow,
      };
    });
  },

  // Resetear toda la selección
  resetSelection: () =>
    set({
      selectedOption: null,
      selectedSuboption: null,
      selectedColor: null,
      selectedDesign: null,
      isComplete: false,
    }),
}));

export default useDentalFormStore;
