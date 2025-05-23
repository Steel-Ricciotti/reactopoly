// // // // src/Dice.js
// // // import React, { useState, useEffect } from 'react';

// // // const Dice = ({
// // //   onRoll,
// // //   onPositionUpdate,
// // //   onBuy,
// // //   onPass,
// // //   onOther,
// // //   currentPlayerObj,
// // //   currentPlayer,
// // //   players,
// // //   properties,
// // //   triggerFlash,
// // // }) => {
// // //   const [diceValues, setDiceValues] = useState([1, 1]);
// // //   const [isRolling, setIsRolling] = useState(false);
// // //   const [flashState, setFlashState] = useState('idle');
// // //   const [flashMessage, setFlashMessage] = useState('');
// // //   const [showButtons, setShowButtons] = useState(false);
// // //   const [waitingForAction, setWaitingForAction] = useState(false);

// // //   const rollDice = () => {
// // //     setIsRolling(true);
// // //     setTimeout(() => {
// // //       const newValues = [
// // //         Math.floor(Math.random() * 6) + 1,
// // //         Math.floor(Math.random() * 6) + 1,
// // //       ];
// // //       setDiceValues(newValues);
// // //       setIsRolling(false);
// // //       onRoll(newValues);
// // //       // Update position
// // //       const total = newValues[0] + newValues[1];
// // //       const newPosition = (currentPlayerObj.position + total) % 40;
// // //       onPositionUpdate(currentPlayerObj.id, newPosition);
// // //       // Set first flash
// // //       const currentSquare = properties[newPosition];
// // //       setFlashState('current');
// // //       setFlashMessage(
// // //         `${currentPlayerObj.name}: ${currentSquare.name}${
// // //           currentSquare.price !== undefined && currentSquare.type === 'property' ? ` ($${currentSquare.price})` : ''
// // //         }`
// // //       );
// // //       const needsAction = currentSquare.owner === null && currentSquare.price !== undefined && currentSquare.type === 'property';
// // //       setShowButtons(needsAction);
// // //       setWaitingForAction(needsAction);
// // //     }, 1000);
// // //   };

// // //   useEffect(() => {
// // //     let timer;
// // //     if (flashState === 'current' && !waitingForAction) {
// // //       timer = setTimeout(() => {
// // //         const currentSquare = properties[currentPlayerObj.position];
// // //         if (currentSquare.type !== 'property' || currentSquare.owner !== null) {
// // //           onOther();
// // //         }
// // //         setFlashState('pause');
// // //         setFlashMessage('');
// // //         setShowButtons(false);
// // //       }, 1500);
// // //     } else if (flashState === 'pause') {
// // //       timer = setTimeout(() => {
// // //         setFlashState('next');
// // //         const currentIndex = players.findIndex((p) => p.id === currentPlayer);
// // //         const nextPlayer = players[(currentIndex ) % players.length];
// // //         setFlashMessage(`${nextPlayer.name}'s Turn`);
// // //       }, 1000);
// // //     }
// // //     return () => clearTimeout(timer);
// // //   }, [flashState, waitingForAction, currentPlayer, players, currentPlayerObj, properties, onOther]);

// // //   const handleBuy = () => {
// // //     onBuy();
// // //     setWaitingForAction(false);
// // //     setFlashState('pause');
// // //     setFlashMessage('');
// // //     setShowButtons(false);
// // //   };

// // //   const handlePass = () => {
// // //     onPass();
// // //     setWaitingForAction(false);
// // //     setFlashState('pause');
// // //     setFlashMessage('');
// // //     setShowButtons(false);
// // //   };

// // //   return (
// // //     <div className="dice-container">
// // //       <div className="dice-row">
// // //         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
// // //         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
// // //       </div>
// // //       <button className="roll-button" onClick={rollDice} disabled={isRolling || waitingForAction}>
// // //         {isRolling ? 'Rolling...' : 'Roll Dice'}
// // //       </button>
// // //       <div className="square-flash-container">
// // //         {flashMessage && (
// // //           <div className={`square-flash ${triggerFlash && flashState !== 'pause' ? 'flashing' : ''}`}>
// // //             {flashMessage}
// // //           </div>
// // //         )}
// // //         {showButtons && flashState === 'current' && (
// // //           <div className="button-container">
// // //             <button className="buy-button" onClick={handleBuy} disabled={isRolling}>
// // //               Buy
// // //             </button>
// // //             <button className="pass-button" onClick={handlePass} disabled={isRolling}>
// // //               Pass
// // //             </button>
// // //           </div>
// // //         )}
// // //         {!showButtons && flashState === 'current' && properties[currentPlayerObj.position].owner !== null && properties[currentPlayerObj.position].price !== undefined && (
// // //           <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>
// // //             Pay Rent
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dice;

