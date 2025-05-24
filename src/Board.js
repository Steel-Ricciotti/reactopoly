
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
const CHANCE_POSITIONS = [7, 22,36];

const Board = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [showBuyHouseModal, setShowBuyHouseModal] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerSelections, setPlayerSelections] = useState(Array(2).fill(null));
  const [currentConfigPlayer, setCurrentConfigPlayer] = useState(-1); // Start at main menu
  const pieceOptions = ['Thimble', 'Car', 'Dog', 'Hat'];
  const [properties, setProperties] = useState(
    initialProperties.map(prop => ({
      ...prop,
      numHouses: 0,
      houseCost: prop.group === 'purple' ? 50 : 100,
    }))
  );
  // const [players, setPlayers] = useState([]);

  











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
        { ...initialProperties[15], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[16], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[1], owner: 'Player 1', numHouses: 0 },
      ],
      side: 'bottom',
      position: 10,
      inJail: true,
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
        { ...initialProperties[15], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[16], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[17], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[18], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[1], owner: 'Player 1', numHouses: 0 },
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
        { ...initialProperties[15], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[16], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[17], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[18], owner: 'Player 1', numHouses: 0 },
        { ...initialProperties[1], owner: 'Player 1', numHouses: 0 },
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

  const getEligibleHouseGroups = (player) => {
    const groups = {};
    properties.forEach(prop => {
      if (prop.group && prop.group !== 'railroad' && prop.group !== 'utility') {
        if (!groups[prop.group]) groups[prop.group] = [];
        groups[prop.group].push(prop);
      }
    });
    return Object.entries(groups)
      .filter(([group, props]) => props.every(p => p.owner === player.id))
      .map(([group, props]) => ({ group, props }));
  };

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
    if (nextProp.numHouses < 5 && player.balance >= houseCost) {
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
    let passedGo = newPosition < prevPosition || newPosition === 0;

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
          left: `${10 + index * 80}px`,
          bottom: `${-110 - propertyIndex * 20}px`,
        };
      case 'left':
        return {
          ...baseStyle,
          left: `${-100 - propertyIndex * 20}px`,
          top: `${10 + index * 80}px`,
        };
      case 'top':
        return {
          ...baseStyle,
          left: `${10 + index * 80}px`,
          top: `${-110 - propertyIndex * 20}px`,
        };
      case 'right':
        return {
          ...baseStyle,
          right: `${-100 - propertyIndex * 20}px`,
          top: `${10 + index * 80}px`,
        };
      default:
        return {
          ...baseStyle,
          left: `${10 + index * 80}px`,
          bottom: `${-110 - propertyIndex * 20}px`,
        };
    }
  };

  const handleStartNewGame = () => {
    setPlayerSelections(Array(numPlayers).fill(null));
    setCurrentConfigPlayer(0); // Start piece selection
  };

  const handlePieceSelect = (piece) => {
    const updated = [...playerSelections];
    updated[currentConfigPlayer] = piece;
    setPlayerSelections(updated);

    if (currentConfigPlayer < numPlayers - 1) {
      setCurrentConfigPlayer(currentConfigPlayer + 1);
    } else {
      const sides = ['bottom', 'left', 'top', 'right'];
      setPlayers(updated.map((piece, idx) => ({
        id: `Player ${idx + 1}`,
        name: `Player ${idx + 1}`,
        piece,
        position: 0,
        balance: 1500,
        properties: [],
        side: sides[idx] || 'bottom',
        inJail: false,
        jailTurns: 0,
        getOutOfJailFree: 0,
      })));
      setCurrentPlayer('Player 1');
      setShowStartMenu(false);
    }
  };

  useEffect(() => {
    if (flashTrigger) {
      setTimeout(() => setFlashTrigger(false), 1500);
    }
  }, [flashTrigger]);

  if (showStartMenu) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          {currentConfigPlayer >= 0 ? (
            <>
              <h3>Player {currentConfigPlayer + 1}: Choose Your Piece</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {pieceOptions
                  .filter(opt => !playerSelections.includes(opt))
                  .map(opt => (
                    <button
                      key={opt}
                      className="modal-button"
                      onClick={() => handlePieceSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <>

              <div style={{ marginTop: 20 }}>
                <label>
                  Number of Players:
                  <select
                    value={numPlayers}
                    onChange={e => setNumPlayers(Number(e.target.value))}
                  >
                    {[1,2, 3, 4].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                className="modal-button"
                onClick={handleStartNewGame}
              >
                New Game
              </button>
              <button className="modal-button" onClick={() => {}}>
                Load Game
              </button>
              <button className="modal-button" onClick={() => {}}>
                Settings
              </button>
              <button className="modal-button" onClick={() => {}}>
                Exit
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!players.length) return null;

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
                className={`card ${player.side}`}
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
        {getEligibleHouseGroups(currentPlayerObj).length > 0 && (
          <button
            style={{ marginTop: 20, width: '100%' }}
            onClick={() => setShowBuyHouseModal(true)}
          >
            Buy Houses
          </button>
        )}
      </div>
      {showBuyHouseModal && (
        <div className="modal-overlay">
          <div className="modal buy-house-modal">
            <h3>Buy Houses</h3>
            <button
              style={{ float: 'right', marginBottom: 10 }}
              onClick={() => setShowBuyHouseModal(false)}
            >
              Exit
            </button>
            <div>
              {getEligibleHouseGroups(currentPlayerObj).map(({ group, props }) => (
                <div
                  key={group}
                  className="buy-house-group"
                  style={{
                    border: '1px solid #ccc',
                    margin: '10px 0',
                    padding: 10,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    handleBuyHouse(currentPlayerObj.id, group);
                  }}
                >
                  <strong style={{ color: props[0].color }}>{group.toUpperCase()}</strong>
                  <div>
                    {props.map(p => (
                      <span key={p.name} style={{ marginRight: 8 }}>
                        {p.name} (Houses: {p.numHouses})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
