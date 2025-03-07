import React from 'react';
import { ComboBox, Dropdown, Button, Stack } from '@carbon/react';
import useDentalFormStore from '../store/dentalFormData';
import {
  Finding13Design1,
  Finding13Design2,
  Finding8Design1,
  Finding8Design2,
  Finding8Design3,
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
  // Importa aquí todos los componentes de diseño que necesites
} from '../../ui/teeths/odontology-design';

// Mapeo de nombres de componentes a componentes reales
const designComponentMap = {
  Finding8Design1: Finding8Design1,
  Finding8Design2: Finding8Design2,
  Finding8Design3: Finding8Design3,
  Finding13Design1: Finding13Design1,
  Finding13Design2: Finding13Design2,
  Finding37Design1: Finding37Design1,
  Finding37Design2: Finding37Design2,
  Finding37Design3: Finding37Design3,
  Finding37Design4: Finding37Design4,
  Finding37Design5: Finding37Design5,
  Finding36Design1: Finding36Design1,
  Finding36Design2: Finding36Design2,
  Finding10Design1: Finding10Design1,
  Finding10Design2: Finding10Design2,
  Finding10Design3: Finding10Design3,
  Finding10Design4: Finding10Design4,
  Finding10Design5: Finding10Design5,
  Finding10Design6: Finding10Design6,
  Finding10Design7: Finding10Design7,
  Finding10Design8: Finding10Design8,
  Finding5Design1: Finding5Design1,
  Finding5Design2: Finding5Design2,
  Finding5Design3: Finding5Design3,
  Finding5Design4: Finding5Design4,
  Finding5Design5: Finding5Design5,
  Finding5Design6: Finding5Design6,
  Finding5Design7: Finding5Design7,
  Finding5Design8: Finding5Design8,
  Finding5Design9: Finding5Design9,
  Finding5Design10: Finding5Design10,
  Finding5Design11: Finding5Design11,
  Finding5Design12: Finding5Design12,
  Finding5Design13: Finding5Design13,
  Finding5Design14: Finding5Design14,
  Finding16Design1: Finding5Design1,
  Finding16Design2: Finding5Design2,
  Finding16Design3: Finding5Design3,
  Finding16Design4: Finding5Design4,
  Finding16Design5: Finding5Design5,
  Finding16Design6: Finding5Design6,
  Finding16Design7: Finding5Design7,
  Finding16Design8: Finding5Design8,
  Finding16Design9: Finding5Design9,
  Finding16Design10: Finding5Design10,
  Finding16Design11: Finding5Design11,
  Finding16Design12: Finding5Design12,
  Finding16Design13: Finding5Design13,
  Finding16Design14: Finding5Design14,
  Finding27Design1: Finding5Design1,
  Finding27Design2: Finding5Design2,
  Finding27Design3: Finding5Design3,
  Finding27Design4: Finding5Design4,
  Finding27Design5: Finding5Design5,
  Finding27Design6: Finding5Design6,
  Finding27Design7: Finding5Design7,
  Finding27Design8: Finding5Design8,
  Finding27Design9: Finding27Design9,
  Finding34Design1: Finding5Design1,
  Finding34Design2: Finding5Design2,
  Finding34Design3: Finding5Design3,
  Finding34Design4: Finding5Design4,
  Finding34Design5: Finding5Design5,
  Finding34Design6: Finding5Design6,
  Finding34Design7: Finding5Design7,
  Finding34Design8: Finding5Design8,
  Finding34Design9: Finding5Design9,
  Finding34Design10: Finding5Design10,
  Finding34Design11: Finding5Design11,
  Finding34Design12: Finding5Design12,
  Finding34Design13: Finding5Design13,
  Finding34Design14: Finding5Design14,
  Finding35Design1: Finding35Design1,
  Finding35Design2: Finding35Design2,
  Finding35Design3: Finding35Design3,
  Finding35Design4: Finding35Design4,
  Finding35Design5: Finding35Design5,
  Finding35Design6: Finding35Design6,
  Finding35Design7: Finding35Design7,
  Finding35Design8: Finding35Design8,
  Finding35Design9: Finding35Design9,
  Finding35Design10: Finding35Design10,
  Finding35Design11: Finding35Design11,
  Finding35Design12: Finding35Design12,
  Finding35Design13: Finding35Design13,
  Finding35Design14: Finding35Design14,
};

