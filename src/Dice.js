// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// const socket = io('http://localhost:8000', { transports: ['websocket'] });

// const App = () => {
//   const [playerId, setPlayerId] = useState(null);
//   const [gameId, setGameId] = useState(null);
//   const [scores, setScores] = useState({ player1: 0, player2: 0 });
//   const [showGamePrompt, setShowGamePrompt] = useState(true);

//   useEffect(() => {
//     const handleGameState = (data) => {
//       console.log('Received game_state:', data);
//       setScores({ player1: data.player1Score, player2: data.player2Score });
//     };

//     socket.on('game_state', handleGameState);
//     socket.on('error', (error) => {
//       console.error('Socket error:', error.message);
//       alert(error.message);
//     });

//     return () => {
//       socket.off('game_state', handleGameState);
//       socket.off('error');
//     };
//   }, []); // Empty deps to run once

//   const joinGame = () => {
//     const inputGameId = prompt('Enter Game ID:');
//     if (!inputGameId) {
//       alert('Game ID is required');
//       return;
//     }
//     const inputPlayerId = prompt('Enter Player ID (player1 or player2):');
//     if (inputPlayerId !== 'player1' && inputPlayerId !== 'player2') {
//       alert('Player ID must be "player1" or "player2"');
//       return;
//     }
//     console.log(`Joining game ${inputGameId} as ${inputPlayerId}`);
//     socket.emit('join_game', { game_id: inputGameId, player_id: inputPlayerId });
//     setGameId(inputGameId);
//     setPlayerId(inputPlayerId);
//     setShowGamePrompt(false);
//   };

//   const incrementScore = () => {
//     if (!gameId || !playerId) return;
//     console.log(`Incrementing score for ${playerId} in game ${gameId}`);
//     socket.emit('increment_score', { game_id: gameId, player_id: playerId });

//   };

//     //   setScores((prevScores) => ({
//     //   ...prevScores,
//     //   [playerId]: prevScores[playerId] + 1,
//     // }));
    

//   const startNewGame = () => {
//     setShowGamePrompt(true);
//     setGameId(null);
//     setPlayerId(null);
//     setScores({ player1: 0, player2: 0 });
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       {showGamePrompt ? (
//         <div>
//           <h1>Join a Game</h1>
//           <button onClick={joinGame}>Join Game</button>
//         </div>
//       ) : (
//         <>
//           <h1>Game ID: {gameId}</h1>
//           <h2>Player 1 Score: {scores.player1}</h2>
//           <h2>Player 2 Score: {scores.player2}</h2>
//           {playerId && (
//             <button
//               onClick={incrementScore}
//               disabled={playerId !== 'player1' && playerId !== 'player2'}
//             >
//               Increment {playerId}'s Score
//             </button>
//           )}
//           <button onClick={startNewGame} style={{ marginLeft: '10px' }}>
//             New Game
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:8000', { transports: ['websocket'], reconnectionAttempts: 5 });

const Dice = ({
  onRoll, onPositionUpdate, onBuy, onPass, onBuyHouse, onOther, currentPlayerObj, currentPlayer, players,
  properties, triggerFlash, onPayJail, onUseJailCard
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
  };

  useEffect(() => {
    console.log('Setting up socket listeners for player:', currentPlayerObj.id);
    socket.emit('join_game', { game_id: 'game123', player_id: currentPlayerObj.id });
    });

  useEffect(() => {
    const handleDiceResult = ({ diceOne, diceTwo }) => {
      console.log('Received dice_result:', diceOne, diceTwo);
      setTimeout(() => {
        const newValues = [diceOne, diceTwo];
        console.log('Setting dice values:', newValues);
        setDiceValues(newValues);
        setIsRolling(false);
        onRoll(newValues);
        const total = newValues[0] + newValues[1];
        const newPosition = (currentPlayerObj.position + total) % 40;
        onPositionUpdate(currentPlayerObj.id, newPosition);
        const currentSquare = properties[newPosition];
        if (!currentPlayerObj.inJail) {
          setFlashState('current');
          setFlashMessage(
            `${currentPlayerObj.name}: ${currentSquare.name}${
              currentSquare.price !== undefined && currentSquare.type === 'property' ? ` ($${currentSquare.price})` : ''
            }`
          );
          const needsAction = currentSquare.owner === null && currentSquare.price !== undefined && currentSquare.type === 'property';
          setShowButtons(needsAction);
          setWaitingForAction(needsAction);
        } else {
          setFlashState('current');
        }
      }, 1000);
    };

    socket.on('dice_result', handleDiceResult);
    socket.on('error', (error) => {
      console.error('Socket error:', error || 'No error message');
      setIsRolling(false);
    });
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    return () => {
      socket.off('dice_result', handleDiceResult);
      socket.off('error');
      socket.off('connect_error');
    };
  }, [currentPlayerObj.id]); // Depend only on player ID to avoid re-runs

  const rollDice = () => {
    setIsRolling(true);
    console.log('Emitting roll_dice for player:', currentPlayerObj.id, 'game_id: game123');
    socket.emit('roll_dice', { player_id: currentPlayerObj.id, game_id: 'game123' });
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
                <button className="buy-button" onClick={handleBuy} disabled={isRolling}>Buy</button>
                <button className="pass-button" onClick={handlePass} disabled={isRolling}>Pass</button>
              </>
            )}
            {canBuyHouse(currentPlayerObj, properties[currentPlayerObj.position].group) && (
              <button className="buy-house-button" onClick={() => handleBuyHouse(properties[currentPlayerObj.position].group)}>
                Buy House
              </button>
            )}
          </div>
        )}
        {currentPlayerObj.inJail && (
          <div className="jail-actions">
            <button onClick={() => onPayJail(currentPlayerObj.id)} disabled={isRolling}>Pay $50 to get out of Jail</button>
            {currentPlayerObj.getOutOfJailFree > 0 && (
              <button onClick={() => onUseJailCard(currentPlayerObj.id)} disabled={isRolling}>Play Get Out of Jail Free</button>
            )}
          </div>
        )}
        {!showButtons && flashState === 'current' && properties[currentPlayerObj.position].owner !== null && properties[currentPlayerObj.position].price !== undefined && (
          <div className={`pay-rent ${triggerFlash ? 'flashing' : ''}`}>Pay Rent</div>
        )}
      </div>
    </div>
  );
};

export default Dice;