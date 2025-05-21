// src/Property.js
import React from 'react';

const Property = ({ name, color, pos, isSelected, onClick }) => {
  const style = {
    gridArea: `${pos[0]} / ${pos[1]} / span 1 / span 1`,
  };

  const classes = [
    'property',
    pos[0] === 1 ? 'top-row' : '',
    pos[0] === 11 ? 'bottom-row' : '',
    pos[1] === 1 ? 'left-column' : '',
    pos[1] === 11 ? 'right-column' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={onClick}>
      {color && <div className={`color-bar ${color}`}></div>}
      {name}
    </div>
  );
};

export default Property;