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
  const [properties, setProperties] = useState(
    initialProperties.map(prop => ({ ...prop, numHouses: 0,
       houseCost: 50,
     }))
  );
  const [players, setPlayers] = useState([
    {
      id: 'Player 1',
      name: 'Player 1',
      piece: 'Thimble',
      balance: 15000000.0,
      properties: [
        { ...initialProperties[11], owner: 'Player 1', numHouses: 1 },
        { ...initialProperties[13], owner: 'Player 1', numHouses: 2 },
        { ...initialProperties[14], owner: 'Player 1', numHouses: 3 },

      ],
      side: 'bottom',
      position: 0,
    }
    ,    {
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

  const canBuyHouse = (player, group) => {
    const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
    //return groupProps.length === properties.filter(p => p.group === group).length;
    return true;
  };

  const getNextHouseProperty = (group) => {
    const groupProps = properties
      .filter(p => p.group === group)
      .sort((a, b) => a.pos - b.pos);
    const minHouses = Math.min(...groupProps.map(p => p.numHouses));
    return groupProps.find(p => p.numHouses === minHouses);
  };

  const handleBuyHouse = (playerId, group) => {
  const player = players.find(p => p.id === playerId);
  if (!canBuyHouse(player, group)) return;

  const nextProp = getNextHouseProperty(group);
  if (!nextProp) {
    console.warn('No nextProp found');
    return;
  }

  const houseCost = nextProp.houseCost || 100;
  if (nextProp.numHouses < 4 && player.balance >= houseCost) {
    console.log('Buying house for', nextProp.name);

    // setProperties(prev =>
    //   prev.map((prop, idx) =>
    //     prop.name.trim().toLowerCase() === nextProp.name.trim().toLowerCase()
    //       ? { ...prop, numHouses: prop.numHouses + 1 }
    //       : prop
    //   )
    // );
    console.log('Updating properties:', properties);
    // console.log('Updating prop:', prop);
    console.log('Updating neprop:', nextProp);
    setProperties(prev =>
      prev.map(prop =>
        prop.name === nextProp.name
          ? { ...prop, numHouses: prop.numHouses + 1 }
          : prop
      )
    );
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId ? { ...p, balance: p.balance - houseCost } : p
      )
    );

    setFlashTrigger(true);
  }
};

  // const handleBuyHouse = (playerId, group) => {
  //   const player = players.find(p => p.id === playerId);
  //   if (!canBuyHouse(player, group)) return;
  //   const nextProp = getNextHouseProperty(group);
  //   const houseCost = nextProp.housecost || 100;
  //   if (nextProp && nextProp.houses < 4 && player.balance >= houseCost) {
  //     setProperties(prev =>
  //       prev.map((prop, idx) =>
  //         prop.name === nextProp.name ? { ...prop, houses: prop.houses + 1 } : prop
  //       )
  //     );
  //     setPlayers(prev =>
  //       prev.map(p =>
  //         p.id === playerId ? { ...p, balance: p.balance - houseCost } : p
  //       )
  //     );
  //     setFlashTrigger(true);
  //   }
  // };

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
      if (prop.group && prop.group !== 'railroad' && prop.group !== 'utility') {
        if (!groups[prop.group]) {
          groups[prop.group] = [];
        }
        groups[prop.group].push(prop);
      } else {
        groups[prop.name] = [prop];
      }
    });
    return Object.entries(groups).map(([group, props], index) => ({ group, props, index }));
  };

  const getCardPositionStyle = (side, index) => {
    switch (side) {
      case 'bottom':
        return { left: `${10 + index * 65}px` };
      case 'left':
        return { left: '-75px' };
      case 'top':
        return { left: `${10 + index * 65}px` };
      case 'right':
        return { right: '-75px' };
      default:
        return { left: `${10 + index * 65}px` };
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
            onBuyHouse={handleBuyHouse}
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
              numHouses={prop.numHouses}
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
          return groupedProperties.map(({ group, props }, groupIndex) => {
            return props.map((prop, propertyIndex) => (
              <div
                key={`${player.id}-${group}-${prop.name}`}
                className="property-card"
                style={{
                  ...getCardPositionStyle(player.side, groupIndex),
                  top: player.side === 'left' || player.side === 'right'
                    ? `${10 + groupIndex * 85 + propertyIndex * 20}px`
                    : player.side === 'top'
                    ? `${-85 - propertyIndex * 20}px`
                    : undefined,
                  bottom: player.side === 'bottom'
                    ? `${-85 - propertyIndex * 20}px`
                    : undefined,
                }}
                data-testid="property-card"
              >
                <div className={`color-bar ${prop.color}`}></div>
                <span>{prop.name}</span>
                {propertyIndex === 0 && props.length > 1 && (
                  <div className="stack-count">{props.length}</div>
                )}
                {prop.houses > 0 && (
                  <div className="house-count">{prop.houses}</div>
                )}
              </div>
            ));
          });
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

