// src/Board.js
import React, { useState, useEffect } from 'react';
import Property from './Property';
import Corner from './Corner';
import Dice from './Dice';
import Piece from './Piece';
import Player from './Player';
import { properties as initialProperties } from './properties';

const Board = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [properties, setProperties] = useState(initialProperties);
  const [players, setPlayers] = useState([
    {
      id: 'Player 1',
      name: 'Player 1',
      piece: 'Thimble',
      balance: 1500.0,
      properties: [],
      side: 'bottom',
      position: 0,
    },
    {
      id: 'Player 2',
      name: 'Player 2',
      piece: 'Car',
      balance: 1500.0,
      properties: [],
      side: 'left',
      position: 0,
    },
    {
      id: 'Player 3',
      name: 'Player 3',
      piece: 'Dog',
      balance: 1500.0,
      properties: [],
      side: 'top',
      position: 0,
    },
    {
      id: 'Player 4',
      name: 'Player 4',
      piece: 'Hat',
      balance: 1500.0,
      properties: [],
      side: 'right',
      position: 0,
    },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState('Player 1');

  const handlePropertyClick = (name) => {
    setSelectedProperty(name);
  };

  const nextTurn = () => {
    const currentIndex = players.findIndex((p) => p.id === currentPlayer);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayer(players[nextIndex].id);
  };

  const handlePositionUpdate = (playerId, newPosition) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, position: newPosition } : p
      )
    );
    setFlashTrigger(true);
  };

  const handleBuy = (playerId) => {
    const currentProperty = properties[players.find((p) => p.id === playerId).position];
    const player = players.find((p) => p.id === playerId);
    if (
      currentProperty.owner === null &&
      currentProperty.price !== undefined &&
      player.balance >= currentProperty.price
    ) {
      setProperties((prev) =>
        prev.map((prop, index) =>
          index === player.position ? { ...prop, owner: playerId } : prop
        )
      );
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId
            ? {
                ...p,
                balance: p.balance - currentProperty.price,
                properties: [...p.properties, { ...currentProperty, owner: playerId }],
              }
            : p
        )
      );
      setFlashTrigger(true);
      nextTurn();
    }
  };

  const handleOther = () => {
    setFlashTrigger(true);
    nextTurn();
  };

  const handlePass = () => {
    setFlashTrigger(true);
    nextTurn();
  };

  const getGroupedProperties = (properties) => {
    const groups = {};
    properties.forEach((prop) => {
      if (prop.group && prop.group !== "railroad" && prop.group !== "utility") {
        if (!groups[prop.group]) {
          groups[prop.group] = [];
        }
        groups[prop.group].push(prop);
      } else {
        // Non-grouped properties (railroads, utilities, etc.) treated as individual groups
        groups[prop.name] = [prop];
      }
    });
    return Object.entries(groups).map(([group, props], index) => ({ group, props, index }));
  };

  const getCardPositionStyle = (side, index) => {
    switch (side) {
      case 'bottom':
        return { bottom: '-85px', left: `${10 + index * 65}px` };
      case 'left':
        return { left: '-75px', top: `${10 + index * 85}px` };
      case 'top':
        return { top: '-85px', left: `${10 + index * 65}px` };
      case 'right':
        return { right: '-75px', top: `${10 + index * 85}px` };
      default:
        return { bottom: '-85px', left: `${10 + index * 65}px` };
    }
  };

  useEffect(() => {
    if (flashTrigger) {
      setTimeout(() => setFlashTrigger(false), 1500);
    }
  }, [flashTrigger]);

  const currentPlayerObj = players.find((p) => p.id === currentPlayer);

  return (
    <div className="game-container">
      <div className="board">
        <div className="center">
          Monopoly
          <Dice
            onRoll={() => {}}
            onPositionUpdate={handlePositionUpdate}
            onBuy={() => handleBuy(currentPlayer)}
            onPass={handlePass}
            onOther={handleOther}
            currentPlayerObj={currentPlayerObj}
            currentPlayer={currentPlayer}
            players={players}
            properties={properties}
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
        {players.map((player) => (
          <Piece
            key={player.id}
            position={player.position}
            pieceType={player.piece}
            playerId={player.id}
          />
        ))}
        {players.map((player) => {
          const groupedProperties = getGroupedProperties(player.properties);
          return groupedProperties.map(({ group, props, index }) => (
            <div
              key={`${player.id}-${group}`}
              className="property-card"
              style={getCardPositionStyle(player.side, index)}
            >
              <div className={`color-bar ${props[props.length - 1].color}`}></div>
              <span>{props[props.length - 1].name}</span>
              {props.length > 1 && <div className="stack-count">{props.length}</div>}
            </div>
          ));
        })}
      </div>
      <div className="sidebar">
        {players.map((player) => (
          <Player
            key={player.id}
            name={player.name}
            piece={player.piece}
            balance={player.balance}
            properties={player.properties}
            isCurrent={player.id === currentPlayer}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;