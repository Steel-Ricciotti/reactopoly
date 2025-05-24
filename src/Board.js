// // src/Board.js
// import React, { useState, useEffect } from 'react';
// import Property from './Property';
// import Corner from './Corner';
// import Dice from './Dice';
// import Piece from './Piece';
// import Player from './Player';
// import { properties as initialProperties } from './properties';

// const GO_TO_JAIL_POS = 30;
// const JAIL_POS = 10;
// const COMMUNITY_CHEST_POSITIONS = [2, 17];
// const CHANCE_POSITIONS = [7, 22];

// const Board = () => {
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [flashTrigger, setFlashTrigger] = useState(false);
//   const [properties, setProperties] = useState(
//     initialProperties.map(prop => ({ ...prop, numHouses: 0,
//        houseCost: 50,
//      }))
//   );
//   const [players, setPlayers] = useState([
//     {
//       id: 'Player 1',
//       name: 'Player 1',
//       piece: 'Thimble',
//       balance: 1500.00,
//       properties: [
//         { ...initialProperties[11], owner: 'Player 1', numHouses: 1 },
//         { ...initialProperties[13], owner: 'Player 1', numHouses: 2 },
//         { ...initialProperties[14], owner: 'Player 1', numHouses: 3 },

//       ],
//       side: 'bottom',
//       position: 0,
//     }
//     ,    {
//       id: 'Player 2',
//       name: 'Player 2',
//       piece: 'Car',
//       balance: 1500.0,
//       properties: [],
//       side: 'left',
//       position: 0,
//     inJail: false,
//     jailTurns: 0,
//     getOutOfJailFree: 0,      
//     },
//     {
//       id: 'Player 3',
//       name: 'Player 3',
//       piece: 'Dog',
//       balance: 1500.0,
//       properties: [],
//       side: 'top',
//       position: 0,
//     inJail: false,
//     jailTurns: 0,
//     getOutOfJailFree: 0,      
//     },
//     {
//       id: 'Player 4',
//       name: 'Player 4',
//       piece: 'Hat',
//       balance: 1500.0,
//       properties: [],
//       side: 'right',
//       position: 0,
//     inJail: false,
//     jailTurns: 0,
//     getOutOfJailFree: 0,      
//     },
//   ]);
//   const [currentPlayer, setCurrentPlayer] = useState('Player 1');
//   const [cardModal, setCardModal] = useState({show:false, text:'', type:''});


// const CHANCE_CARDS = [
//   { text: "Advance to GO (Collect $200)", action: "move", target: 0, money: 200 },
//   { text: "Go to Jail", action: "jail" },
//   { text: "Pay poor tax of $15", action: "pay", amount: 15 },
//   { text: "Collect $150", action: "collect", amount: 150 },
//   { text: "Get out of jail free", action: "getoutofjailfree", amount:0 },
// ];

// const COMMUNITY_CARDS = [
//   { text: "Bank error in your favor. Collect $200", action: "collect", amount: 200 },
//   { text: "Doctor's fees. Pay $50", action: "pay", amount: 50 },
//   { text: "Go to jail", action: "jail" },
//   { text: "Collect $100", action: "collect", amount: 100 },
//   { text: "Get out of jail free", action: "getoutofjailfree", amount:0 },
// ];
//   function drawCard(type, playerId) {
//     const cards = type === 'chance' ? CHANCE_CARDS : COMMUNITY_CARDS;
//    const card = cards[Math.floor(Math.random() * cards.length)];   
// setCardModal({ show: true, text: card.text, type: type });
// setTimeout(() => {
//   setCardModal({ show: false, text: '' });
//   if (card.action === "move") {
//     handlePositionUpdate(playerId, card.target);
//   } else if (card.action === "jail") {
//     handlePositionUpdate(playerId, GO_TO_JAIL_POS);
//   } else if (card.action === "pay") {
//     setPlayers(prev =>
//       prev.map(p =>
//         p.id === playerId ? { ...p, balance: p.balance - card.amount } : p
//       )
//     );
//   } else if (card.action === "collect") {
//     setPlayers(prev =>
//       prev.map(p =>
//         p.id === playerId ? { ...p, balance: p.balance + card.amount } : p
//       )
//     );
//   } else if (card.action === "getoutofjailfree") {
//     setPlayers(prev =>
//       prev.map(p =>
//         p.id === playerId ? { ...p, getOutOfJailFree: p.getOutOfJailFree + 1 } : p
//       )
//     );
//   }
// },2000);


