// src/Board.js
import React, { useState } from 'react';
import Property from './Property';
import Corner from './Corner';
import { properties } from './properties';

const Board = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handlePropertyClick = (name) => {
    setSelectedProperty(name);
  };

  return (
    <div className="board">
      <div className="center">Monopoly</div>
      {properties.map((prop) => {
        if (prop.type === 'corner') {
          return <Corner key={prop.name} name={prop.name} pos={prop.pos} />;
        }
        return (
          <Property
            key={prop.name}
            name={prop.name}
            color={prop.color}
            pos={prop.pos}
            isSelected={selectedProperty === prop.name}
            onClick={() => handlePropertyClick(prop.name)}
          />
        );
      })}
    </div>
  );
};

export default Board;