// src/Corner.js
import React from 'react';

const Corner = ({ name, pos }) => {
  const style = {
    gridArea: `${pos[0]} / ${pos[1]} / span 1 / span 1`,
  };

  const classes = [
    'corner',
    pos[0] === 1 ? 'top-row' : '',
    pos[0] === 11 ? 'bottom-row' : '',
    pos[1] === 1 ? 'left-column' : '',
    pos[1] === 11 ? 'right-column' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {name}
    </div>
  );
};

export default Corner;