
// src/Dice.js
import React, { useState, useEffect } from 'react';

const Dice = ({
  onRoll,
  onPositionUpdate,
  onBuy,
  onPass,
  onBuyHouse,
  onOther,
  currentPlayerObj,
  currentPlayer,
  players,
  properties,
  triggerFlash,
  onPayJail,
  onUseJailCard,
}) => {
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [flashState, setFlashState] = useState('idle');
  const [flashMessage, setFlashMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);


    const canBuyHouse = (player, group) => {
    const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
    return groupProps.length === properties.filter(p => p.group === group).length;
    //return true;
  };

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newValues = [
1,1
        // Math.floor(Math.random() * 6) + 1,
        // Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(newValues);
      setIsRolling(false);
      onRoll(newValues);
      const total = newValues[0] + newValues[1];
      const newPosition = (currentPlayerObj.position + total) % 40;
      onPositionUpdate(currentPlayerObj.id, newPosition);
      const currentSquare = properties[newPosition];
      //Dont move if player is in jail
      if(!currentPlayerObj.inJail) {
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
      }
      else{
        const currentSquare = properties[currentPlayerObj.position];
        setFlashState('current');
      }


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
  const handleBuyHouse = (group) => {
    onBuyHouse(currentPlayerObj.id, group);
    setWaitingForAction(false);
    setFlashState('pause');
    setFlashMessage('');
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
             {/* {properties[currentPlayerObj.position].owner === currentPlayerObj.id && canBuyHouse(currentPlayerObj, properties[currentPlayerObj.position].group) && ( */}
               { canBuyHouse(currentPlayerObj, properties[currentPlayerObj.position].group) && (
               //<button className="buy-house-button" onClick={handleBuyHouse(properties[currentPlayerObj.position].group)} disabled={isRolling}>
                <button className="buy-house-button" onClick={() => handleBuyHouse(properties[currentPlayerObj.position].group)}>
                 Buy House
               </button>
             )}            
          </div>
        )}
        {/* /Logic if player is in jail */}
          {currentPlayerObj.inJail && (
            <div className="jail-actions">
              <button onClick={() => onPayJail(currentPlayerObj.id)} disabled={isRolling}>
                Pay $50 to get out of Jail
              </button>
              {currentPlayerObj.getOutOfJailFree > 0 && (
                <button onClick={() => onUseJailCard(currentPlayerObj.id)} disabled={isRolling}>
                  Play Get Out of Jail Free
                </button>
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


// src/Dice.js
// import React, { useState, useEffect } from 'react';

// const Dice = ({
//   onRoll,
//   onPositionUpdate,
//   onBuy,
//   onPass,
//   onBuyHouse,
//   onOther,
//   currentPlayerObj,
//   currentPlayer,
//   players,
//   properties,
//   triggerFlash,
//   onPayJail,
//   onUseJailCard,
// }) => {
//   const [diceValues, setDiceValues] = useState([1, 1]);
//   const [isRolling, setIsRolling] = useState(false);
//   const [flashState, setFlashState] = useState('idle');
//   const [flashMessage, setFlashMessage] = useState('');
//   const [showButtons, setShowButtons] = useState(false);
//   const [waitingForAction, setWaitingForAction] = useState(false);

//   const rollDice = () => {
//     setIsRolling(true);
//     setTimeout(() => {
//       const newValues = [
//         Math.floor(Math.random() * 6) + 1,
//         Math.floor(Math.random() * 6) + 1,
//       ];
//       const doubles = newValues[0] === newValues[1];
//       setDiceValues(newValues);
//       setIsRolling(false);
//       onRoll(newValues);
//       const total = newValues[0] + newValues[1];
//       const newPosition = (currentPlayerObj.position + total) % 40;
//       onPositionUpdate(currentPlayerObj.id, newPosition, doubles);
//       if (!currentPlayerObj.inJail) {
//         const currentSquare = properties[newPosition];
//         setFlashState('current');
//         setFlashMessage(
//           `${currentPlayerObj.name}: ${currentSquare.name}${
//             currentSquare.price !== undefined && currentSquare.type === 'property'
//               ? ` ($${currentSquare.price})`
//               : ''
//           }`
//         );
//         const needsAction =
//           currentSquare.owner === null &&
//           currentSquare.price !== undefined &&
//           currentSquare.type === 'property';
//         setShowButtons(needsAction);
//         setWaitingForAction(needsAction);
//       } else {
//         setFlashState('current');
//         setFlashMessage(`${currentPlayerObj.name}: In Jail`);
//       }
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
//         const currentIndex = players.findIndex(p => p.id === currentPlayer);
//         const nextPlayer = players[(currentIndex + 1) % players.length];
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

//   return (
//     <div className="dice-container">
//       <div className="dice-row">
//         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
//         <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
//       </div>
//       <button
//         className="roll-button"
//         onClick={rollDice}
//         disabled={isRolling || waitingForAction}
//       >
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
//             {properties[currentPlayerObj.position].owner === null &&
//               properties[currentPlayerObj.position].price !== undefined && (
//                 <>
//                   <button className="buy-button" onClick={handleBuy} disabled={isRolling}>
//                     Buy
//                   </button>
//                   <button className="pass-button" onClick={handlePass} disabled={isRolling}>
//                     Pass
//                   </button>
//                 </>
//               )}
//           </div>
//         )}
//         {currentPlayerObj.inJail && (
//           <div className="jail-actions">
//             <button
//               onClick={() => onPayJail(currentPlayerObj.id)}
//               disabled={isRolling || currentPlayerObj.balance < 50}
//             >
//               Pay $50 to get out of Jail
//             </button>
//             {currentPlayerObj.getOutOfJailFree > 0 && (
//               <button
//                 onClick={() => onUseJailCard(currentPlayerObj.id)}
//                 disabled={isRolling}
//               >
//                 Play Get Out of Jail Free
//               </button>
//             )}
//           </div>
//         )}
//         {!showButtons &&
//           flashState === 'current' &&
//           properties[currentPlayerObj.position].owner !== null &&
//           properties[currentPlayerObj.position].price !== undefined && (
//             <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>
//               Pay Rent
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default Dice;
