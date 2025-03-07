import React, { useReducer } from 'react';
import { getPolygonPoints } from '../../ui/teeths/toothPolygon-design';
import './Tooth.css';

const TOGGLE_ZONE = 'TOGGLE_ZONE';

const initialState = (zones) => ({
  Cavities: Array(zones).fill(0),
});

const reducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_ZONE:
      return {
        ...state,
        Cavities: state.Cavities.map((val, index) => (index === action.zone ? (val === 0 ? 1 : 0) : val)),
      };
    default:
      return state;
  }
};

const Tooth = ({ zones, selectedOptionId = 2 }) => {
  const [state, dispatch] = useReducer(reducer, initialState(zones));

  const getClassNamesByZone = (index) => (state.Cavities[index] === 1 ? 'to-do' : '');

  return (
    <svg x="0" y="60" width="60" height="60" viewBox="0 0 20 20" className="tooth">
      {getPolygonPoints(zones).map((points, index) => (
        <polygon
          key={index}
          points={points}
          //onClick={() => handleZoneClick(index)}
          className={getClassNamesByZone(index)}
          strokeWidth="0.15"
          stroke="black"
          style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
        />
      ))}
    </svg>
  );
};

export default Tooth;
