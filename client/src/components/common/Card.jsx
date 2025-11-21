import React from 'react';
import './Card.css';

const Card = ({ children, className = '', variant = 'default', hover = false, ...props }) => {
  const variantClass = variant !== 'default' ? `card--${variant}` : '';
  const hoverClass = hover ? 'card--hover' : '';
  
  return (
    <div 
      className={`card ${variantClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
