// src/Player.js
import React from 'react';

const Player = ({ name, piece, balance, properties }) => {
  return (
    <div className="player-container">
      <h3>{name}</h3>
      <p>Piece: {piece}</p>
      <p>Balance: ${balance.toFixed(2)}</p>
      <p>Properties: {properties.length}</p>
    </div>
  );
};

export default Player;