//   }
//   const canBuyHouse = (player, group) => {
//     const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
//     //return groupProps.length === properties.filter(p => p.group === group).length;
//     return true;
//   };

//   const getNextHouseProperty = (group) => {
//     const groupProps = properties
//       .filter(p => p.group === group)
//       .sort((a, b) => a.pos - b.pos);
//     const minHouses = Math.min(...groupProps.map(p => p.numHouses));
//     return groupProps.find(p => p.numHouses === minHouses);
//   };

//   const handleBuyHouse = (playerId, group) => {
//   const player = players.find(p => p.id === playerId);
//   if (!canBuyHouse(player, group)) return;

//   const nextProp = getNextHouseProperty(group);
//   if (!nextProp) {
//     console.warn('No nextProp found');
//     return;
//   }

//   const houseCost = nextProp.houseCost || 100;
//   if (nextProp.numHouses < 4 && player.balance >= houseCost) {
//     console.log('Buying house for', nextProp.name);
//     setProperties(prev =>
//       prev.map(prop =>
//         prop.name === nextProp.name
//           ? { ...prop, numHouses: prop.numHouses + 1 }
//           : prop
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

//   const handlePropertyClick = (name) => {
//     setSelectedProperty(name);
//   };

//   const nextTurn = () => {
//     const currentIndex = players.findIndex((p) => p.id === currentPlayer);
//     const nextIndex = (currentIndex + 1) % players.length;
//     setCurrentPlayer(players[nextIndex].id);
//   };

//   const handlePositionUpdate = (playerId, newPosition, rolledDoubles = false) => {
//   const player = players.find(p => p.id === playerId);

//     const prevPosition = player.position;

//   // Check if player passed GO
//   let passedGo = false;
//   if (newPosition < prevPosition) {

//       setPlayers(prev =>
//     prev.map(p =>
//       p.id === playerId
//         ? {
//             ...p,
//             position: newPosition,
//             balance: passedGo ? p.balance + 200 : p.balance
//           }
//         : p
//     )
//   );

//   }

//   // If player is in jail
//   if (player.inJail) {
//     if (rolledDoubles) {
//       // Let them out of jail and move
//       setPlayers(prev =>
//         prev.map(p =>
//           p.id === playerId
//             ? { ...p, inJail: false, jailTurns: 0, position: newPosition }
//             : p
//         )
//       );
//       setFlashTrigger(true);
//     } else if (player.jailTurns < 2) {
//       // Increment jailTurns, don't move
//       setPlayers(prev =>
//         prev.map(p =>
//           p.id === playerId
//             ? { ...p, jailTurns: p.jailTurns + 1 }
//             : p
//         )
//       );
//       // nextTurn();
//       setFlashTrigger(true);
//       // Optionally show a message: "You did not roll doubles."
//     } else {
//       // 3rd failed attempt, let them out and move
//       setPlayers(prev =>
//         prev.map(p =>
//           p.id === playerId
//             ? { ...p, inJail: false, jailTurns: 0, position: newPosition }
//             : p
//         )
//       );
//       setFlashTrigger(true);
//     }
//     return;
//   }
//   if (newPosition === GO_TO_JAIL_POS) {
//     setPlayers(prev =>
//       prev.map(p =>
//         p.id === playerId
//           ? { ...p, position: JAIL_POS, inJail: true, jailTurns: 0 }
//           : p
//       )
//     );    
//         setFlashTrigger(true);
//     return;
//   }
//   if (COMMUNITY_CHEST_POSITIONS.includes(newPosition)) {
//     drawCard('community', playerId);
//     //return;
//   }
//       if (CHANCE_POSITIONS.includes(newPosition)) {
//     drawCard('chance', playerId);
//     //return;
//   }
//     setPlayers((prev) =>
//       prev.map((p) =>
//         p.id === playerId ? { ...p, position: newPosition } : p
//       )
//     );
//     const property = properties[newPosition];
//     handlePayRent(playerId, property);
//     setFlashTrigger(true);
//   };

