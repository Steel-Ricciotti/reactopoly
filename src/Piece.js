// src/Piece.js
import React from 'react';
import { properties } from './properties';
const getPieceStyle = (pieceType, playerId) => {
  const baseStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid #333',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  };
  const offsets = {
    'Player 1': { x: -5, y: -5 },
    'Player 2': { x: 5, y: -5 },
    'Player 3': { x: -5, y: 5 },
    'Player 4': { x: 5, y: 5 },
  };
  const offset = offsets[playerId] || { x: 0, y: 0 };
  switch (pieceType) {
    case 'Thimble':
      return {
        ...baseStyle,
        backgroundColor: 'silver',
        borderRadius: '50% 50% 0 0',
      };
      case 'Car':
        return {
          ...baseStyle,
          backgroundColor: 'red',
          borderRadius: '4px',
          left: `${offset.x}px`,
          top: `${offset.y}px`,
        };
      case 'Dog':
        return {
          ...baseStyle,
          backgroundColor: 'brown',
          borderRadius: '25%',
          left: `${offset.x}px`,
          top: `${offset.y}px`,
        };
      case 'Hat':
        return {
          ...baseStyle,
          backgroundColor: 'black',
          borderRadius: '50% 50% 0 0',
          height: '24px',
          left: `${offset.x}px`,
          top: `${offset.y}px`,
        };
      default:
        return baseStyle;
  }
};

const Piece = ({ position, pieceType = 'Thimble', playerId }) => {
  const gridSize = 600 / 11; // Board is 600px, 11 grid cells
  const cellCenter = gridSize / 2; // Center of each grid cell  
  const prop = properties[position];
  const style = {
    ...getPieceStyle(pieceType, playerId),
    left: `${(prop.pos[1] - 1) * gridSize + cellCenter}px`,
    top: `${(prop.pos[0] - 1) * gridSize + cellCenter}px`,
  };

  return <div style={style}></div>;
};

export default Piece;