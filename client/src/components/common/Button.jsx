import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props 
}) => {
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const widthClass = fullWidth ? 'btn--full' : '';
  const disabledClass = disabled || loading ? 'btn--disabled' : '';
  
  return (
    <button 
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner"></span>
      )}
      {!loading && leftIcon && (
        <span className="btn__icon btn__icon--left">{leftIcon}</span>
      )}
      <span className="btn__text">{children}</span>
      {!loading && rightIcon && (
        <span className="btn__icon btn__icon--right">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