//   const handlePayRent = (playerId, property) => {
//   if (property.owner && property.owner !== playerId) {
//     const rent = property.rent[property.numHouses] || 50; // Use property.rent or a default value
//     setPlayers(prev =>
//       prev.map(p => {
//         if (p.id === playerId) {
//           return { ...p, balance: p.balance - rent };
//         }
//         if (p.id === property.owner) {
//           return { ...p, balance: p.balance + rent };
//         }
//         return p;
//       })
//     );
//   }
// };

// const handlePayJail = (playerId) => {
//   setPlayers(prev =>
//     prev.map(p =>
//       p.id === playerId && p.inJail && p.balance >= 50
//         ? { ...p, balance: p.balance - 50, inJail: false, jailTurns: 0 }
//         : p
//     )
    
//   );

//   nextTurn();
// };

// const handleUseJailCard = (playerId) => {
//   setPlayers(prev =>
//     prev.map(p =>
//       p.id === playerId && p.inJail && p.getOutOfJailFree > 0
//         ? { ...p, inJail: false, jailTurns: 0, getOutOfJailFree: p.getOutOfJailFree - 1 }
//         : p
//     )
//   );
//   nextTurn();
// };

//   const handleBuy = (playerId) => {
//     const currentProperty = properties[players.find((p) => p.id === playerId).position];
//     const player = players.find((p) => p.id === playerId);
//     if (
//       currentProperty.owner === null &&
//       currentProperty.price !== undefined &&
//       player.balance >= currentProperty.price
//     ) {
//       setProperties((prev) =>
//         prev.map((prop, index) =>
//           index === player.position ? { ...prop, owner: playerId } : prop
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
//       nextTurn();
//     }
//   };

//   const handleOther = () => {
//     setFlashTrigger(true);
//     nextTurn();
//   };

//   const handlePass = () => {
//     setFlashTrigger(true);
//     nextTurn();
//   };

//   const getGroupedProperties = (properties) => {
//     const groups = {};
//     properties.forEach((prop) => {
//       if (prop.group && prop.group !== 'railroad' && prop.group !== 'utility') {
//         if (!groups[prop.group]) {
//           groups[prop.group] = [];
//         }
//         groups[prop.group].push(prop);
//       } else {
//         groups[prop.name] = [prop];
//       }
//     });
//     return Object.entries(groups).map(([group, props], index) => ({ group, props, index }));
//   };

//   const getCardPositionStyle = (side, index) => {
//     switch (side) {
//       case 'bottom':
//         return { left: `${10 + index * 65}px` };
//       case 'left':
//         return { left: '-75px' };
//       case 'top':
//         return { left: `${10 + index * 65}px` };
//       case 'right':
//         return { right: '-75px' };
//       default:
//         return { left: `${10 + index * 65}px` };
//     }
//   };

//   useEffect(() => {
//     if (flashTrigger) {
//       setTimeout(() => setFlashTrigger(false), 1500);
//     }
//   }, [flashTrigger]);

//   const currentPlayerObj = players.find((p) => p.id === currentPlayer);