// // // src/Dice.js
// // import React, { useState, useEffect } from 'react';

// // const Dice = ({
// //   onRoll,
// //   onPositionUpdate,
// //   onBuy,
// //   onPass,
// //   onOther,
// //   onBuyHouse,
// //   currentPlayerObj,
// //   currentPlayer,
// //   players,
// //   properties,
// //   triggerFlash,
// // }) => {
// //   const [diceValues, setDiceValues] = useState([1, 1]);
// //   const [isRolling, setIsRolling] = useState(false);
// //   const [flashState, setFlashState] = useState('idle');
// //   const [flashMessage, setFlashMessage] = useState('');
// //   const [showButtons, setShowButtons] = useState(false);
// //   const [waitingForAction, setWaitingForAction] = useState(false);

// //   const canBuyHouse = (player, group) => {
// //     const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
// //     //return groupProps.length === properties.filter(p => p.group === group).length;
// //     return true; // For testing purposes, always return true
// //   };

// //   const rollDice = () => {
// //     setIsRolling(true);
// //     setTimeout(() => {
// //       const newValues = [
// //         Math.floor(Math.random() * 6) + 1,
// //         Math.floor(Math.random() * 6) + 1,
// //       ];
// //       setDiceValues(newValues);
// //       setIsRolling(false);
// //       onRoll(newValues);
// //       const total = newValues[0] + newValues[1];
// //       const newPosition = (currentPlayerObj.position + total) % 40;
// //       onPositionUpdate(currentPlayerObj.id, newPosition);
// //       const currentSquare = properties[newPosition];
// //       setFlashState('current');
// //       setFlashMessage(
// //         `${currentPlayerObj.name}: ${currentSquare.name}${
// //           currentSquare.price !== undefined && currentSquare.type === 'property' ? ` ($${currentSquare.price})` : ''
// //         }`
// //       );
// //       const needsAction = currentSquare.owner === null && currentSquare.price !== undefined && currentSquare.type === 'property';
// //       //const canBuyHouseAction = currentSquare.owner === currentPlayerObj.id && canBuyHouse(currentPlayerObj, currentSquare.group);
// //       const canBuyHouseAction =  canBuyHouse(currentPlayerObj, currentSquare.group);
// //       setShowButtons(needsAction || canBuyHouseAction);
// //       setWaitingForAction(needsAction || canBuyHouseAction);
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     let timer;
// //     if (flashState === 'current' && !waitingForAction) {
// //       timer = setTimeout(() => {
// //         const currentSquare = properties[currentPlayerObj.position];
// //         if (currentSquare.type !== 'property' || currentSquare.owner !== null) {
// //           onOther();
// //         }
// //         setFlashState('pause');
// //         setFlashMessage('');
// //         setShowButtons(false);
// //       }, 1500);
// //     } else if (flashState === 'pause') {
// //       timer = setTimeout(() => {
// //         setFlashState('next');
// //         const currentIndex = players.findIndex((p) => p.id === currentPlayer);
// //         const nextPlayer = players[(currentIndex) % players.length];
// //         setFlashMessage(`${nextPlayer.name}'s Turn`);
// //       }, 1000);
// //     }
// //     return () => clearTimeout(timer);
// //   }, [flashState, waitingForAction, currentPlayer, players, currentPlayerObj, properties, onOther]);

// //   const handleBuy = () => {
// //     onBuy();
// //     setWaitingForAction(false);
// //     setFlashState('pause');
// //     setFlashMessage('');
// //     setShowButtons(false);
// //   };

// //   const handlePass = () => {
// //     onPass();
// //     setWaitingForAction(false);
// //     setFlashState('pause');
// //     setFlashMessage('');
// //     setShowButtons(false);
// //   };

// //   const handleBuyHouse = () => {
// //     onBuyHouse(currentPlayerObj.id, currentPlayerObj.position);
// //     setWaitingForAction(false);
// //     setFlashState('pause');
// //     setFlashMessage('');
// //     setShowButtons(false);
// //   };

