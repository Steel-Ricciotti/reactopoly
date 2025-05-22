// src/Board.js
import React, { useState, useEffect } from 'react';
import Property from './Property';
import Corner from './Corner';
import Dice from './Dice';
import Piece from './Piece';
import { properties as initialProperties } from './properties';

const Board = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [player1Properties, setPlayer1Properties] = useState([]);
  const [properties, setProperties] = useState(initialProperties);

  const handlePropertyClick = (name) => {
    setSelectedProperty(name);
  };

  const handleDiceRoll = (values) => {
    const total = values[0] + values[1];
    setPlayerPosition((prev) => (prev + total) % 40);
    setFlashTrigger(true);
  };

  const handleBuy = () => {
    const currentProperty = properties[playerPosition];
    if (currentProperty.owner === null && currentProperty.price !== undefined) {
      setProperties((prev) =>
        prev.map((prop, index) =>
          index === playerPosition ? { ...prop, owner: "Player 1" } : prop
        )
      );
      setPlayer1Properties((prev) => [...prev, { ...currentProperty, owner: "Player 1" }]);
      setFlashTrigger(true);
    }
  };

  useEffect(() => {
    if (flashTrigger) {
      setTimeout(() => setFlashTrigger(false), 1500);
    }
  }, [flashTrigger]);

  return (
    <div className="board">
      <div className="center">
        Monopoly
        <Dice
          onRoll={handleDiceRoll}
          onBuy={handleBuy}
          squareName={properties[playerPosition].name}
          squarePrice={properties[playerPosition].price}
          squareOwner={properties[playerPosition].owner}
          triggerFlash={flashTrigger}
        />
      </div>
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
      <Piece position={playerPosition} />
      {player1Properties.map((prop, index) => (
        <div
          key={prop.name}
          className="property-card"
          style={{
            bottom: '-85px',
            left: `${10 + index * 65}px`,
          }}
        >
          <div className={`color-bar ${prop.color}`}></div>
          <span>{prop.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Board;