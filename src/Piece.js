// src/Piece.js
import React from 'react';
import { properties } from './properties';

const Piece = ({ position }) => {
  const prop = properties[position];
  const gridSize = 600 / 11; // Board is 600px, 11 grid cells
  const cellCenter = gridSize / 2; // Center of each grid cell

  // Calculate pixel position based on grid coordinates
  const style = {
    left: `${(prop.pos[1] - 1) * gridSize + cellCenter}px`,
    top: `${(prop.pos[0] - 1) * gridSize + cellCenter}px`,
  };

  return <div className="piece" style={style} />;
};

export default Piece;