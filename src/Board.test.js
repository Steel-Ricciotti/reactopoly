import { render, screen, waitFor } from '@testing-library/react';
import Board from './Board';
import { properties } from './properties';
import React, { useState, useEffect } from 'react';
// Mock getGroupedProperties to test in isolation
jest.mock('./Property', () => ({ name, color, houses = 0 }) => (
  <div data-testid="property-card" className="property-card">
    <div className={`color-bar ${color}`}></div>
    <span>{name}</span>
    {houses > 0 && <span data-testid="house-count">{houses}</span>}
  </div>
));

jest.mock('./Corner', () => () => <div />);
jest.mock('./Dice', () => ({ onBuyHouse }) => (
  <div>
    <button onClick={() => onBuyHouse('Player 3', 16)}>Buy House</button>
  </div>
));
jest.mock('./Piece', () => () => <div />);
jest.mock('./Player', () => ({ name }) => <div>{name}</div>);

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
//Passers
describe('Board Card Stacking', () => {
  // Test getGroupedProperties logic
  test('groups two orange properties together', () => {
    const mockProperties = [
      { ...properties[16], owner: 'Player 1' }, // St. James Place (orange)
      { ...properties[18], owner: 'Player 1' }, // Tennessee Avenue (orange)
    ];
    const result = getGroupedProperties(mockProperties);
    expect(result).toHaveLength(1);
    expect(result[0].group).toBe('orange');
    debugger;
    expect(result[0].props).toHaveLength(2);
    expect(result[0].props[0].name).toBe('St. James Place');
    expect(result[0].props[1].name).toBe('Tennessee Avenue');
    expect(result[0].index).toBe(0);
  });
  test('separates orange and brown properties', () => {
    const mockProperties = [
      { ...properties[16], owner: 'Player 1' }, // St. James Place (orange)
      { ...properties[3], owner: 'Player 1' },  // Baltic Avenue (brown)
    ];
    const result = getGroupedProperties(mockProperties);
    expect(result).toHaveLength(2);
    expect(result[0].group).toBe('orange');
    expect(result[0].props).toHaveLength(1);
    expect(result[0].props[0].name).toBe('St. James Place');
    expect(result[1].group).toBe('purple');
    expect(result[1].props).toHaveLength(1);
    expect(result[1].props[0].name).toBe('Baltic Avenue');
  });
  test('treats railroad as individual group', () => {    const mockProperties = [
      { ...properties[5], owner: 'Player 1' }, // Reading Railroad
    ];
    const result = getGroupedProperties(mockProperties);
    expect(result).toHaveLength(1);
    expect(result[0].group).toBe('Reading Railroad');
    expect(result[0].props).toHaveLength(1);
    expect(result[0].props[0].name).toBe('Reading Railroad');
  });
  // Test Board rendering (simplified, may need state mocking)
//Failures
test('renders one card with stack count for two orange properties', async () => {
  const mockPlayers = [
    {
      id: 'Player 3',
      name: 'Player 3',
      piece: 'Dog',
      balance: 1000,
      properties: [
        { ...properties[16], owner: 'Player 3' },
        { ...properties[18], owner: 'Player 3' },
      ],
      side: 'top',
      position: 0,
    },
  ];
  console.log('Mock Players:', mockPlayers);
  console.log('Grouped Properties:', getGroupedProperties(mockPlayers[0].properties));
  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [null, jest.fn()])
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [properties, jest.fn()])
    .mockImplementationOnce(() => [mockPlayers, jest.fn()])
    .mockImplementationOnce(() => ['Player 3', jest.fn()]);
  render(<Board />);
  await waitFor(() => {
    expect(screen.getByText('St. James Place')).toBeInTheDocument();
    expect(screen.getByText('Tennessee Avenue')).toBeInTheDocument();
  });
  console.log('Rendered DOM:');
  screen.debug();
  const stackCount = await waitFor(() =>
    screen.getByText((content, element) => element?.className === 'stack-count' && content === '2')
  );
  expect(stackCount).toBeInTheDocument();
  const propertyCards = await waitFor(() => screen.getAllByTestId('property-card'));
  console.log('Property Cards Found:', propertyCards.length);
  expect(propertyCards).toHaveLength(2);
  expect(propertyCards[1]).toHaveStyle({ top: '-65px' });
});

