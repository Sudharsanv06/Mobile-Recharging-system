import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = '', fullscreen = false }) => {
  const sizeClass = `spinner--${size}`;
  
  if (fullscreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner ${sizeClass}`}></div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