// //   return (
// //     <div className="dice-container">
// //       <div className="dice-row">
// //         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
// //         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
// //       </div>
// //       <button className="roll-button" onClick={rollDice} disabled={isRolling || waitingForAction}>
// //         {isRolling ? 'Rolling...' : 'Roll Dice'}
// //       </button>
// //       <div className="square-flash-container">
// //         {flashMessage && (
// //           <div className={`square-flash ${triggerFlash && flashState !== 'pause' ? 'flashing' : ''}`}>
// //             {flashMessage}
// //           </div>
// //         )}
// //         {showButtons && flashState === 'current' && (
// //           <div className="button-container">
// //             {properties[currentPlayerObj.position].owner === null && properties[currentPlayerObj.position].price !== undefined && (
// //               <>
// //                 <button className="buy-button" onClick={handleBuy} disabled={isRolling}>
// //                   Buy
// //                 </button>
// //                 <button className="pass-button" onClick={handlePass} disabled={isRolling}>
// //                   Pass
// //                 </button>
// //               </>
// //             )}
// //             {/* {properties[currentPlayerObj.position].owner === currentPlayerObj.id && canBuyHouse(currentPlayerObj, properties[currentPlayerObj.position].group) && ( */}
// //               { canBuyHouse(currentPlayerObj, properties[currentPlayerObj.position].group) && (
// //               <button className="buy-house-button" onClick={handleBuyHouse} disabled={isRolling}>
// //                 Buy House
// //               </button>
// //             )}
// //           </div>
// //         )}
// //         {!showButtons && flashState === 'current' && properties[currentPlayerObj.position].owner !== null && properties[currentPlayerObj.position].price !== undefined && (
// //           <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>
// //             Pay Rent
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dice;

// // src/Dice.js
// import React, { useState, useEffect } from 'react';

// const Dice = ({
//   onRoll,
//   onPositionUpdate,
//   onBuy,
//   onPass,
//   onOther,
//   onBuyHouse,
//   currentPlayerObj,
//   currentPlayer,
//   players,
//   properties,
//   triggerFlash,
// }) => {
//   const [diceValues, setDiceValues] = useState([1, 1]);
//   const [isRolling, setIsRolling] = useState(false);
//   const [flashState, setFlashState] = useState('idle');
//   const [flashMessage, setFlashMessage] = useState('');
//   const [showButtons, setShowButtons] = useState(false);
//   const [waitingForAction, setWaitingForAction] = useState(false);

//   const canBuyHouse = (player, group) => {
//     const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
//     //return groupProps.length === properties.filter(p => p.group === group).length;
//     return true;
//   };


//   const rollDice = () => {
//     setIsRolling(true);
//     setTimeout(() => {
//       const newValues = [
//         Math.floor(Math.random() * 6) + 1,
//         Math.floor(Math.random() * 6) + 1,
//       ];
//       setDiceValues(newValues);
//       setIsRolling(false);
//       onRoll(newValues);
//       const total = newValues[0] + newValues[1];
//       const newPosition = (currentPlayerObj.position + total) % 40;
//       onPositionUpdate(currentPlayerObj.id, newPosition);
//       const currentSquare = properties[newPosition];
//       setFlashState('current');
//       setFlashMessage(
//         `${currentPlayerObj.name}: ${currentSquare.name}${
//           currentSquare.price !== undefined && currentSquare.type === 'property' ? ` ($${currentSquare.price})` : ''
//         }`
//       );
//       const needsAction = currentSquare.owner === null && currentSquare.price !== undefined && currentSquare.type === 'property';
//       setShowButtons(needsAction);
//       setWaitingForAction(needsAction);
//     }, 1000);
//   };

//   useEffect(() => {
//     let timer;
//     if (flashState === 'current' && !waitingForAction) {
//       timer = setTimeout(() => {
//         const currentSquare = properties[currentPlayerObj.position];
//         if (currentSquare.type !== 'property' || currentSquare.owner !== null) {
//           onOther();
//         }
//         setFlashState('pause');
//         setFlashMessage('');
//         setShowButtons(false);
//       }, 1500);
//     } else if (flashState === 'pause') {
//       timer = setTimeout(() => {
//         setFlashState('next');
//         const currentIndex = players.findIndex((p) => p.id === currentPlayer);
//         const nextPlayer = players[(currentIndex) % players.length];
//         setFlashMessage(`${nextPlayer.name}'s Turn`);
//       }, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [flashState, waitingForAction, currentPlayer, players, currentPlayerObj, properties, onOther]);

//   const handleBuy = () => {
//     onBuy();
//     setWaitingForAction(false);
//     setFlashState('pause');
//     setFlashMessage('');
//     setShowButtons(false);
//   };

//   const handlePass = () => {
//     onPass();
//     setWaitingForAction(false);
//     setFlashState('pause');
//     setFlashMessage('');
//     setShowButtons(false);
//   };

//   const handleBuyHouse = (group) => {
//     onBuyHouse(currentPlayerObj.id, group);
//     setWaitingForAction(false);
//     setFlashState('pause');
//     setFlashMessage('');
//   };

//   // Get groups eligible for house buying
//   const eligibleHouseGroups = [...new Set(
//     properties
//       .filter(prop => prop.owner === currentPlayerObj.id && prop.group && prop.houses < 4 && canBuyHouse(currentPlayerObj, prop.group))
//       .map(prop => prop.group)
//   )];

