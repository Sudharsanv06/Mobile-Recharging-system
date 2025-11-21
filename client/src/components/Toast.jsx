import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('success'); // success, error, info, warning

  useEffect(() => {
    const handler = (e) => {
      const msg = e.detail?.message || '';
      const toastType = e.detail?.type || 'success';
      setMessage(msg);
      setType(toastType);
      setVisible(true);
      
      const duration = e.detail?.duration || 4000;
      setTimeout(() => setVisible(false), duration);
    };
    window.addEventListener('app-show-toast', handler);
    return () => window.removeEventListener('app-show-toast', handler);
  }, []);

  if (!visible) return null;

  const getIcon = () => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '✓';
    }
  };

  return (
    <div className={`app-toast app-toast-${type} ${visible ? 'app-toast-visible' : ''}`} role="alert">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={() => setVisible(false)}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
