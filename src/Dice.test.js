// src/Dice.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dice from './Dice';

describe('Dice Component', () => {
  // Mock props
  const mockOnRoll = jest.fn();
  const mockOnPositionUpdate = jest.fn();
  const mockOnBuy = jest.fn();
  const mockOnPass = jest.fn();
  const mockOnOther = jest.fn();
  const mockCurrentPlayerObj = {
    id: 'Player 3',
    name: 'Player 3',
    position: 0,
  };
  const mockPlayers = [
    { id: 'Player 3', name: 'Player 3' },
    { id: 'Player 4', name: 'Player 4' },
  ];
  const mockProperties = [
    { name: 'Go', pos: 0, type: 'corner' },
    { name: 'Mediterranean Avenue', pos: 1, type: 'property', group: 'brown', price: 60, owner: null },
    // Simplified for brevity; include relevant properties
    { name: 'St. James Place', pos: 16, type: 'property', group: 'orange', price: 180, owner: null },
    { name: 'Tennessee Avenue', pos: 18, type: 'property', group: 'orange', price: 180, owner: 'Player 4' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
    mockOnRoll.mockClear();
    mockOnPositionUpdate.mockClear();
    mockOnBuy.mockClear();
    mockOnPass.mockClear();
    mockOnOther.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial UI correctly', () => {
    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={mockCurrentPlayerObj}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={false}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument(); // Initial diceValues [1, 1]
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Roll Dice')).toBeInTheDocument();
    expect(screen.queryByText('Buy')).not.toBeInTheDocument();
    expect(screen.queryByText('Pass')).not.toBeInTheDocument();
    expect(screen.queryByText('Pay Rent')).not.toBeInTheDocument();
  });

  test('rolls dice and updates position', async () => {
    // Mock Math.random to return 3 and 4
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.4) // (0.4 * 6) + 1 = 3.4 → 3
      .mockReturnValueOnce(0.6); // (0.6 * 6) + 1 = 4.6 → 4

    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={{ ...mockCurrentPlayerObj, position: 14 }}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={true}
      />
    );

    fireEvent.click(screen.getByText('Roll Dice'));
    expect(screen.getByText('Rolling...')).toBeInTheDocument();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    jest.advanceTimersByTime(1000); // Complete roll animation

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
    expect(mockOnRoll).toHaveBeenCalledWith([3, 4]);
    expect(mockOnPositionUpdate).toHaveBeenCalledWith('Player 3', 21); // 14 + (3 + 4) = 21
    expect(screen.getByText('Player 3: St. James Place ($180)')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
  });

  test('disables roll button while waiting for action', async () => {
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.6); // 4

    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={{ ...mockCurrentPlayerObj, position: 14 }}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={true}
      />
    );

    fireEvent.click(screen.getByText('Roll Dice'));
    jest.advanceTimersByTime(1000); // Complete roll

    await waitFor(() => {
      expect(screen.getByText('Player 3: St. James Place ($180)')).toBeInTheDocument();
    });
    expect(screen.getByText('Roll Dice')).toBeDisabled();
    expect(screen.getByText('Buy')).toBeInTheDocument();
  });

  test('handles buy action', async () => {
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.6); // 4

    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={{ ...mockCurrentPlayerObj, position: 14 }}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={true}
      />
    );

    fireEvent.click(screen.getByText('Roll Dice'));
    jest.advanceTimersByTime(1000); // Complete roll

    await waitFor(() => {
      expect(screen.getByText('Buy')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Buy'));

    expect(mockOnBuy).toHaveBeenCalled();
    expect(screen.queryByText('Buy')).not.toBeInTheDocument();
    expect(screen.queryByText('Pass')).not.toBeInTheDocument();
    expect(screen.getByText('Roll Dice')).not.toBeDisabled();
  });

  test('triggers onOther for owned property and transitions flash states', async () => {
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.6); // 4

    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={{ ...mockCurrentPlayerObj, position: 11 }}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={true}
      />
    );

    fireEvent.click(screen.getByText('Roll Dice'));
    jest.advanceTimersByTime(1000); // Complete roll

    await waitFor(() => {
      expect(screen.getByText('Player 3: Tennessee Avenue ($180)')).toBeInTheDocument();
    });
    expect(screen.getByText('Pay Rent')).toBeInTheDocument();
    expect(screen.queryByText('Buy')).not.toBeInTheDocument();

    jest.advanceTimersByTime(1500); // Complete flashState: current
    expect(mockOnOther).toHaveBeenCalled();
    expect(screen.queryByText('Player 3: Tennessee Avenue ($180)')).not.toBeInTheDocument();

    jest.advanceTimersByTime(1000); // Complete flashState: pause
    await waitFor(() => {
      expect(screen.getByText("Player 4's Turn")).toBeInTheDocument();
    });
  });

  test('handles non-property square', async () => {
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.6); // 4

    render(
      <Dice
        onRoll={mockOnRoll}
        onPositionUpdate={mockOnPositionUpdate}
        onBuy={mockOnBuy}
        onPass={mockOnPass}
        onOther={mockOnOther}
        currentPlayerObj={{ ...mockCurrentPlayerObj, position: 5 }}
        currentPlayer="Player 3"
        players={mockPlayers}
        properties={mockProperties}
        triggerFlash={true}
      />
    );

    fireEvent.click(screen.getByText('Roll Dice'));
    jest.advanceTimersByTime(1000); // Complete roll

    await waitFor(() => {
      expect(screen.getByText('Player 3: Go')).toBeInTheDocument();
    });
    expect(screen.queryByText('Buy')).not.toBeInTheDocument();
    expect(screen.queryByText('Pay Rent')).not.toBeInTheDocument();

    jest.advanceTimersByTime(1500); // Complete flashState: current
    expect(mockOnOther).toHaveBeenCalled();
  });
});