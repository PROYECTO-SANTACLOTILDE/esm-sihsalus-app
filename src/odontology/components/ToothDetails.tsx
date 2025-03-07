import React, { useState } from 'react';
import './ToothDetails.css';
import './spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenStyles.css';
import {
  CircleDesign,
  EllipseDesign,
  EllipseDesignLeft,
  EllipseDesignRight,
  EllipseDesignCenter,
  EllipseDesignLeftAndRight,
  Finding12Design1,
  Finding21Design1,
} from '../../ui/teeths/odontology-design';
import useDentalFormStore from '../store/dentalFormData';
import useDentalDataStore from '../store/dentalData';

// Se manejan los hallazgos 11 y 12
const ToothDetails = ({ idTooth, initialText = '', legend = 'Leyenda' }) => {
  const [text, setText] = useState(initialText.toUpperCase());

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [11, 12, 21]; // Opciones que activan la selección

  // Store useDentalDataStore
  const teeth = useDentalDataStore((state) => state.teeth);
  const registerFinding = useDentalDataStore((state) => state.registerFinding);
  const removeFinding = useDentalDataStore((state) => state.removeFinding);

  // Obtener el diente
  const tooth = teeth.find((item) => item.id === idTooth);

  // Buscar los hallazgos específicos para cada opción
  const Finding11 = tooth?.findings.find((f) => f.optionId === 11);
  const Finding12 = tooth?.findings.find((f) => f.optionId === 12);
  const Finding21 = tooth?.findings.find((f) => f.optionId === 21);

  const handleTextChange = (e) => {
    // Convertir texto a mayúsculas y filtrar caracteres no permitidos
    const inputValue = e.target.value;
    const filteredValue = inputValue
      .replace(/[^a-zA-Z0-9\n]/g, '') // Solo permite letras, números y saltos de línea
      .toUpperCase(); // Convierte a mayúsculas

    setText(filteredValue);
  };

  const handleLegendClick = () => {
    // Verificar condiciones generales
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;

    // Obtener el hallazgo actual según la opción seleccionada usando switch
    let currentFinding;

    switch (selectedOption) {
      case 11:
        currentFinding = Finding11;
        break;
      case 12:
        currentFinding = Finding12;
        break;
      case 21:
        currentFinding = Finding21;
        break;
      default:
        return; // Salir si no hay un caso correspondiente
    }

    if (currentFinding) {
      // Si existe el hallazgo, lo eliminamos
      removeFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id,
      });
    } else {
      // Si no existe, registramos uno nuevo
      registerFinding({
        toothId: idTooth,
        optionId: selectedOption,
        subOptionId: selectedSuboption?.id,
        color: selectedColor,
      });
    }
  };

  // Determinar la clase CSS para el SVG
  const svgClassName = 'tooth-details-legend interactive-svg';

  // Función auxiliar para renderizar diseños según el tipo de hallazgo
  const renderDesignForFinding = (optionId, finding) => {
    switch (optionId) {
      case 11:
        return (
          <>
            {finding.dynamicDesign === 1 && <EllipseDesignLeft strokeColor={finding.color.name} />}
            {finding.dynamicDesign === 2 && <EllipseDesignRight strokeColor={finding.color.name} />}
            {finding.dynamicDesign === 3 && <EllipseDesignLeftAndRight strokeColor={finding.color.name} />}
          </>
        );
      case 12:
        return <>{finding.dynamicDesign === 1 && <Finding12Design1 strokeColor={finding.color.name} />}</>;
      case 21:
        return <>{finding.dynamicDesign === 1 && <Finding21Design1 strokeColor={finding.color.name} />}</>;
      default:
        return null;
    }
  };

  return (
    <div className="tooth-details-container">
      {/* Findings - hallazgos */}
      <div className="tooth-details-box">
        <textarea
          value={text}
          onChange={handleTextChange}
          className="tooth-details-textarea"
          aria-label="Tooth details"
        />
      </div>

      {/* Legend - identificador de diente */}
      <svg
        width="60"
        height="30"
        onClick={handleLegendClick}
        className={svgClassName}
        style={{ cursor: 'pointer' }}
        viewBox="0 0 60 30"
      >
        {/* Fondo con sombreado dependiendo de la opción seleccionada */}
        <rect width="60" height="30" fill={predefinedMarkedOptions.includes(selectedOption) ? 'lightgray' : 'white'} />

        <text x="30" y="20" fontSize="13" fill="black" textAnchor="middle" className="tooth-details-legend-text">
          {legend}
        </text>

        {/* Renderiza los diseños de cada hallazgo usando un enfoque más modular */}

        {/* Hallazgo 11 */}
        {Finding11?.color && Finding11?.dynamicDesign && <>{renderDesignForFinding(11, Finding11)}</>}

        {/* Hallazgo 12 */}
        {Finding12?.color && Finding12?.dynamicDesign && <>{renderDesignForFinding(12, Finding12)}</>}
        {Finding21?.color && Finding21?.dynamicDesign && <>{renderDesignForFinding(21, Finding21)}</>}
      </svg>
    </div>
  );
};

export default ToothDetails;
