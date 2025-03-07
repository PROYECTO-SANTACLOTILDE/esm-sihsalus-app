import React from 'react';
import useDentalFormStore from '../../store/dentalFormData';
import useSpaceBetweenLegendsDataStore from '../../store/spaceBetweenMainSectionsOnTheCanvasData';
import { Finding1Design4, Finding1Design5, Finding1Design6, Finding2Design2 } from '../../designs/figuras';
import './SpaceBetweenStyles.css';
const SpaceBetweenFinding2 = ({ id }) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [2]; // Opciones que activan la selección

  // Store useSpaceBetweenLegendsDataStore CAMBIA
  const intermediateSpaceOnTheCanvasOfFinding2 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding2,
  );
  const toggleColorSpaceBetweenFinding2 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding2,
  );

  // Obtener el color guardado para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding2.find((item) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;

    toggleColorSpaceBetweenFinding2({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id,
    });
  };

  return (
    <svg width="20" height="20" onClick={handleClick} style={{ cursor: 'pointer' }} className="interactive-svg">
      {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
      <rect width="20" height="20" fill={predefinedMarkedOptions.includes(selectedOption) ? 'lightgray' : 'white'} />

      {/* Si tiene un color guardado, dibuja el diseño correspondiente */}
      {storedColor && intermediateSpaceOnTheCanvasOfFinding1DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 1 && (
            <Finding2Design2 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <Finding2Design2 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <Finding2Design2 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding2;
