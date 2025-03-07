import SpaceBetweenLegends from './spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenLegends';
import SpaceBetweenTeeth from './spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenTeeth';
import ToothDetails from './ToothDetails';
import ToothVisualization from './ToothVisualization';
import { teeth } from '../data/teethData.json';
import {
  spaceBetweenLegends,
  intermediateSpaceOnTheCanvasOfFinding1,
  intermediateSpaceOnTheCanvasOfFinding2,
  intermediateSpaceOnTheCanvasOfFinding24,
  intermediateSpaceOnTheCanvasOfFinding25,
  intermediateSpaceOnTheCanvasOfFinding30,
  intermediateSpaceOnTheCanvasOfFinding31,
  intermediateSpaceOnTheCanvasOfFinding32,
  intermediateSpaceOnTheCanvasOfFinding7,
  intermediateSpaceOnTheCanvasOfFinding6,
  intermediateSpaceOnTheCanvasOfFinding26,
  intermediateSpaceOnTheCanvasOfFinding39,
} from '../data/spacingBetweenMainSectionsOnTheCanvas.json';
import React from 'react';
import FormComponent from './FormComponent';
import MainSectionOnTheCanvas from './MainSectionOnTheCanvas';
import SpaceBetweenFinding1 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding1';
import SpaceBetweenFinding2 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding2';
import SpaceBetweenFinding24 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding24';
import SpaceBetweenFinding25 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding25';
import SpaceBetweenFinding30 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding30';
import SpaceBetweenFinding31 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding31';
import SpaceBetweenFinding32 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding32';
import SpaceBetweenFinding13 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding13';
import SpacingBetweenFinding26 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding26';
import SpacingBetweenFinding39 from './spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding39';
export default function AdultUpperTeeth() {
  return (
    <>
      {/* Renderizar ToothDetails con SpaceBetweenLegends */}
      {/* Aunque no es cómodo renderizar 2 componentes con estas posiciones, lo realicé para no tener
      un listado largo de componentes declarados sin un iterador */}
      {
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
          {teeth.map((tooth, index) => (
            <React.Fragment key={tooth.id}>
              <ToothDetails idTooth={tooth.id} initialText={''} legend={tooth.id} />
              {index < spaceBetweenLegends.length && <SpaceBetweenLegends id={spaceBetweenLegends[index].id} />}
            </React.Fragment>
          ))}
        </div>
      }
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={1}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding1 id={intermediateSpaceOnTheCanvasOfFinding1[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={2}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding2 id={intermediateSpaceOnTheCanvasOfFinding2[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={30}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding30 id={intermediateSpaceOnTheCanvasOfFinding30[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={31}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding31 id={intermediateSpaceOnTheCanvasOfFinding31[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={32}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding32 id={intermediateSpaceOnTheCanvasOfFinding32[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={-1}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpacingBetweenFinding26 id={intermediateSpaceOnTheCanvasOfFinding26[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={39}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpacingBetweenFinding39 id={intermediateSpaceOnTheCanvasOfFinding39[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Renderizar ToothVisualization con SpaceBetweenTeeth */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <ToothVisualization idTooth={tooth.id} zones={tooth.zones.length} design={tooth.displayProperties.design} />
            {index < spaceBetweenLegends.length && (
              <SpaceBetweenTeeth
                idIntermediateSpaceOnTheCanvasOfFinding7={intermediateSpaceOnTheCanvasOfFinding7[index].id}
                idIntermediateSpaceOnTheCanvasOfFinding6={intermediateSpaceOnTheCanvasOfFinding6[index].id}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={24}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding24 id={intermediateSpaceOnTheCanvasOfFinding24[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={25}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding25 id={intermediateSpaceOnTheCanvasOfFinding25[index].id} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Box rows pero usando la data de los dientes */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        {teeth.map((tooth, index) => (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id} // Pasamos el ID del diente
              optionId={13}
            />
            {index < spaceBetweenLegends.length && ( //falta aquí el ID del BoxB
              <SpaceBetweenFinding13 />
            )}
          </React.Fragment>
        ))}
      </div>
      {<FormComponent />}
    </>
  );
}
