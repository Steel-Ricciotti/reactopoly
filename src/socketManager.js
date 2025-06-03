// useSocketManager.js
import { useEffect, useRef } from 'react';
import socket from './socket';

let listenersSetup = false;

export const useSocketManager = (onDiceResult, onError) => {
  const onDiceResultRef = useRef(onDiceResult);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onDiceResultRef.current = onDiceResult;
    onErrorRef.current = onError;
  }, [onDiceResult, onError]);

  useEffect(() => {
    if (listenersSetup) {
      console.log('Socket listeners already setup globally');
      return;
    }

    console.log('Setting up socket listeners (global)');
    listenersSetup = true;

    const handleDiceResult = (data) => {
      console.log('Received dice_result:', data);
      if (onDiceResultRef.current) {
        onDiceResultRef.current(data);
      }
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
    };

    const handleConnectError = (err) => {
      console.error('Connection error:', err.message);
      if (onErrorRef.current) {
        onErrorRef.current({ message: err.message });
      }
    };

    // Remove existing listeners
    socket.off('dice_result');
    socket.off('error');
    socket.off('connect_error');

    // Add new listeners
    socket.on('dice_result', handleDiceResult);
    socket.on('error', handleError);
    socket.on('connect_error', handleConnectError);

    // Don't cleanup on individual component unmount since this is global
    return () => {
      console.log('Socket manager cleanup');
    };
  }, []);

  return socket;
};