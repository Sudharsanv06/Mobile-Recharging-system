import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';
import MobileVerification from './MobileVerification';
import axios from 'axios';


const Payment = ({ isAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get recharge details from location state or URL params
  const rechargeDetails = location.state || {
    amount: '239',
    mobileNumber: '1111111111',
    operator: 'Jio',
    validity: '28 days',
    data: '2GB/day',
    calls: 'Unlimited',
    sms: '100/day',
    email: 'user@example.com'
  };

  const [selectedPayment, setSelectedPayment] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [showNetBankingForm, setShowNetBankingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedOtherUPI, setSelectedOtherUPI] = useState('');
  const [netBankingDetails, setNetBankingDetails] = useState({
    username: '',
    password: '',
    transactionPassword: ''
  });
  
  // Mobile verification states
  const [showVerification, setShowVerification] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verifiedMobileNumber, setVerifiedMobileNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const paymentMethods = [
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: '🔗',
      description: 'Quick & secure UPI payment',
      type: 'upi',
      popular: true,
      upiDomain: 'okicici'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '💜',
      description: 'Pay with PhonePe UPI',
      type: 'upi',
      popular: true,
      upiDomain: 'ybl'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: '🔵',
      description: 'Paytm wallet & UPI',
      type: 'upi',
      popular: true,
      upiDomain: 'paytm'
    },
    {
      id: 'upi',
      name: 'Other UPI Apps',
      icon: '📱',
      description: 'Flipkart, Amazon, SuperMoney',
      type: 'other_upi'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay, Amex',
      type: 'card'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported',
      type: 'netbanking'
    }
  ];

  const otherUPIApps = [
    { id: 'flipkart', name: 'Flipkart UPI', icon: '🛒', upiDomain: 'flipkart' },
    { id: 'amazon', name: 'Amazon Pay UPI', icon: '🟠', upiDomain: 'amazonpay' },
    { id: 'supermoney', name: 'SuperMoney UPI', icon: '💰', upiDomain: 'super' }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
    'IDBI Bank', 'Indian Bank', 'Central Bank of India', 'Bank of India'
  ];

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method.id);
    
    setShowCardForm(false);
    setShowUPIForm(false);
    setShowNetBankingForm(false);
    setSelectedOtherUPI('');
    setUpiId('');
    
    if (method.type === 'card') {
      setShowCardForm(true);
    } else if (method.type === 'upi') {
      setShowUPIForm(true);
    } else if (method.type === 'other_upi') {
      setShowUPIForm(true);
    } else if (method.type === 'netbanking') {
      setShowNetBankingForm(true);
    }
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'number') {
      const formatted = value
        .replace(/\s+/g, '')
        .replace(/[^0-9]/gi, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      setCardDetails(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'expiry') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5);
      setCardDetails(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'cvv') {
      const formatted = value.replace(/\D/g, '').substr(0, 4);
      setCardDetails(prev => ({ ...prev, [field]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNetBankingChange = (field, value) => {
    setNetBankingDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return false;
    }

    if (selectedPayment === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.name.trim()) {
        alert('Please enter cardholder name');
        return false;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        alert('Please enter valid expiry date');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        alert('Please enter valid CVV');
        return false;
      }
    }

    if ((selectedPayment === 'gpay' || selectedPayment === 'phonepe' || selectedPayment === 'paytm' || selectedPayment === 'upi') && !upiId.trim()) {
      alert('Please enter your UPI ID');
      return false;
    }

    if (selectedPayment === 'netbanking') {
      if (!selectedBank) {
        alert('Please select your bank');
        return false;
      }
      if (!netBankingDetails.username.trim()) {
        alert('Please enter your net banking username');
        return false;
      }
      if (!netBankingDetails.password.trim()) {
        alert('Please enter your net banking password');
        return false;
      }
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const token = localStorage.getItem('token');
      const rechargeResponse = await fetch('http://localhost:5000/api/v1/recharges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          operatorId: rechargeDetails.operatorId,
          mobileNumber: rechargeDetails.mobileNumber,
          planId: rechargeDetails.planId,
          amount: parseInt(rechargeDetails.amount),
          plan: {
            amount: parseInt(rechargeDetails.amount),
            validity: rechargeDetails.validity,
            data: rechargeDetails.data,
            calls: rechargeDetails.calls,
            sms: rechargeDetails.sms,
            description: rechargeDetails.description || 'Recharge plan'
          }
        })
      });

      if (!rechargeResponse.ok) {
        const errorData = await rechargeResponse.json();
        alert(`Recharge failed: ${errorData.msg || 'Unknown error'}`);
              <button
                className="pay-btn"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="processing">
                    <div className="spinner"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <>{"Pay ₹" + rechargeDetails.amount}</>
                )}
              </button>

              <div className="security-note">
                <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
                <p>💡 Amount will be debited only after successful recharge</p>
              </div>
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleVerificationComplete = (phoneNumber) => {
    setIsMobileVerified(true);
    setVerifiedMobileNumber(phoneNumber);
    setShowVerification(false);
  };

  const handleVerificationClose = () => {
    setShowVerification(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Back
        </button>
        <h1>Complete Payment</h1>
        <div className="security-badge">🔒 Secure</div>
      </div>

      <div className="payment-container">
        <div className="payment-content">
          <div className="order-summary">
            <h2>📋 Order Summary</h2>
            <div className="summary-card">
              <div className="operator-info">
                <div className="operator-logo">
                  {rechargeDetails.operator === 'Airtel' && '🔴'}
                  {rechargeDetails.operator === 'Jio' && '🔵'}
                  {rechargeDetails.operator === 'BSNL' && '🟠'}
                  {rechargeDetails.operator === 'Vi' && '🟣'}
                </div>
                <div className="operator-details">
                  <h3>{rechargeDetails.operator}</h3>

                  {/* Replace free-text mobile entry with Select recipient button */}
                  <div className="mt-2">
                    <button className="px-3 py-2 border rounded">Select recipient</button>
                    <div className="text-sm text-gray-600 mt-2">Or choose saved recipient</div>
                    <div className="mt-2">Current: {rechargeDetails.mobileNumber}</div>
                  </div>
                </div>
              </div>
              
              <div className="plan-details">
                <div className="plan-amount">₹{rechargeDetails.amount}</div>
                <div className="plan-info">
                  <div className="info-item">
                    <span className="icon">📅</span>
                    <span className="label">Validity:</span>
                    <span className="value">{rechargeDetails.validity}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">📶</span>
                    <span className="label">Data:</span>
                    <span className="value">{rechargeDetails.data}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">📞</span>
                    <span className="label">Calls:</span>
                    <span className="value">{rechargeDetails.calls}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">💬</span>
                    <span className="label">SMS:</span>
                    <span className="value">{rechargeDetails.sms}</span>
                  </div>
                </div>
                
                {rechargeDetails.offer && (
                  <div className="offer-badge">
                    <span className="offer-icon">🎁</span>
                    <span className="offer-text">{rechargeDetails.offer}</span>
                  </div>
                )}
                
                {rechargeDetails.cashback && (
                  <div className="cashback-badge">
                    <span className="cashback-icon">💰</span>
                    <span className="cashback-text">Cashback: ₹{rechargeDetails.cashback}</span>
                  </div>
                )}
              </div>
              
              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Plan Amount</span>
                  <span>₹{rechargeDetails.amount}</span>
                </div>
                <div className="breakdown-item">
                  <span>Processing Fee</span>
                  <span>₹0</span>
                </div>
                {rechargeDetails.cashback && (
                  <div className="breakdown-item cashback">
                    <span>Cashback</span>
                    <span>-₹{rechargeDetails.cashback}</span>
                  </div>
                )}
                <div className="breakdown-total">
                  <span>Total Amount</span>
                  <span>₹{rechargeDetails.amount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="payment-section">
            <h2>💳 Choose Payment Method</h2>

            <div className="payment-methods">
            {paymentMethods.filter(method => method.popular).map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method)}
                className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <div className="method-name">{method.name}</div>
                  <div className="method-desc">{method.description}</div>
                </div>
                {selectedPayment === method.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </button>
            ))}
            {paymentMethods.filter(method => !method.popular).map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method)}
                className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <div className="method-name">{method.name}</div>
                  <div className="method-desc">{method.description}</div>
                </div>
                {selectedPayment === method.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </button>
            ))}
          </div>

            {showCardForm && (
            <div className="payment-form card-form">
              <h3>💳 Enter Card Details</h3>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardInputChange('number', e.target.value)}
                  maxLength="19"
                  className="p-2 border rounded text-black"
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Full name as on card"
                  value={cardDetails.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                  className="p-2 border rounded text-black"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    maxLength="5"
                    className="p-2 border rounded text-black"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      maxLength="4"
                      className="p-2 border rounded text-black"
                    />
                </div>
              </div>
              <div className="card-types">
                <img src="https://via.placeholder.com/40?text=VISA" alt="Visa" />
                <img src="https://via.placeholder.com/40?text=MC" alt="Mastercard" />
                <img src="https://via.placeholder.com/40?text=RP" alt="RuPay" />
                <img src="https://via.placeholder.com/40?text=AMEX" alt="American Express" />
              </div>
            </div>
          )}

            {showUPIForm && (
            <div className="payment-form upi-form">
              {selectedPayment === 'upi' ? (
                <>
                  <h3>📱 Select UPI App</h3>
                  <div className="other-upi-grid">
                    {otherUPIApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedOtherUPI(app.id)}
                        className={`other-upi-option ${selectedOtherUPI === app.id ? 'selected' : ''}`}
                      >
                        <div className="other-upi-icon">{app.icon}</div>
                        <div className="other-upi-name">{app.name}</div>
                        {selectedOtherUPI === app.id && <div className="check">✓</div>}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <h3>📱 {paymentMethods.find(m => m.id === selectedPayment)?.name} Payment</h3>
              )}

              {(selectedPayment === 'gpay' || selectedPayment === 'phonepe' || selectedPayment === 'paytm' || selectedOtherUPI) && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder={
                      selectedPayment === 'upi' 
                        ? `yourname@${otherUPIApps.find(a => a.id === selectedOtherUPI)?.upiDomain || 'upi'}`
                        : `yourname@${paymentMethods.find(m => m.id === selectedPayment)?.upiDomain || 'upi'}`
                    }
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="p-2 border rounded text-black"
                  />
                  <small>
                    {selectedPayment === 'upi'
                      ? `Enter your UPI ID for ${otherUPIApps.find(a => a.id === selectedOtherUPI)?.name || 'selected app'}`
                      : `Enter your UPI ID for ${paymentMethods.find(m => m.id === selectedPayment)?.name}`}
                  </small>
                </div>
              )}
            </div>
          )}

            {showNetBankingForm && (
            <div className="payment-form netbanking-form">
              <h3>🏦 Net Banking</h3>
              
              <div className="form-group">
                <label>Select Your Bank</label>
                <div className="banks-grid">
                  {banks.map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`bank-option ${selectedBank === bank ? 'selected' : ''}`}
                    >
                      {bank}
                      {selectedBank === bank && <span className="check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {selectedBank && (
                <>
                  <div className="form-group">
                    <label>Net Banking Username</label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={netBankingDetails.username}
                      onChange={(e) => handleNetBankingChange('username', e.target.value)}
                      className="p-2 border rounded text-black"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Net Banking Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={netBankingDetails.password}
                      onChange={(e) => handleNetBankingChange('password', e.target.value)}
                      className="p-2 border rounded text-black"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Transaction Password (if required)</label>
                    <input
                      type="password"
                      placeholder="Enter transaction password"
                      value={netBankingDetails.transactionPassword}
                      onChange={(e) => handleNetBankingChange('transactionPassword', e.target.value)}
                      className="p-2 border rounded text-black"
                    />
                    <small>Some banks require an additional transaction password</small>
                  </div>
                </>
              )}
            </div>
          )}

            {selectedPayment && (
            <div className="pay-section">
              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="processing">
                    <div className="spinner"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${rechargeDetails.amount}`
                )}
              </button>
              
              <div className="security-note">
                <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
                <p>💡 Amount will be debited only after successful recharge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-footer">
        <p>Need help? Contact us at <strong>support@recharge.com</strong> or call <strong>1800-123-4567</strong></p>
        <p>Copyright 2023 Recharge.com. All rights reserved.</p>
      </div>

      {showVerification && (
        <MobileVerification
          onClose={handleVerificationClose}
        />
      )}
    </div>
  );
};

export default Payment;