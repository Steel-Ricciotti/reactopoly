// src/Property.js
import React from 'react';

const Property = ({ name, color, pos, price, isSelected, onClick,numHouses = 0 }) => {
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
      <div className="property-name">{name}</div>
      {/* Test */}
        {/* <div className = "house house-1"></div>
        <div className = "house house-2"></div>
        <div className = "house house-3"></div>
        <div className = "house house-4"></div> */}
        {/* <div className = "hotel"></div> */}

      {/* Render houses if 1–4 */}
      {numHouses > 0 && numHouses < 5 &&
        [...Array(numHouses)].map((_, i) => (
          <div key={i} className={`house house-${i + 1}`}></div>
        ))
      }

      {/* Render hotel if 5 */}
      {numHouses === 5 && <div className="hotel"></div>}
    </div>
  );
};

export default Property;