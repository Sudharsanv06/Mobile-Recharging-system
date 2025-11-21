import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  title = 'Error', 
  type = 'error',
  onRetry,
  onDismiss 
}) => {
  const typeClass = `error-message--${type}`;
  
  return (
    <div className={`error-message ${typeClass}`} role="alert">
      <div className="error-message__content">
        {title && <h3 className="error-message__title">{title}</h3>}
        <p className="error-message__text">{message}</p>
      </div>
      {(onRetry || onDismiss) && (
        <div className="error-message__actions">
          {onRetry && (
            <button 
              className="error-message__button error-message__button--retry"
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
          {onDismiss && (
            <button 
              className="error-message__button error-message__button--dismiss"
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