test('renders two cards for orange and brown properties', async () => {
  const mockPlayers = [
    {
      id: 'Player 3',
      name: 'Player 3',
      piece: 'Dog',
      balance: 1000,
      properties: [
        { ...properties[16], owner: 'Player 3' },
        { ...properties[3], owner: 'Player 3' },
      ],
      side: 'top',
      position: 0,
    },
  ];
  console.log('Mock Players:', mockPlayers);
  console.log('Grouped Properties:', getGroupedProperties(mockPlayers[0].properties));
  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [null, jest.fn()])
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [properties, jest.fn()])
    .mockImplementationOnce(() => [mockPlayers, jest.fn()])
    .mockImplementationOnce(() => ['Player 3', jest.fn()]);
  render(<Board />);
  await waitFor(() => {
    expect(screen.getByText('St. James Place')).toBeInTheDocument();
    expect(screen.getByText('Baltic Avenue')).toBeInTheDocument();
  });
  console.log('Rendered DOM:');
  screen.debug();
  expect(screen.queryByText('2')).not.toBeInTheDocument();
  const propertyCards = await waitFor(() => screen.getAllByTestId('property-card'));
  console.log('Property Cards Found:', propertyCards.length);
  expect(propertyCards).toHaveLength(2);
});


describe('House Buying', () => {
  const mockPlayers = [
    {
      id: 'Player 3',
      name: 'Player 3',
      piece: 'Dog',
      balance: 1000,
      properties: [
        { ...properties[16], owner: 'Player 3' }, // St. James Place
        { ...properties[18], owner: 'Player 3' }, // Tennessee Avenue
        { ...properties[19], owner: 'Player 3' }, // New York Avenue
      ],
      side: 'top',
      position: 16, // On St. James Place
    },
  ];
// New function to check if a player can buy a house



test('canBuyHouse returns true for full orange group', () => {
const canBuyHouse = (player, group, properties) => {
  const groupProps = properties.filter(p => p.group === group && p.owner === player.id);
  return groupProps.length === properties.filter(p => p.group === group).length;
};

  const result = canBuyHouse(mockPlayers[0], 'orange', properties);
  expect(result).toBe(true);

  // Test partial group
  const partialPlayer = {
    ...mockPlayers[0],
    properties: [
      { ...properties[16], owner: 'Player 3' },
      { ...properties[18], owner: 'Player 3' },
    ],
  };
  expect(canBuyHouse(partialPlayer, 'orange', properties)).toBe(false);
});
});  
test('buying a house updates property and player state', () => {
  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [null, jest.fn()]) // selectedProperty
    .mockImplementationOnce(() => [false, jest.fn()]) // flashTrigger
    .mockImplementationOnce(() => [mockProperties, jest.fn()]) // properties
    .mockImplementationOnce(() => [mockPlayers, jest.fn()]) // players
    .mockImplementationOnce(() => ['Player 3', jest.fn()]); // currentPlayer

  render(<Board />);

  // Click "Buy House" for St. James Place (position 16)
  fireEvent.click(screen.getByText('Buy House'));

  // Check house count on St. James Place
  const propertyCard = screen.getAllByTestId('property-card').find(
    (el) => el.textContent.includes('St. James Place')
  );
  expect(propertyCard).toBeInTheDocument();
  expect(screen.getByTestId('house-count')).toHaveTextContent('1');

  // Check player balance (assume house cost is 100 for orange group)
  expect(mockPlayers[0].balance).toBe(1000); // Will update after implementation
});
});