//   return (
//     <div className="game-container">
//       <div className="board">
//         <div className="center">
//           {cardModal.show && (
//   <div className={`card-modal ${cardModal.type}`}>
//     <div className="card-content">{cardModal.text}</div>
//   </div>
// )}
//           <Dice
//             onRoll={() => {}}
//             onPositionUpdate={handlePositionUpdate}
//             onBuy={() => handleBuy(currentPlayer)}
//             onPass={handlePass}
//             onOther={handleOther}
//             onBuyHouse={handleBuyHouse}
//             currentPlayerObj={currentPlayerObj}
//             currentPlayer={currentPlayer}
//             players={players}
//             properties={properties}
//             triggerFlash={flashTrigger}
//           onPayJail={handlePayJail}
//           onUseJailCard={handleUseJailCard}            
//           />
//         </div>
//         {properties.map((prop) => {
//           if (prop.type === 'corner') {
//             return <Corner key={prop.name} name={prop.name} pos={prop.pos} />;
//           }
//           return (
//             <Property
//               key={prop.name}
//               name={prop.name}
//               color={prop.color}
//               pos={prop.pos}
//               numHouses={prop.numHouses}
//               isSelected={selectedProperty === prop.name}
//               onClick={() => handlePropertyClick(prop.name)}
//             />
//           );
//         })}
//         {players.map((player) => (
//           <Piece
//             key={player.id}
//             position={player.position}
//             pieceType={player.piece}
//             playerId={player.id}
//           />
//         ))}
//         {players.map((player) => {
//           const groupedProperties = getGroupedProperties(player.properties);
//           return groupedProperties.map(({ group, props }, groupIndex) => {
//             return props.map((prop, propertyIndex) => (
//               <div
//                 key={`${player.id}-${group}-${prop.name}`}
//                 className={`property-card ${player.side}`}
//                 style={{
//                   ...getCardPositionStyle(player.side, groupIndex),
//                   top: player.side === 'left' || player.side === 'right'
//                     ? `${10 + groupIndex * 85 + propertyIndex * 20}px`
//                     : player.side === 'top'
//                     ? `${-85 - propertyIndex * 20}px`
//                     : undefined,
//                   bottom: player.side === 'bottom'
//                     ? `${-85 - propertyIndex * 20}px`
//                     : undefined,
//                 }}
//                 data-testid="property-card"
//               >
//                 <div className={`color-bar ${prop.color}`}></div>
//                 <span>{prop.name}</span>
//                 {propertyIndex === 0 && props.length > 1 && (
//                   <div className="stack-count">{props.length}</div>
//                 )}
//                 {prop.houses > 0 && (
//                   <div className="house-count">{prop.houses}</div>
//                 )}                
//               </div>
//             ));
//           });
//         })}
//       </div>
//       <div className="sidebar">
//         {players.map((player) => (
//           <Player
//             key={player.id}
//             name={player.name}
//             piece={player.piece}
//             balance={player.balance}
//             properties={player.properties}
//             isCurrent={player.id === currentPlayer}
//           />
//         ))}
//       </div>
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

const GO_TO_JAIL_POS = 30;
const JAIL_POS = 10;
const COMMUNITY_CHEST_POSITIONS = [2, 17];
const CHANCE_POSITIONS = [7, 22];

