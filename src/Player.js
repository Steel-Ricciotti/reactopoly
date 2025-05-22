// src/Player.js
import React from 'react';

const Player = ({ name, piece, balance, properties, isCurrent }) => {
  return (
    <div className={`player-container ${isCurrent ? 'current' : ''}`}>
      <h3>{name}</h3>
      <p>Piece: {piece}</p>
      <p>Balance: ${balance.toFixed(2)}</p>
      <p>Properties: {properties.length}</p>
    </div>
  );
};

export default Player;