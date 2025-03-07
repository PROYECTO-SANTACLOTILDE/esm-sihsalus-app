import { useState, useEffect } from 'react';
import Tooth from './Tooth';
import ToothDesigns from './ToothDesigns';
import {
  Finding3Design1,
  Finding4Design1,
  Finding8Design1,
  Finding8Design2,
  Finding8Design3,
  Finding20Design1,
  Finding23Design1,
  Finding38Design1,
  Finding7Design1,
  Finding28Design1,
  Finding37Design1,
  Finding37Design2,
  Finding37Design3,
  Finding37Design4,
  Finding37Design5,
  Finding36Design1,
  Finding36Design2,
  Finding10Design1,
  Finding10Design2,
  Finding10Design3,
  Finding10Design4,
  Finding10Design5,
  Finding10Design6,
  Finding10Design7,
  Finding10Design8,
  Finding5Design1,
  Finding5Design2,
  Finding5Design3,
  Finding5Design4,
  Finding5Design5,
  Finding5Design6,
  Finding5Design7,
  Finding5Design8,
  Finding5Design9,
  Finding5Design10,
  Finding5Design11,
  Finding5Design12,
  Finding5Design13,
  Finding5Design14,
  Finding27Design9,
  Finding35Design1,
  Finding35Design2,
  Finding35Design3,
  Finding35Design4,
  Finding35Design5,
  Finding35Design6,
  Finding35Design7,
  Finding35Design8,
  Finding35Design9,
  Finding35Design10,
  Finding35Design11,
  Finding35Design12,
  Finding35Design13,
  Finding35Design14,
} from '../../ui/teeths/odontology-design';
import useDentalFormStore from '../store/dentalFormData';
import useDentalDataStore from '../store/dentalData';

// Mapeo de optionId y dynamicDesign a componentes visuales
const designComponentMap = {
  '3': {
    '1': Finding3Design1,
  },
  '4': {
    '1': Finding4Design1,
  },
  '8': {
    '1': Finding8Design1,
    '2': Finding8Design2,
    '3': Finding8Design3,
  },
  '20': {
    '1': Finding20Design1,
  },
  '23': {
    '1': Finding23Design1,
  },
  '38': {
    '1': Finding38Design1,
  },
  '7': {
    '1': Finding7Design1,
  },
  '28': {
    '1': Finding28Design1,
  },
  '37': {
    '1': Finding37Design1,
    '2': Finding37Design2,
    '3': Finding37Design3,
    '4': Finding37Design4,
    '5': Finding37Design5,
  },
  '36': {
    '1': Finding36Design1,
    '2': Finding36Design2,
  },
  '10': {
    '1': Finding10Design1,
    '2': Finding10Design2,
    '3': Finding10Design3,
    '4': Finding10Design4,
    '5': Finding10Design5,
    '6': Finding10Design6,
    '7': Finding10Design7,
    '8': Finding10Design8,
  },
  '5': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '16': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '27': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding27Design9,
  },
  '34': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '35': {
    '1': Finding35Design1,
    '2': Finding35Design2,
    '3': Finding35Design3,
    '4': Finding35Design4,
    '5': Finding35Design5,
    '6': Finding35Design6,
    '7': Finding35Design7,
    '8': Finding35Design8,
    '9': Finding35Design9,
    '10': Finding35Design10,
    '11': Finding35Design11,
    '12': Finding35Design12,
    '13': Finding35Design13,
    '14': Finding35Design14,
  },
};

const ToothVisualization = ({ idTooth, zones = 8, design = 'default', selectedOptionId = 2 }) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const selectedDesign = useDentalFormStore((state) => state.selectedDesign);

  // Opciones predefinidas que activan el marcado
  const predefinedMarkedOptions = [3, 4, 8, 20, 23, 38, 7, 28, 37, 36, 10, 5, 16, 27, 34, 35]; // Opciones como solicitado

  // Store useDentalDataStore
  const teeth = useDentalDataStore((state) => state.teeth);
  const registerFinding = useDentalDataStore((state) => state.registerFinding);
  const removeFinding = useDentalDataStore((state) => state.removeFinding);

  // Obtener el diente
  const tooth = teeth.find((item) => item.id === idTooth);
  //console.log("teeth: " + JSON.stringify(teeth))
  // Función para gestionar los hallazgos
  const handleFindingToggle = () => {
    // Verificar condiciones generales
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) {
      return;
    }

    // Comprobar si ya existe este hallazgo para esta opción, considerando el diseño si está disponible
    const existingFinding = tooth?.findings.find((finding) => {
      // Si hay un diseño seleccionado, verificar coincidencia exacta de optionId y dynamicDesign
      if (selectedDesign?.number) {
        return finding.optionId === selectedOption && finding.dynamicDesign === selectedDesign.number;
      }
      // Si no hay diseño seleccionado, solo verificar coincidencia de optionId
      return finding.optionId === selectedOption;
    });

    if (existingFinding) {
      // Si existe el hallazgo, lo eliminamos
      removeFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id,
        dynamicDesign: selectedDesign?.number,
      });
    } else {
      // Si no existe, registramos uno nuevo
      registerFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id,
        color: selectedColor,
        design: selectedDesign ?? null,
      });
    }
  };

  // Renderizar todos los hallazgos
  const renderAllFindings = () => {
    if (!tooth?.findings || tooth.findings.length === 0) {
      return null;
    }

    return tooth.findings.map((finding, index) => {
      // Obtener el componente de diseño correspondiente
      const designComponents = designComponentMap[finding.optionId];
      if (!designComponents) return null;

      const DesignComponent = designComponents[finding.dynamicDesign];
      if (!DesignComponent) return null;

      // Renderizar el componente con el color correspondiente
      return (
        <g key={`finding-${finding.uniqueId || index}`}>
          <DesignComponent strokeColor={finding.color?.name || 'black'} />
        </g>
      );
    });
  };

  return (
    <svg width="60" height="120" onClick={handleFindingToggle} cursor={'pointer'}>
      <g>
        <ToothDesigns design={design} />
      </g>

      <g>
        <Tooth zones={zones} selectedOptionId={selectedOptionId} />
      </g>

      {/* Renderizar todos los hallazgos */}
      {renderAllFindings()}

      {/* Sombreado cuando se selecciona una opción predefinida */}
      {predefinedMarkedOptions.includes(selectedOption) && (
        <rect width="60" height="120" fill="lightgray" opacity="0.45" pointerEvents="none" />
      )}
    </svg>
  );
};

export default ToothVisualization;
