import React from 'react';
import useDentalFormStore from '../../store/dentalFormData';
import useSpaceBetweenLegendsDataStore from '../../store/spaceBetweenMainSectionsOnTheCanvasData';
import { Finding6Design1, Finding7Design2 } from '../../../ui/teeths/odontology-design';
import './SpaceBetweenStyles.css';

const SpaceBetweenTeeth = ({ idIntermediateSpaceOnTheCanvasOfFinding7, idIntermediateSpaceOnTheCanvasOfFinding6 }) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);

  // Opciones que activan el sombreado
  const shadingOptions = [6, 7];
  // Opciones que permiten la selección con click
  const clickableOptions = [6];

  // Store useSpaceBetweenLegendsDataStore
  const intermediateSpaceOnTheCanvasOfFinding7 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding7,
  );
  const intermediateSpaceOnTheCanvasOfFinding6 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding6,
  );
  const toggleColorSpaceBetweenFinding6 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding6,
  );

  // Obtener los datos guardados para este espacio (opción 7)
  const legend7 = intermediateSpaceOnTheCanvasOfFinding7.find(
    (item) => item.id === idIntermediateSpaceOnTheCanvasOfFinding7,
  );
  const storedColor7 = legend7?.color;
  const dynamicDesign7 = legend7?.dynamicDesign;

  // Obtener los datos guardados para este espacio (opción 6)
  const legend6 = intermediateSpaceOnTheCanvasOfFinding6.find(
    (item) => item.id === idIntermediateSpaceOnTheCanvasOfFinding6,
  );
  const findings6 = legend6?.findings || [];

  const handleClick = () => {
    // Solo permitir el click si la opción seleccionada está en clickableOptions (solo el 6)
    if (!isComplete || !clickableOptions.includes(selectedOption)) return;

    toggleColorSpaceBetweenFinding6({
      idIntermediateSpaceOnTheCanvasOfFinding6,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id,
    });
  };

  // Determinar si se debe sombrear (opción 6 o 7)
  const shouldShade = shadingOptions.includes(selectedOption);
  // Determinar si es interactivo (solo opción 6)
  const isInteractive = clickableOptions.includes(selectedOption);

  return (
    <svg
      width="20"
      height="60"
      onClick={handleClick}
      style={{ cursor: isInteractive ? 'pointer' : 'default' }}
      className={isInteractive ? 'interactive-svg' : ''}
    >
      {/* Fondo con sombreado si la opción seleccionada está en shadingOptions */}
      <rect width="20" height="60" fill={shouldShade ? 'lightgray' : 'white'} opacity="0.45" />

      {/* Renderiza los hallazgos de la opción 7 */}
      {storedColor7 && dynamicDesign7 && (
        <>{dynamicDesign7 === 1 && <Finding7Design2 strokeColor={storedColor7.name} />}</>
      )}

      {/* Renderiza los hallazgos de la opción 6 */}
      {findings6.length > 0 && (
        <>
          {findings6.map((finding) => (
            <React.Fragment key={finding.uniqueId}>
              {finding.dynamicDesign === 1 && finding.color && <Finding6Design1 strokeColor={finding.color.name} />}
            </React.Fragment>
          ))}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenTeeth;
