// src/Dice.js
import React, { useState } from 'react';

const Dice = ({ onRoll, onBuy, squareName, squarePrice, squareOwner, triggerFlash }) => {
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

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
    }, 1000);
  };

  return (
    <div className="dice-container">
      <div className="dice-row">
        <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[0]}</div>
        <div className={`die ${isRolling ? 'rolling' : ''}`}>{diceValues[1]}</div>
      </div>
      <button className="roll-button" onClick={rollDice} disabled={isRolling}>
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
      <div className="square-flash-container">
        <div className={`square-flash ${isRolling ? '' : triggerFlash ? 'flashing' : ''}`}>
          {squareName} {squarePrice !== undefined ? `($${squarePrice})` : ''}
        </div>
        {squarePrice !== undefined && (
          squareOwner === null ? (
            <button className="buy-button" onClick={onBuy}>Buy</button>
          ) : (
            <div className={`pay-rent ${isRolling ? '' : triggerFlash ? 'flashing' : ''}`}>
              Pay Rent
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dice;