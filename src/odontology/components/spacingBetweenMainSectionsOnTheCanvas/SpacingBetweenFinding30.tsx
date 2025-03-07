import React from 'react';
import useDentalFormStore from '../../store/dentalFormData';
import useSpaceBetweenLegendsDataStore from '../../store/spaceBetweenMainSectionsOnTheCanvasData';
import { Finding30Design4, Finding30Design5, Finding30Design6 } from '../../../ui/teeths/odontology-design';
import './SpaceBetweenStyles.css';
const SpaceBetweenFinding30 = ({ id }) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [30]; // Opciones que activan la selección

  // Store useSpaceBetweenLegendsDataStore
  const intermediateSpaceOnTheCanvasOfFinding30 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding30,
  );
  const toggleColorSpaceBetweenFinding30 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding30,
  );

  // Obtener el color guardado para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding30.find((item) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;

    toggleColorSpaceBetweenFinding30({
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
            <Finding30Design4 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <Finding30Design5 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <Finding30Design6 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding30;
