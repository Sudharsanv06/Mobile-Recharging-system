import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, LoadingSpinner, ErrorMessage } from './common';
import './Payment.css';
import { toast } from '../utils/toast';
import api from '../utils/api';
import { z } from 'zod';

export default function Payment({ rechargeDetails: propRechargeDetails }) {
  const navigate = useNavigate();
  const location = useLocation();
  const rechargeDetails = propRechargeDetails || location.state || {};
  
  const [mobileNumber, setMobileNumber] = useState(rechargeDetails.mobileNumber || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [operator, setOperator] = useState(null);
  const [loadingOperator, setLoadingOperator] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentRechargeId, setCurrentRechargeId] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch operator details if operatorId is provided
  useEffect(() => {
    if (rechargeDetails.operatorId && !rechargeDetails.operator) {
      setLoadingOperator(true);
      api.get(`/api/v1/operators/${rechargeDetails.operatorId}`)
        .then(res => {
          const op = res.data?.data || res.data;
          setOperator(op);
        })
        .catch(err => {
          console.warn('Could not fetch operator details:', err);
        })
        .finally(() => setLoadingOperator(false));
    }
  }, [rechargeDetails.operatorId]);

  const operatorName = rechargeDetails.operator || operator?.name || 'Operator';
  const amount = parseFloat(rechargeDetails.amount || '0');
  const operatorId = rechargeDetails.operatorId || operator?._id;

  const mobileSchema = z.object({
    mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
  });

  const handleRazorpayPayment = async (rechargeId) => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    try {
      // Create Razorpay order
      const orderRes = await api.post('/api/v1/payments/create-order', {
        amount,
        rechargeId,
      });

      const { orderId, keyId } = orderRes.data.data;

      const options = {
        key: keyId,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Mobile Recharge',
        description: `${operatorName} Recharge`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await api.post('/api/v1/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              rechargeId,
            });

            const rechargeData = verifyRes.data.data;
            toast.success('Payment successful! Recharge completed.');
            navigate('/success', {
              state: {
                recharge: {
                  ...rechargeData,
                  operator: operatorName,
                  mobileNumber,
                  amount,
                },
              },
            });
          } catch (err) {
            toast.error('Payment verification failed');
            setError('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          contact: mobileNumber,
        },
        theme: {
          color: '#007bff',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      toast.error('Failed to initialize payment');
      setError('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setError(null);
    
    // Validate mobile number
    const validation = mobileSchema.safeParse({ mobileNumber });
    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || 'Invalid mobile number';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (!operatorId) {
      const errorMsg = 'Operator information is missing. Please go back and select a plan.';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (amount <= 0) {
      const errorMsg = 'Invalid recharge amount. Please select a valid plan.';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setIsProcessing(true);
    try {
      // Create recharge first
      const res = await api.post('/api/v1/recharges', {
        operatorId,
        mobileNumber,
        amount: amount,
        paymentMethod: selectedPaymentMethod === 'razorpay' ? 'razorpay' : 'wallet',
      });
      
      const rechargeData = res?.data?.data || res?.data || {};
      const rechargeId = rechargeData._id || rechargeData.id;
      setCurrentRechargeId(rechargeId);

      // If wallet payment, proceed directly
      if (selectedPaymentMethod === 'wallet') {
        toast.success('Payment successful! Recharge completed.');
        navigate('/success', { 
          state: { 
            recharge: {
              ...rechargeData,
              operator: operatorName,
              mobileNumber,
              amount,
            }
          } 
        });
      } else if (selectedPaymentMethod === 'razorpay') {
        // Handle Razorpay payment
        await handleRazorpayPayment(rechargeId);
        return; // Don't set processing to false here, handled in Razorpay handler
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Payment failed. Please try again.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      if (selectedPaymentMethod === 'wallet') {
        setIsProcessing(false);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (loadingOperator) {
    return (
      <div className="payment-page">
        <LoadingSpinner fullscreen text="Loading payment details..." />
      </div>
    );
  }

  // Error state if no recharge details
  if (!rechargeDetails || (!rechargeDetails.amount && !operatorId)) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <ErrorMessage
            title="Missing Payment Information"
            message="No recharge details found. Please go back and select a plan to recharge."
            type="error"
            onRetry={handleBack}
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button onClick={handleBack} variant="secondary">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet', icon: '💳', desc: 'Pay from your wallet balance' },
    { id: 'razorpay', name: 'Razorpay', icon: '💳', desc: 'Pay using UPI, Card, Net Banking via Razorpay' },
  ];

  return (
    <div className="payment-page">
      {/* Header */}
      <div className="payment-header">
        <div>
          <h1>Complete Payment</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <div className="security-badge">🔒 Secure Payment</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="payment-container">
        <div className="payment-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-card">
              {/* Operator Info */}
              <div className="operator-info">
                <div className="operator-logo">
                  {operatorName.charAt(0).toUpperCase()}
                </div>
                <div className="operator-details">
                  <h3>{operatorName}</h3>
                  <div className="text-sm">Mobile Recharge</div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="plan-details">
                <div className="plan-amount">₹{amount.toFixed(2)}</div>
                <div className="plan-info">
                  {rechargeDetails.validity && (
                    <div>Validity: {rechargeDetails.validity}</div>
                  )}
                  {rechargeDetails.data && (
                    <div>Data: {rechargeDetails.data}</div>
                  )}
                  {rechargeDetails.calls && (
                    <div>Calls: {rechargeDetails.calls}</div>
                  )}
                  {rechargeDetails.description && (
                    <div>{rechargeDetails.description}</div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Recharge Amount</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Processing Fee</span>
                  <span>₹0.00</span>
                </div>
                <div className="breakdown-total">
                  <span>Total Amount</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <h2>Payment Details</h2>

            {/* Error Display */}
            {error && (
              <ErrorMessage
                message={error}
                type="error"
                onDismiss={() => setError(null)}
                onRetry={handlePayment}
              />
            )}

            {/* Mobile Number Input */}
            <div className="payment-form">
              <h3>Mobile Number</h3>
              <div className="form-group">
                <label htmlFor="mobileNumber">Enter 10-digit mobile number</label>
                <input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  disabled={isProcessing}
                  className="form-input"
                />
                <small>This number will be recharged</small>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Select Payment Method</h3>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => !isProcessing && setSelectedPaymentMethod(method.id)}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <div>{method.name}</div>
                    <div className="method-desc">{method.desc}</div>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Pay Section */}
            <div className="pay-section">
              <button
                className="pay-btn"
                onClick={handlePayment}
                disabled={isProcessing || !mobileNumber || mobileNumber.length !== 10}
              >
                {isProcessing ? (
                  <span className="processing">
                    <span className="spinner"></span>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${amount.toFixed(2)}`
                )}
              </button>

              <div className="security-note">
                <p>Your payment is secured with 256-bit SSL encryption</p>
                <p>We never store your card details</p>
                <p>Instant recharge confirmation via SMS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="payment-footer">
        <p><strong>Need Help?</strong> Contact support at support@topitup.com</p>
        <p>All transactions are secure and encrypted</p>
      </div>
    </div>
  );
}
