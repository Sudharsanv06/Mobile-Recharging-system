import React, { useState } from 'react';
import './MobileVerification.css';

const MobileVerification = ({ onVerificationComplete, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/verification/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent successfully!');
        setStep('otp');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.msg || 'Failed to send OTP. Please check your Twilio configuration.');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      setError('Network error. Please check if the backend server is running and Twilio is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/verification/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Mobile number verified successfully!');
        setTimeout(() => {
          onVerificationComplete(phoneNumber);
        }, 1500);
      } else {
        setError(data.msg || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setError('');
    handleSendOTP();
  };

  return (
    <div className="mobile-verification-overlay">
      <div className="mobile-verification-modal">
        <div className="verification-header">
          <h2>📱 Mobile Number Verification</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {step === 'phone' && (
          <div className="verification-step">
            <p>Please enter your mobile number to receive an OTP</p>
            
            <div className="input-group">
              <div className="country-code">🇮🇳 +91</div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                className="phone-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              className="send-otp-btn"
              onClick={handleSendOTP}
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="verification-step">
            <p>Enter the 6-digit OTP sent to +91 {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')}</p>
            
            <div className="otp-input-group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="otp-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="otp-actions">
              <button 
                className="verify-otp-btn"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button 
                className="resend-otp-btn"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>

            <button 
              className="back-btn"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
            >
              ← Back to Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVerification; 