const Board = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [properties, setProperties] = useState(
    initialProperties.map(prop => ({
      ...prop,
      numHouses: 0,
      houseCost: prop.group === 'purple' ? 50 : 100,
    }))
  );
  const [players, setPlayers] = useState([
    {
      id: 'Player 1',
      name: 'Player 1',
      piece: 'Thimble',
      balance: 1500.0,
      properties: [
        { ...initialProperties[11], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[13], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[14], owner: 'Player 1', numHouses: 0 },
      ],
      side: 'bottom',
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailFree: 0,
    },
    {
      id: 'Player 2',
      name: 'Player 2',
      piece: 'Car',
      balance: 1500.0,
      properties: [
        { ...initialProperties[11], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[13], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[14], owner: 'Player 1', numHouses: 0 },
      ],
      side: 'left',
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailFree: 0,
    },
    {
      id: 'Player 3',
      name: 'Player 3',
      piece: 'Dog',
      balance: 1500.0,
      properties: [
        { ...initialProperties[11], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[13], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[14], owner: 'Player 1', numHouses: 0 },
      ],
      side: 'top',
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailFree: 0,
    },
    {
      id: 'Player 4',
      name: 'Player 4',
      piece: 'Hat',
      balance: 1500.0,
      properties: [
        { ...initialProperties[11], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[13], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[14], owner: 'Player 1', numHouses: 0 },
      ],
      side: 'right',
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailFree: 0,
    },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState('Player 1');
  const [cardModal, setCardModal] = useState({ show: false, text: '', type: '' });

  const CHANCE_CARDS = [
    { text: 'Advance to GO (Collect $200)', action: 'move', target: 0, money: 200 },
    { text: 'Go to Jail', action: 'jail' },
    { text: 'Pay poor tax of $15', action: 'pay', amount: 15 },
    { text: 'Collect $150', action: 'collect', amount: 150 },
    { text: 'Get out of jail free', action: 'getoutofjailfree', amount: 0 },
  ];

  const COMMUNITY_CARDS = [
    { text: 'Bank error in your favor. Collect $200', action: 'collect', amount: 200 },
    { text: "Doctor's fees. Pay $50", action: 'pay', amount: 50 },
    { text: 'Go to jail', action: 'jail' },
    { text: 'Collect $100', action: 'collect', amount: 100 },
    { text: 'Get out of jail free', action: 'getoutofjailfree', amount: 0 },
  ];

  function drawCard(type, playerId) {
    const cards = type === 'chance' ? CHANCE_CARDS : COMMUNITY_CARDS;
    const card = cards[Math.floor(Math.random() * cards.length)];
    setCardModal({ show: true, text: card.text, type: type });
    setTimeout(() => {
      setCardModal({ show: false, text: '', type: '' });
      if (card.action === 'move') {
        handlePositionUpdate(playerId, card.target);
      } else if (card.action === 'jail') {
        handlePositionUpdate(playerId, GO_TO_JAIL_POS);
      } else if (card.action === 'pay') {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId ? { ...p, balance: p.balance - card.amount } : p
          )
        );
      } else if (card.action === 'collect') {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId ? { ...p, balance: p.balance + card.amount } : p
          )
        );
      } else if (card.action === 'getoutofjailfree') {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId ? { ...p, getOutOfJailFree: p.getOutOfJailFree + 1 } : p
          )
        );
      }
    }, 2000);
  }

  const canBuyHouse = (player, group) => {
    const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
    return groupProps.length === properties.filter(p => p.group === group).length;
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
    if (!nextProp) return;

    const houseCost = nextProp.houseCost || 100;
    if (nextProp.numHouses < 4 && player.balance >= houseCost) {
      setProperties(prev =>
        prev.map(prop =>
          prop.name === nextProp.name
            ? { ...prop, numHouses: prop.numHouses + 1 }
            : prop
        )
      );
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId
            ? {
                ...p,
                balance: p.balance - houseCost,
                properties: p.properties.map(prop =>
                  prop.name === nextProp.name
                    ? { ...prop, numHouses: prop.numHouses + 1 }
                    : prop
                ),
              }
            : p
        )
      );
      setFlashTrigger(true);
    }
  };

  const handlePropertyClick = (name) => {
    setSelectedProperty(name);
  };

  const nextTurn = () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayer);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayer(players[nextIndex].id);
  };

  const handlePositionUpdate = (playerId, newPosition, rolledDoubles = false) => {
    const player = players.find(p => p.id === playerId);
    const prevPosition = player.position;
    let passedGo = newPosition < prevPosition;

    if (player.inJail) {
      if (rolledDoubles) {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId
              ? { ...p, inJail: false, jailTurns: 0, position: newPosition }
              : p
          )
        );
        setFlashTrigger(true);
      } else if (player.jailTurns < 2) {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId
              ? { ...p, jailTurns: p.jailTurns + 1 }
              : p
          )
        );
        setFlashTrigger(true);
        return;
      } else {
        setPlayers(prev =>
          prev.map(p =>
            p.id === playerId
              ? { ...p, inJail: false, jailTurns: 0, position: newPosition }
              : p
          )
        );
        setFlashTrigger(true);
      }
    } else if (newPosition === GO_TO_JAIL_POS) {
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId
            ? { ...p, position: JAIL_POS, inJail: true, jailTurns: 0 }
            : p
        )
      );
      setFlashTrigger(true);
      return;
    } else {
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId
            ? {
                ...p,
                position: newPosition,
                balance: passedGo ? p.balance + 200 : p.balance,
              }
            : p
        )
      );
      if (COMMUNITY_CHEST_POSITIONS.includes(newPosition)) {
        drawCard('community', playerId);
      }
      if (CHANCE_POSITIONS.includes(newPosition)) {
        drawCard('chance', playerId);
      }
      const property = properties[newPosition];
      handlePayRent(playerId, property);
      setFlashTrigger(true);
    }
  };

  const handlePayRent = (playerId, property) => {
    if (property.owner && property.owner !== playerId) {
      const rent = property.rent?.[property.numHouses] || 50;
      setPlayers(prev =>
        prev.map(p => {
          if (p.id === playerId) {
            return { ...p, balance: p.balance - rent };
          }
          if (p.id === property.owner) {
            return { ...p, balance: p.balance + rent };
          }
          return p;
        })
      );
    }
  };

  const handlePayJail = (playerId) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId && p.inJail && p.balance >= 50
          ? { ...p, balance: p.balance - 50, inJail: false, jailTurns: 0 }
          : p
      )
    );
    nextTurn();
  };

  const handleUseJailCard = (playerId) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId && p.inJail && p.getOutOfJailFree > 0
          ? { ...p, inJail: false, jailTurns: 0, getOutOfJailFree: p.getOutOfJailFree - 1 }
          : p
      )
    );
    nextTurn();
  };

  const handleBuy = (playerId) => {
    const currentProperty = properties[players.find(p => p.id === playerId).position];
    const player = players.find(p => p.id === playerId);
    if (
      currentProperty.owner === null &&
      currentProperty.price !== undefined &&
      player.balance >= currentProperty.price
    ) {
      setProperties(prev =>
        prev.map((prop, index) =>
          index === player.position ? { ...prop, owner: playerId } : prop
        )
      );
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId
            ? {
                ...p,
                balance: p.balance - currentProperty.price,
                properties: [
                  ...p.properties,
                  { ...currentProperty, owner: playerId, numHouses: 0 },
                ],
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
    properties.forEach(prop => {
      if (prop.group && prop.group !== 'railroad' && prop.group !== 'utility') {
        if (!groups[prop.group]) {
          groups[prop.group] = [];
        }
        groups[prop.group].push(prop);
      } else {
        groups[prop.name] = [prop];
      }
    });
    return Object.entries(groups).map(([group, props], index) => ({
      group,
      props,
      index,
    }));
  };

  const getCardPositionStyle = (side, index, propertyIndex) => {
    const baseStyle = { zIndex: propertyIndex };
    switch (side) {
      case 'bottom':
        return {
          ...baseStyle,
          left: `${10 + index * 50}px`,
          bottom: `${-110 - propertyIndex * 20}px`,
        };
      case 'left':
        return {
          ...baseStyle,
          left: '-90px',
          top: `${10 + index * 50 + propertyIndex * 20}px`,
        };
      case 'top':
        return {
          ...baseStyle,
          left: `${10 + index * 50}px`,
          top: `${-110 - propertyIndex * 20}px`,
        };
      case 'right':
        return {
          ...baseStyle,
          right: '-90px',
          top: `${10 + index * 50 + propertyIndex * 20}px`,
        };
      default:
        return {
          ...baseStyle,
          left: `${10 + index * 50}px`,
          bottom: `${-85 - propertyIndex * 20}px`,
        };
    }
  };

  useEffect(() => {
    if (flashTrigger) {
      setTimeout(() => setFlashTrigger(false), 1500);
    }
  }, [flashTrigger]);

  const currentPlayerObj = players.find(p => p.id === currentPlayer);

  return (
    <div className="game-container">
      <div className="board">
        <div className="center">
          {cardModal.show && (
            <div className={`card-modal ${cardModal.type}`}>
              <div className="card-content">{cardModal.text}</div>
            </div>
          )}
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
            onPayJail={handlePayJail}
            onUseJailCard={handleUseJailCard}
          />
        </div>
        {properties.map(prop => {
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
        {players.map(player => (
          <Piece
            key={player.id}
            position={player.position}
            pieceType={player.piece}
            playerId={player.id}
          />
        ))}
        {players.map(player => {
          const groupedProperties = getGroupedProperties(player.properties);
          return groupedProperties.map(({ group, props }, groupIndex) =>
            props.map((prop, propertyIndex) => (
              <div
                key={`${player.id}-${group}-${prop.name}`}
                className="card"
                style={getCardPositionStyle(player.side, groupIndex, propertyIndex)}
                data-testid="card"
              >
                <div className={`color-bar ${prop.color}`}></div>
                <span>{prop.name}</span>
                {propertyIndex === 0 && props.length > 1 && (
                  <div className="stack-count">{props.length}</div>
                )}
                {prop.numHouses > 0 && (
                  <div className="house-count">{prop.numHouses}</div>
                )}
              </div>
            ))
          );
        })}
      </div>
      <div className="sidebar">
        {players.map(player => (
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
