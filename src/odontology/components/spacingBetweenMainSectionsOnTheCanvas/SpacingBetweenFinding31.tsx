import React from 'react';
import useDentalFormStore from '../../store/dentalFormData';
import useSpaceBetweenLegendsDataStore from '../../store/spaceBetweenMainSectionsOnTheCanvasData';
import {
  Finding1Design4,
  Finding1Design5,
  Finding1Design6,
  Finding2Design2,
  TwoHorizontalLines20x20,
} from '../../designs/figuras';
import './SpaceBetweenStyles.css';
const SpaceBetweenFinding31 = ({ id }) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [31]; // Opciones que activan la selección

  // Store useSpaceBetweenLegendsDataStore CAMBIA
  const intermediateSpaceOnTheCanvasOfFinding31 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding31,
  );
  const toggleColorSpaceBetweenFinding31 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding31,
  );

  // Obtener el color guardado para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding31.find((item) => item.id === id);
  const storedColor = legend?.color;
  //console.log("storedColor space 31: " + JSON.stringify(storedColor))
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;
  /* const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding31({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  }; */

  return (
    <svg
      width="20"
      height="20"
      //onClick={handleClick}
      style={{ cursor: 'pointer' }}
      className="interactive-svg"
    >
      {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
      <rect width="20" height="20" fill={predefinedMarkedOptions.includes(selectedOption) ? 'lightgray' : 'white'} />

      {/* Si tiene un color guardado, dibuja el diseño correspondiente */}
      {storedColor && intermediateSpaceOnTheCanvasOfFinding1DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 1 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding31;
