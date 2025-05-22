// src/SquareFlash.js
import React, { useState, useEffect } from 'react';

const SquareFlash = ({ squareName, triggerFlash }) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (triggerFlash) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1500); // Match flash animation duration (0.5s x 3)
    }
  }, [triggerFlash]);

  return (
    <div className={`square-flash ${isFlashing ? 'flashing' : ''}`}>
      {squareName}
    </div>
  );
};

export default SquareFlash;