//   return (
//     <div className="dice-container">
//       <div className="dice-row">
//         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
//         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
//       </div>
//       <button className="roll-button" onClick={rollDice} disabled={isRolling || waitingForAction}>
//         {isRolling ? 'Rolling...' : 'Roll Dice'}
//       </button>
//       <div className="square-flash-container">
//         {flashMessage && (
//           <div className={`square-flash ${triggerFlash && flashState !== 'pause' ? 'flashing' : ''}`}>
//             {flashMessage}
//           </div>
//         )}
//         {showButtons && flashState === 'current' && (
//           <div className="button-container">
//             {properties[currentPlayerObj.position].owner === null && properties[currentPlayerObj.position].price !== undefined && (
//               <>
//                 <button className="buy-button" onClick={handleBuy} disabled={isRolling}>
//                   Buy
//                 </button>
//                 <button className="pass-button" onClick={handlePass} disabled={isRolling}>
//                   Pass
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//         {eligibleHouseGroups.length > 0 && (
//           <div className="house-buy-container">
//             <h4>Buy Houses:</h4>
//             {eligibleHouseGroups.map(group => (
//               <button
//                 key={group}
//                 className="buy-house-button"
//                 onClick={() => handleBuyHouse(group)}
//                 disabled={isRolling || currentPlayerObj.balance < (group === 'purple' ? 50 : 100)}
//               >
//                 Buy House: {group} group
//               </button>
//             ))}
//           </div>
//         )}
//         {!showButtons && flashState === 'current' && properties[currentPlayerObj.position].owner !== null && properties[currentPlayerObj.position].price !== undefined && (
//           <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>
//             Pay Rent
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dice;


// src/Dice.js
import React, { useState, useEffect } from 'react';

const Dice = ({
  onRoll,
  onPositionUpdate,
  onBuy,
  onPass,
  onOther,
  currentPlayerObj,
  currentPlayer,
  players,
  properties,
  triggerFlash,
}) => {
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [flashState, setFlashState] = useState('idle');
  const [flashMessage, setFlashMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newValues = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(newValues);
      setIsRolling(false);
      onRoll(newValues);
      const total = newValues[0] + newValues[1];
      const newPosition = (currentPlayerObj.position + total) % 40;
      onPositionUpdate(currentPlayerObj.id, newPosition);
      const currentSquare = properties[newPosition];
      setFlashState('current');
      setFlashMessage(
        `${currentPlayerObj.name}: ${currentSquare.name}${
          currentSquare.price !== undefined && currentSquare.type === 'property' ? ` ($${currentSquare.price})` : ''
        }`
      );
      const needsAction = currentSquare.owner === null && currentSquare.price !== undefined && currentSquare.type === 'property';
      setShowButtons(needsAction);
      setWaitingForAction(needsAction);
    }, 1000);
  };

  useEffect(() => {
    let timer;
    if (flashState === 'current' && !waitingForAction) {
      timer = setTimeout(() => {
        const currentSquare = properties[currentPlayerObj.position];
        if (currentSquare.type !== 'property' || currentSquare.owner !== null) {
          onOther();
        }
        setFlashState('pause');
        setFlashMessage('');
        setShowButtons(false);
      }, 1500);
    } else if (flashState === 'pause') {
      timer = setTimeout(() => {
        setFlashState('next');
        const currentIndex = players.findIndex((p) => p.id === currentPlayer);
        const nextPlayer = players[(currentIndex) % players.length];
        setFlashMessage(`${nextPlayer.name}'s Turn`);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [flashState, waitingForAction, currentPlayer, players, currentPlayerObj, properties, onOther]);

  const handleBuy = () => {
    onBuy();
    setWaitingForAction(false);
    setFlashState('pause');
    setFlashMessage('');
    setShowButtons(false);
  };

  const handlePass = () => {
    onPass();
    setWaitingForAction(false);
    setFlashState('pause');
    setFlashMessage('');
    setShowButtons(false);
  };

  return (
    <div className="dice-container">
      <div className="dice-row">
        <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
        <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
      </div>
      <button className="roll-button" onClick={rollDice} disabled={isRolling || waitingForAction}>
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
      <div className="square-flash-container">
        {flashMessage && (
          <div className={`square-flash ${triggerFlash && flashState !== 'pause' ? 'flashing' : ''}`}>
            {flashMessage}
          </div>
        )}
        {showButtons && flashState === 'current' && (
          <div className="button-container">
            {properties[currentPlayerObj.position].owner === null && properties[currentPlayerObj.position].price !== undefined && (
              <>
                <button className="buy-button" onClick={handleBuy} disabled={isRolling}>
                  Buy
                </button>
                <button className="pass-button" onClick={handlePass} disabled={isRolling}>
                  Pass
                </button>
              </>
            )}
          </div>
        )}
        {!showButtons && flashState === 'current' && properties[currentPlayerObj.position].owner !== null && properties[currentPlayerObj.position].price !== undefined && (
          <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>
            Pay Rent
          </div>
        )}
      </div>
    </div>
  );
};

export default Dice;
