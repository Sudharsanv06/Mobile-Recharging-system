import React, { useState } from 'react';
import './MobileVerification.css';
import api from '../utils/api';
import { z } from 'zod';

const MobileVerification = ({ onVerificationComplete, onVerified, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async () => {
    // Validate with Zod
    const schema = z.object({ phoneNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number') });
    const v = schema.safeParse({ phoneNumber });
    if (!v.success) {
      setError(v.error.errors[0].message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/v1/verification/send-otp', { phoneNumber });
      if (res.status >= 200 && res.status < 300) {
        setSuccess('OTP sent successfully!');
        setStep('otp');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('OTP Error:', error);
      setError('Network error. Please check if the backend server is running and Twilio is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const schema = z.object({ otp: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit OTP') });
    const v = schema.safeParse({ otp });
    if (!v.success) {
      setError(v.error.errors[0].message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/v1/verification/verify-otp', { phoneNumber, otp });
      if (res.status >= 200 && res.status < 300) {
        setSuccess('Mobile number verified successfully!');
        setTimeout(() => {
          if (typeof onVerificationComplete === 'function') onVerificationComplete(phoneNumber);
          if (typeof onVerified === 'function') onVerified(phoneNumber);
        }, 1500);
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