import { create } from 'zustand';
import {
  spaceBetweenLegends as initialSpaceBetweenLegends,
  intermediateSpaceOnTheCanvasOfFinding1 as initialIntermediateSpaceOnTheCanvasOfFinding1,
  intermediateSpaceOnTheCanvasOfFinding2 as initialIntermediateSpaceOnTheCanvasOfFinding2,
  intermediateSpaceOnTheCanvasOfFinding24 as initialIntermediateSpaceOnTheCanvasOfFinding24,
  intermediateSpaceOnTheCanvasOfFinding25 as initialIntermediateSpaceOnTheCanvasOfFinding25,
  intermediateSpaceOnTheCanvasOfFinding30 as initialIntermediateSpaceOnTheCanvasOfFinding30,
  intermediateSpaceOnTheCanvasOfFinding31 as initialIntermediateSpaceOnTheCanvasOfFinding31,
  intermediateSpaceOnTheCanvasOfFinding32 as initialIntermediateSpaceOnTheCanvasOfFinding32,
  intermediateSpaceOnTheCanvasOfFinding7 as initialIntermediateSpaceOnTheCanvasOfFinding7,
  intermediateSpaceOnTheCanvasOfFinding6 as initialIntermediateSpaceOnTheCanvasOfFinding6,
  intermediateSpaceOnTheCanvasOfFinding26 as initialIntermediateSpaceOnTheCanvasOfFinding26,
  intermediateSpaceOnTheCanvasOfFinding39 as initialIntermediateSpaceOnTheCanvasOfFinding39,
} from '../data/spacingBetweenMainSectionsOnTheCanvas.json';
import useDentalDataStore from './dentalData';
// Archivo para definir los diseños. Se tendrán dos funciones para cada hallazgo: toggleColor y calculateDynamicDesign
const useSpaceBetweenLegendsDataStore = create((set, get) => ({
  spaceBetweenLegends: initialSpaceBetweenLegends || [],
  intermediateSpaceOnTheCanvasOfFinding1: initialIntermediateSpaceOnTheCanvasOfFinding1 || [],
  intermediateSpaceOnTheCanvasOfFinding2: initialIntermediateSpaceOnTheCanvasOfFinding2,
  intermediateSpaceOnTheCanvasOfFinding24: initialIntermediateSpaceOnTheCanvasOfFinding24,
  intermediateSpaceOnTheCanvasOfFinding25: initialIntermediateSpaceOnTheCanvasOfFinding25,
  intermediateSpaceOnTheCanvasOfFinding30: initialIntermediateSpaceOnTheCanvasOfFinding30,
  intermediateSpaceOnTheCanvasOfFinding31: initialIntermediateSpaceOnTheCanvasOfFinding31,
  intermediateSpaceOnTheCanvasOfFinding32: initialIntermediateSpaceOnTheCanvasOfFinding32,
  intermediateSpaceOnTheCanvasOfFinding7: initialIntermediateSpaceOnTheCanvasOfFinding7,
  intermediateSpaceOnTheCanvasOfFinding6: initialIntermediateSpaceOnTheCanvasOfFinding6 || [],
  intermediateSpaceOnTheCanvasOfFinding26: initialIntermediateSpaceOnTheCanvasOfFinding26 || [],
  intermediateSpaceOnTheCanvasOfFinding39: initialIntermediateSpaceOnTheCanvasOfFinding39 || [],
  toggleColorSpaceBetweenFinding6: (params) => {
    const { idIntermediateSpaceOnTheCanvasOfFinding6, newColor, optionId, subOptionId } = params;

    set((state) => {
      return {
        intermediateSpaceOnTheCanvasOfFinding6: state.intermediateSpaceOnTheCanvasOfFinding6.map((legend) => {
          if (legend.id === idIntermediateSpaceOnTheCanvasOfFinding6) {
            // Verificamos si ya existe un finding con estos valores
            const existingFindingIndex = legend.findings.findIndex(
              (f) => f.optionId === optionId && f.subOptionId === subOptionId,
            );

            // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
            if (
              existingFindingIndex !== -1 &&
              JSON.stringify(legend.findings[existingFindingIndex].color) === JSON.stringify(newColor)
            ) {
              // Filtrar el finding a eliminar
              const updatedFindings = legend.findings.filter((_, index) => index !== existingFindingIndex);

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe o tiene diferente color, lo agregamos o actualizamos
            else {
              // Crear nuevo finding con datos clínicos
              const newFinding = {
                uniqueId: Math.floor(Math.random() * 1000000),
                optionId,
                subOptionId,
                color: newColor,
                dynamicDesign: 1,
              };

              // Si ya existe un finding similar, lo actualizamos
              if (existingFindingIndex !== -1) {
                const updatedFindings = [...legend.findings];
                updatedFindings[existingFindingIndex] = newFinding;

                return {
                  ...legend,
                  findings: updatedFindings,
                };
              }
              // Si no existe, lo agregamos
              else {
                return {
                  ...legend,
                  findings: [...legend.findings, newFinding],
                };
              }
            }
          }
          return legend;
        }),
      };
    });
  },

  // Función para calcular el diseño dinámico para la opción 6
  calculateDynamicDesignFinding6: (params) => {
    const {
      idIntermediateSpaceOnTheCanvasOfFinding6,
      origin = 'spaceBetweenFinding6',
      optionId,
      subOptionId,
      color,
    } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + idIntermediateSpaceOnTheCanvasOfFinding6);
      const teeth = useDentalDataStore.getState().teeth;

      const updatedIntermediateSpaceOnTheCanvasOfFinding6 = state.intermediateSpaceOnTheCanvasOfFinding6.map(
        (legend) => {
          if (legend.id === idIntermediateSpaceOnTheCanvasOfFinding6) {
            let newDynamicDesign = 1; // valor por defecto

            // Puedes agregar lógica aquí para determinar el diseño basado en los findings
            // Por ejemplo, podrías evaluar todos los findings y seleccionar un diseño basado en ellos

            return {
              ...legend,
              dynamicDesign: newDynamicDesign,
            };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding6: updatedIntermediateSpaceOnTheCanvasOfFinding6,
      };
    });
  },
  toggleColorSpaceBetweenLegends: (params) => {
    // Sección de la gestión del diseño del hallazgo 11
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      spaceBetweenLegends: state.spaceBetweenLegends.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignForLegend({
      legendId: id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'legend',
    });
  },

  calculateDynamicDesignForLegend: (params) => {
    const { legendId, origin = 'legend', optionId, subOptionId, color } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const updatedLegends = state.spaceBetweenLegends.map((legend) => {
        if (legend.id === legendId) {
          const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
          const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
          const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

          // Validar explícitamente si hay color en cada caso
          const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
          const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
          const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return { spaceBetweenLegends: updatedLegends };
    });

    if (origin === 'legend') {
      const legend = get().spaceBetweenLegends.find((l) => l.id === legendId);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding11Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'legend',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding11Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'legend',
          });
        }
      }
    }
  },

  toggleColorSpaceBetweenFinding1: (params) => {
    // Sección de la gestión del diseño del hallazgo 11
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding1: state.intermediateSpaceOnTheCanvasOfFinding1.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding1({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding1',
    });
  },

  calculateDynamicDesignFinding1: (params) => {
    const { id, origin = 'spaceBetweenFinding1', optionId, subOptionId, color } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding1 = state.intermediateSpaceOnTheCanvasOfFinding1.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding1: updatedIntermediateSpaceOnTheCanvasOfFinding1,
      };
    });
    // Falta modificar el calculateFindingDesign

    if (origin === 'spaceBetweenFinding1') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding1.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding1Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding1',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding1Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding1',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding2: (params) => {
    // Sección de la gestión del diseño del hallazgo 2
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding2: state.intermediateSpaceOnTheCanvasOfFinding2.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding2({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding2',
    });
  },

  calculateDynamicDesignFinding2: (params) => {
    const { id, origin = 'spaceBetweenFinding2', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding2 = state.intermediateSpaceOnTheCanvasOfFinding2.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding2: updatedIntermediateSpaceOnTheCanvasOfFinding2,
      };
    });

    if (origin === 'spaceBetweenFinding2') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding2.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding2Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding2',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding2Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding2',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding7: (params) => {
    // Sección de la gestión del diseño del hallazgo 7
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding7: state.intermediateSpaceOnTheCanvasOfFinding7.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding7({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding7',
    });
  },

  calculateDynamicDesignFinding7: (params) => {
    const { id, origin = 'spaceBetweenFinding7', optionId, subOptionId, color } = params;
    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding7 = state.intermediateSpaceOnTheCanvasOfFinding7.map(
        (legend) => {
          if (legend.id === id) {
            let newDynamicDesign = 1; // valor por defecto
            return { ...legend, dynamicDesign: newDynamicDesign, color };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding7: updatedIntermediateSpaceOnTheCanvasOfFinding7,
      };
    });
    // Falta modificar el calculateFindingDesign

    if (origin === 'spaceBetweenFinding7') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding30.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding7Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding7',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding7Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding7',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding24: (params) => {
    // Sección de la gestión del diseño del hallazgo 24
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding24: state.intermediateSpaceOnTheCanvasOfFinding24.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding24({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding24',
    });
  },

  calculateDynamicDesignFinding24: (params) => {
    const { id, origin = 'spaceBetweenFinding24', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding24 = state.intermediateSpaceOnTheCanvasOfFinding24.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding24: updatedIntermediateSpaceOnTheCanvasOfFinding24,
      };
    });

    if (origin === 'spaceBetweenFinding24') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding24.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding24Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding24',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding24Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding24',
          });
        }
      }
    }
  },
  calculateDynamicDesignFinding25: (params) => {
    const { id, origin = 'spaceBetweenFinding25', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding25 = state.intermediateSpaceOnTheCanvasOfFinding25.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding25: updatedIntermediateSpaceOnTheCanvasOfFinding25,
      };
    });

    if (origin === 'spaceBetweenFinding25') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding25.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding25Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding25',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding25Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding25',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding26: (params) => {
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => {
      return {
        intermediateSpaceOnTheCanvasOfFinding26: state.intermediateSpaceOnTheCanvasOfFinding26.map((legend) => {
          if (legend.id === id) {
            // Verificamos si ya existe un finding con estos valores
            const existingFindingIndex = legend.findings.findIndex(
              (f) => f.optionId === optionId && f.subOptionId === subOptionId,
            );

            // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
            if (
              existingFindingIndex !== -1 &&
              JSON.stringify(legend.findings[existingFindingIndex].color) === JSON.stringify(newColor)
            ) {
              // Filtrar el finding a eliminar
              const updatedFindings = legend.findings.filter((_, index) => index !== existingFindingIndex);

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe o tiene diferente color, lo agregamos o actualizamos
            else {
              // Crear nuevo finding con datos clínicos
              const newFinding = {
                uniqueId: Math.floor(Math.random() * 1000000),
                optionId,
                subOptionId,
                color: newColor,
                dynamicDesign: 1,
              };

              // Si ya existe un finding similar, lo actualizamos
              if (existingFindingIndex !== -1) {
                const updatedFindings = [...legend.findings];
                updatedFindings[existingFindingIndex] = newFinding;

                return {
                  ...legend,
                  findings: updatedFindings,
                };
              }
              // Si no existe, lo agregamos
              else {
                return {
                  ...legend,
                  findings: [...legend.findings, newFinding],
                };
              }
            }
          }
          return legend;
        }),
      };
    });
  },

  // Función para calcular el diseño dinámico para la opción 6
  calculateDynamicDesignFinding26: (params) => {
    const { id, origin = 'spaceBetweenFinding6', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;

      const updatedIntermediateSpaceOnTheCanvasOfFinding6 = state.intermediateSpaceOnTheCanvasOfFinding6.map(
        (legend) => {
          if (legend.id === id) {
            let newDynamicDesign = 1; // valor por defecto

            // Puedes agregar lógica aquí para determinar el diseño basado en los findings
            // Por ejemplo, podrías evaluar todos los findings y seleccionar un diseño basado en ellos

            return {
              ...legend,
              dynamicDesign: newDynamicDesign,
            };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding6: updatedIntermediateSpaceOnTheCanvasOfFinding6,
      };
    });
  },
  toggleColorSpaceBetweenFinding30: (params) => {
    // Sección de la gestión del diseño del hallazgo 30
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding30: state.intermediateSpaceOnTheCanvasOfFinding30.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding30({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding30',
    });
  },

  calculateDynamicDesignFinding30: (params) => {
    const { id, origin = 'spaceBetweenFinding30', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding30 = state.intermediateSpaceOnTheCanvasOfFinding30.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding30: updatedIntermediateSpaceOnTheCanvasOfFinding30,
      };
    });
    // Falta modificar el calculateFindingDesign

    if (origin === 'spaceBetweenFinding30') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding30.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding30Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding30',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding30Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding30',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding31: (params) => {
    // Sección de la gestión del diseño del hallazgo 31
    const { id, newColor, optionId, subOptionId } = params;
    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding31: state.intermediateSpaceOnTheCanvasOfFinding31.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding31({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding31',
    });
  },

  calculateDynamicDesignFinding31: (params) => {
    const { id, origin = 'spaceBetweenFinding31', optionId, subOptionId, color } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding31 = state.intermediateSpaceOnTheCanvasOfFinding31.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);
            console.log('leftFinding:' + JSON.stringify(leftFinding));
            console.log('rightFinding:' + JSON.stringify(rightFinding));
            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }
            console.log('newDynamicDesign para el 31:' + newDynamicDesign);
            return { ...legend, dynamicDesign: newDynamicDesign, color };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding31: updatedIntermediateSpaceOnTheCanvasOfFinding31,
      };
    });

    if (origin === 'spaceBetweenFinding31') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding31.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding31Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding31',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding31Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding31',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding32: (params) => {
    // Sección de la gestión del diseño del hallazgo 32
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => ({
      intermediateSpaceOnTheCanvasOfFinding32: state.intermediateSpaceOnTheCanvasOfFinding32.map((legend) => {
        if (legend.id === id) {
          const updatedColor = JSON.stringify(legend.color) === JSON.stringify(newColor) ? null : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      }),
    }));

    get().calculateDynamicDesignFinding32({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding32',
    });
  },

  calculateDynamicDesignFinding32: (params) => {
    const { id, origin = 'spaceBetweenFinding32', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;
      const updatedIntermediateSpaceOnTheCanvasOfFinding32 = state.intermediateSpaceOnTheCanvasOfFinding32.map(
        (legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find((tooth) => tooth.id === legend.leftToothId);
            const rightTooth = teeth.find((tooth) => tooth.id === legend.rightToothId);

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find((f) => f.optionId === optionId);
            const rightFinding = rightTooth?.findings.find((f) => f.optionId === optionId);

            // Validar explícitamente si hay color en cada caso
            const leftColor = leftFinding?.color != null && Object.keys(leftFinding.color).length > 0;
            const rightColor = rightFinding?.color != null && Object.keys(rightFinding.color).length > 0;
            const hasColor = legend.color != null && Object.keys(legend.color).length > 0;

            let newDynamicDesign = 2; // valor por defecto

            if (hasColor) {
              if (leftColor && rightColor) {
                newDynamicDesign = 3;
              } else if (leftColor) {
                newDynamicDesign = 1;
              } else if (rightColor) {
                newDynamicDesign = 2;
              }
            }

            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        },
      );

      return {
        intermediateSpaceOnTheCanvasOfFinding32: updatedIntermediateSpaceOnTheCanvasOfFinding32,
      };
    });

    if (origin === 'spaceBetweenFinding32') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding32.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding32Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding32',
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding32Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: 'spaceBetweenFinding32',
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding39: (params) => {
    const { id, newColor, optionId, subOptionId } = params;

    set((state) => {
      return {
        intermediateSpaceOnTheCanvasOfFinding39: state.intermediateSpaceOnTheCanvasOfFinding39.map((legend) => {
          if (legend.id === id) {
            // Verificamos si ya existe un finding con estos valores
            const existingFindingIndex = legend.findings.findIndex(
              (f) => f.optionId === optionId && f.subOptionId === subOptionId,
            );

            // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
            if (
              existingFindingIndex !== -1 &&
              JSON.stringify(legend.findings[existingFindingIndex].color) === JSON.stringify(newColor)
            ) {
              // Filtrar el finding a eliminar
              const updatedFindings = legend.findings.filter((_, index) => index !== existingFindingIndex);

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe o tiene diferente color, lo agregamos o actualizamos
            else {
              // Crear nuevo finding con datos clínicos
              const newFinding = {
                uniqueId: Math.floor(Math.random() * 1000000),
                optionId,
                subOptionId,
                color: newColor,
                dynamicDesign: 1,
              };

              // Si ya existe un finding similar, lo actualizamos
              if (existingFindingIndex !== -1) {
                const updatedFindings = [...legend.findings];
                updatedFindings[existingFindingIndex] = newFinding;

                return {
                  ...legend,
                  findings: updatedFindings,
                };
              }
              // Si no existe, lo agregamos
              else {
                return {
                  ...legend,
                  findings: [...legend.findings, newFinding],
                };
              }
            }
          }
          return legend;
        }),
      };
    });
    get().calculateDynamicDesignFinding39({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: 'spaceBetweenFinding39',
    });
  },

  // Función para calcular el diseño dinámico para la opción 39
  calculateDynamicDesignFinding39: (params) => {
    const { id, origin = 'spaceBetweenFinding39', optionId, subOptionId, color } = params;

    set((state) => {
      console.log('Entrando a modificar espacios between...' + id);
      const teeth = useDentalDataStore.getState().teeth;

      // Corregido: usar el arreglo correcto intermediateSpaceOnTheCanvasOfFinding39 en lugar de 6
      const updatedIntermediateSpaceOnTheCanvasOfFinding39 = state.intermediateSpaceOnTheCanvasOfFinding39.map(
        (legend) => {
          if (legend.id === id) {
            let newDynamicDesign = 1; // valor por defecto
            // Puedes agregar lógica aquí para determinar el diseño basado en los findings
            // Por ejemplo, podrías evaluar todos los findings y seleccionar un diseño basado en ellos
            return {
              ...legend,
              dynamicDesign: newDynamicDesign,
            };
          }
          return legend;
        },
      );

      // Corregido: retornar el arreglo correcto
      return {
        intermediateSpaceOnTheCanvasOfFinding39: updatedIntermediateSpaceOnTheCanvasOfFinding39,
      };
    });

    // Notificar a los dientes si el origen es desde el espacio intermedio
    if (origin === 'spaceBetweenFinding39') {
      const legend = get().intermediateSpaceOnTheCanvasOfFinding39.find((l) => l.id === id);

      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding39Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            // Corregido: usar el origen correcto
            origin: 'spaceBetweenFinding39',
          });
        }

        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding39Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            // Corregido: usar el origen correcto
            origin: 'spaceBetweenFinding39',
          });
        }
      }
    }
  },
}));

export default useSpaceBetweenLegendsDataStore;
