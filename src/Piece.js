// src/Piece.js
import React from 'react';
import { properties } from './properties';
const getPieceStyle = (pieceType) => {
  const baseStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid #333',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  };
  switch (pieceType) {
    case 'Thimble':
      return {
        ...baseStyle,
        backgroundColor: 'silver',
        borderRadius: '50% 50% 0 0',
      };
    default:
      return baseStyle;
  }
};

const Piece = ({ position, pieceType = 'Thimble' }) => {
  //const properties = [
    /* Simplified for brevity; use actual properties.js data */
   // { pos: [0, 10] }, // Go
   // { pos: [1, 10] }, // Mediterranean Avenue
    // ... other properties
  //];
  //const pos = properties[position]?.pos || [0, 10];
  const gridSize = 600 / 11; // Board is 600px, 11 grid cells
  const cellCenter = gridSize / 2; // Center of each grid cell  
  const prop = properties[position];
  const style = {
    ...getPieceStyle(pieceType),
    left: `${(prop.pos[1] - 1) * gridSize + cellCenter}px`,
    top: `${(prop.pos[0] - 1) * gridSize + cellCenter}px`,
  };

  return <div style={style}></div>;
};

export default Piece;