const FormDentalClinicalFindings = () => {
  const opciones = useDentalFormStore((state) => state.opciones);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedDesign = useDentalFormStore((state) => state.selectedDesign);
  const setSelectedOption = useDentalFormStore((state) => state.setSelectedOption);
  const setSelectedColor = useDentalFormStore((state) => state.setSelectedColor);
  const setSelectedSuboption = useDentalFormStore((state) => state.setSelectedSuboption);
  const setSelectedDesign = useDentalFormStore((state) => state.setSelectedDesign);
  const isComplete = useDentalFormStore((state) => state.isComplete);

  const selectedItem = opciones.find((op) => op.id === selectedOption) || null;

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleFilter = ({ item, inputValue }) => {
    if (!inputValue || inputValue.trim() === '') {
      return true;
    }
    const normalizedInput = normalizeText(inputValue);
    const normalizedItemName = normalizeText(item.nombre);
    return normalizedItemName.includes(normalizedInput);
  };

  const handleComboBoxChange = ({ selectedItem: newItem }) => {
    // Solo actualizamos si realmente hay un cambio o si newItem es null por una deselección explícita
    if (newItem || (!newItem && selectedItem?.id !== selectedOption)) {
      setSelectedOption(newItem?.id || null);
    }
  };
  return (
    <>
      <div>
        <h1>Odontograma</h1>
      </div>
      <Stack
        gap={6}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          margin: '20px 0',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', width: '250PX' }}>
          <ComboBox
            id="main-option"
            titleText="Selecciona un hallazgo"
            placeholder="Buscar o seleccionar hallazgo..."
            selectedItem={selectedItem}
            onChange={handleComboBoxChange}
            items={opciones}
            itemToString={(item) => (item ? `${item.id}- ${item.nombre}` : '')}
            shouldFilterItem={handleFilter}
          />
        </div>

        {selectedItem?.subopciones?.length > 0 && (
          <Dropdown
            id="suboption"
            titleText="Selecciona el tipo"
            label="-- Selecciona --"
            selectedItem={selectedItem.subopciones.find((subop) => subop.id === selectedSuboption?.id) || null}
            onChange={({ selectedItem }) => setSelectedSuboption(selectedItem)}
            items={selectedItem?.subopciones || []}
            itemToString={(item) => (item ? item.nombre : '-- Selecciona --')}
            style={{ width: '250px' }}
          />
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedItem?.colores?.map((color) => (
            <Button
              key={color.id}
              kind={selectedColor?.name === color.name ? (color.name === 'red' ? 'danger' : 'primary') : 'secondary'}
              onClick={() => setSelectedColor(color)}
              disabled={!selectedItem}
              size="md"
            >
              {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
            </Button>
          ))}
        </div>
        {/* Visualizador de diseños disponibles */}
        {selectedItem?.designs && selectedItem.designs.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
            }}
          >
            {selectedItem.designs.map((design) => {
              // Obtener el componente de diseño según su nombre
              const DesignComponent = designComponentMap[design.componente];

              if (!DesignComponent) {
                return (
                  <div key={design.number} style={{ color: 'red' }}>
                    Componente no encontrado: {design.componente}
                  </div>
                );
              }

              // Determinar si este diseño está seleccionado
              const isSelected = selectedDesign?.number === design.number;

              // Color para mostrar en la vista previa (usar el seleccionado o un color por defecto)
              const previewColor = selectedColor?.name || 'black';

              return (
                <div
                  key={design.number}
                  onClick={() => setSelectedDesign(design)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    border: isSelected ? `2px solid ${previewColor}` : '2px solid transparent',
                    borderRadius: '8px',
                    backgroundColor: '#f4f4f4',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '90px',
                  }}
                >
                  <div style={{ height: '120px', width: '60px' }}>
                    <DesignComponent strokeColor={previewColor} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Stack>
    </>
  );
};

export default FormDentalClinicalFindings;
