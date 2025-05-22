// // src/Board.js
// import React, { useState, useEffect } from 'react';
// import Property from './Property';
// import Corner from './Corner';
// import Dice from './Dice';
// import Piece from './Piece';
// import Player from './Player';
// import { properties as initialProperties } from './properties';

// const Board = () => {
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [playerPosition, setPlayerPosition] = useState(0);
//   const [flashTrigger, setFlashTrigger] = useState(false);
//   const [properties, setProperties] = useState(initialProperties);
//   const [players, setPlayers] = useState([
//     {
//       id: 'Player 1',
//       name: 'Player 1',
//       piece: 'Thimble',
//       balance: 1500.0,
//       properties: [],
//     },
//   ]);

//   const handlePropertyClick = (name) => {
//     setSelectedProperty(name);
//   };

//   const handleDiceRoll = (values) => {
//     const total = values[0] + values[1];
//     setPlayerPosition((prev) => (prev + total) % 40);
//     setFlashTrigger(true);
//   };

//   const handleBuy = (playerId) => {
//     const currentProperty = properties[playerPosition];
//     const player = players.find((p) => p.id === playerId);
//     if (
//       currentProperty.owner === null &&
//       currentProperty.price !== undefined &&
//       player.balance >= currentProperty.price
//     ) {
//       setProperties((prev) =>
//         prev.map((prop, index) =>
//           index === playerPosition ? { ...prop, owner: playerId } : prop
//         )
//       );
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.id === playerId
//             ? {
//                 ...p,
//                 balance: p.balance - currentProperty.price,
//                 properties: [...p.properties, { ...currentProperty, owner: playerId }],
//               }
//             : p
//         )
//       );
//       setFlashTrigger(true);
//     }
//   };

//   useEffect(() => {
//     if (flashTrigger) {
//       setTimeout(() => setFlashTrigger(false), 1500);
//     }
//   }, [flashTrigger]);

//   return (
//     <div className="board">
//       <div className="center">
        
//         <Dice
//           onRoll={handleDiceRoll}
//           onBuy={() => handleBuy('Player 1')}
//           squareName={properties[playerPosition].name}
//           squarePrice={properties[playerPosition].price}
//           squareOwner={properties[playerPosition].owner}
//           triggerFlash={flashTrigger}
//         />
//         {players.map((player) => (
//           <Player
//             key={player.id}
//             name={player.name}
//             piece={player.piece}
//             balance={player.balance}
//             properties={player.properties}
//           />
//         ))}
//       </div>
//       {properties.map((prop) => {
//         if (prop.type === 'corner') {
//           return <Corner key={prop.name} name={prop.name} pos={prop.pos} />;
//         }
//         return (
//           <Property
//             key={prop.name}
//             name={prop.name}
//             color={prop.color}
//             pos={prop.pos}
//             isSelected={selectedProperty === prop.name}
//             onClick={() => handlePropertyClick(prop.name)}
//           />
//         );
//       })}
//       <Piece position={playerPosition} pieceType={players[0].piece} />
//       {players.map((player) =>
//         player.properties.map((prop, index) => (
//           <div
//             key={`${player.id}-${prop.name}`}
//             className="property-card"
//             style={{
//               bottom: '-85px',
//               left: `${10 + index * 65}px`,
//             }}
//           >
//             <div className={`color-bar ${prop.color}`}></div>
//             <span>{prop.name}</span>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Board;

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
  const [playerPosition, setPlayerPosition] = useState(0);
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
    },
  ]);

  const handlePropertyClick = (name) => {
    setSelectedProperty(name);
  };

  const handleDiceRoll = (values) => {
    const total = values[0] + values[1];
    setPlayerPosition((prev) => (prev + total) % 40);
    setFlashTrigger(true);
  };

  const handleBuy = (playerId) => {
    const currentProperty = properties[playerPosition];
    const player = players.find((p) => p.id === playerId);
    if (
      currentProperty.owner === null &&
      currentProperty.price !== undefined &&
      player.balance >= currentProperty.price
    ) {
      setProperties((prev) =>
        prev.map((prop, index) =>
          index === playerPosition ? { ...prop, owner: playerId } : prop
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
    }
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

  return (
    <div className="game-container">
      <div className="board">
        <div className="center">
          <Dice
            onRoll={handleDiceRoll}
            onBuy={() => handleBuy('Player 1')}
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
        <Piece position={playerPosition} pieceType={players[0].piece} />
        {players.map((player) =>
          player.properties.map((prop, index) => (
            <div
              key={`${player.id}-${prop.name}`}
              className="property-card"
              style={getCardPositionStyle(player.side, index)}
            >
              <div className={`color-bar ${prop.color}`}></div>
              <span>{prop.name}</span>
            </div>
          ))
        )}
      </div>
      <div className="sidebar">
        {players.map((player) => (
          <Player
            key={player.id}
            name={player.name}
            piece={player.piece}
            balance={player.balance}
            properties={player.properties}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;