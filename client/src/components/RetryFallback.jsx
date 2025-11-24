import React from 'react';
import './RetryFallback.css';

export default function RetryFallback({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="retry-fallback">
      <div className="retry-icon">⚠️</div>
      <h3 className="retry-title">{message}</h3>
      <div className="retry-actions">
        <button className="retry-btn" onClick={onRetry}>Retry</button>
        <button className="reload-btn" onClick={() => window.location.reload()}>Reload App</button>
      </div>
    </div>
  );
}
