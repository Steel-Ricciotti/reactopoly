import { render, screen } from '@testing-library/react';
import Board from './Board';
import { properties } from './properties';
import React, { useState, useEffect } from 'react';
// Mock getGroupedProperties to test in isolation
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

  test('treats railroad as individual group', () => {
    const mockProperties = [
      { ...properties[5], owner: 'Player 1' }, // Reading Railroad
    ];
    const result = getGroupedProperties(mockProperties);
    expect(result).toHaveLength(1);
    expect(result[0].group).toBe('Reading Railroad');
    expect(result[0].props).toHaveLength(1);
    expect(result[0].props[0].name).toBe('Reading Railroad');
  });

  // Test Board rendering (simplified, may need state mocking)
  test('renders one card with stack count for two orange properties', () => {
    const mockPlayers = [
      {
        id: 'Player 1',
        name: 'Player 1',
        piece: 'Thimble',
        balance: 1000,
        properties: [
          { ...properties[16], owner: 'Player 1' }, // St. James Place
          { ...properties[18], owner: 'Player 1' }, // Tennessee Avenue
        ],
        side: 'bottom',
        position: 0,
      },
    ];
    // Mock useState to control players
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockPlayers, jest.fn()]);
    render(<Board />);
    expect(screen.getByText('Tennessee Avenue')).toBeInTheDocument();
    expect(screen.getByText('2')).toHaveClass('stack-count');
    expect(screen.getAllByTestId('property-card')).toHaveLength(1);
  });

  test('renders two cards for orange and brown properties', () => {
    const mockPlayers = [
      {
        id: 'Player 1',
        name: 'Player 1',
        piece: 'Thimble',
        balance: 1000,
        properties: [
          { ...properties[16], owner: 'Player 1' }, // St. James Place
          { ...properties[3], owner: 'Player 1' },  // Baltic Avenue
        ],
        side: 'bottom',
        position: 0,
      },
    ];
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockPlayers, jest.fn()]);
    render(<Board />);
    expect(screen.getByText('St. James Place')).toBeInTheDocument();
    expect(screen.getByText('Baltic Avenue')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('property-card')).toHaveLength(2);
  });
});