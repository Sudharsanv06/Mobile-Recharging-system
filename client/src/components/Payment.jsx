import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, LoadingSpinner } from "./common";
import "./Payment.css";
import MobileVerification from "./MobileVerification";
import { toast } from "../utils/toast";

const Payment = ({ isAuthenticated, currentUser, rechargeDetails: propRechargeDetails }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const rechargeDetails = propRechargeDetails || location.state || {
    amount: "239",
    mobileNumber: "1111111111",
    operator: "Jio",
    validity: "28 days",
    data: "2GB/day",
    calls: "Unlimited",
    sms: "100/day",
    email: "user@example.com",
  };

  const [selectedPayment, setSelectedPayment] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [showNetBankingForm, setShowNetBankingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedOtherUPI, setSelectedOtherUPI] = useState("");

  const [netBankingDetails, setNetBankingDetails] = useState({
    username: "",
    password: "",
    transactionPassword: "",
  });

  const [showVerification, setShowVerification] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verifiedMobileNumber, setVerifiedMobileNumber] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const paymentMethods = [
    { id: "gpay", name: "Google Pay", icon: "GPay", type: "upi", popular: true, upiDomain: "okicici" },
    { id: "phonepe", name: "PhonePe", icon: "PhonePe", type: "upi", popular: true, upiDomain: "ybl" },
    { id: "paytm", name: "Paytm", icon: "Paytm", type: "upi", popular: true, upiDomain: "paytm" },
    { id: "upi", name: "Other UPI Apps", icon: "UPI", type: "other_upi" },
    { id: "card", name: "Credit/Debit Card", icon: "Card", type: "card" },
    { id: "netbanking", name: "Net Banking", icon: "Bank", type: "netbanking" },
  ];

  const otherUPIApps = [
    { id: "flipkart", name: "Flipkart UPI", icon: "Flipkart", upiDomain: "flipkart" },
    { id: "amazon", name: "Amazon Pay UPI", icon: "Amazon", upiDomain: "amazonpay" },
    { id: "supermoney", name: "SuperMoney UPI", icon: "Super", upiDomain: "super" },
  ];

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
  ];

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method.id);
    setShowCardForm(false);
    setShowUPIForm(false);
    setShowNetBankingForm(false);
    setSelectedOtherUPI("");
    setUpiId("");

    if (method.type === "card") setShowCardForm(true);
    if (method.type === "upi") setShowUPIForm(true);
    if (method.type === "other_upi") setShowUPIForm(true);
    if (method.type === "netbanking") setShowNetBankingForm(true);
  };

  const validateForm = () => {
    if (!selectedPayment) {
      toast.warning("Please select a payment method");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('You must be logged in to complete payment.');
        navigate('/login');
        return;
      }
      
      const res = await fetch("http://localhost:5000/api/v1/recharges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operatorId: rechargeDetails.operatorId,
          mobileNumber: rechargeDetails.mobileNumber,
          planId: rechargeDetails.planId,
          amount: parseInt(rechargeDetails.amount),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error('Failed to parse JSON response', e);
        toast.error('Unexpected server response');
        return;
      }

      if (!res.ok) {
        const serverMsg = data?.message || data?.msg || 'Recharge failed';
        console.error('Recharge error response:', data);
        toast.error(serverMsg);
        return;
      }

      // Success
      const resp = data;
      const message = resp?.message || resp?.msg || 'Payment successful';
      const txn = resp?.data?.transactionId || '';
      toast.success(txn ? `${message} — Txn: ${txn}` : message);
      navigate('/receipt', { state: { recharge: resp.data } });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationClose = () => setShowVerification(false);
  const handleVerificationComplete = (num) => {
    setIsMobileVerified(true);
    setVerifiedMobileNumber(num);
    setShowVerification(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="payment-page">

      <div className="payment-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Complete Payment</h1>
        <div className="security-badge">Secure</div>
      </div>

      <div className="payment-container">
        <div className="payment-content">

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-card">

              <div className="operator-info">
                <div className="operator-logo">{rechargeDetails.operator}</div>

                <div className="operator-details">
                  <h3>{rechargeDetails.operator}</h3>
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
                  <div>Validity: {rechargeDetails.validity}</div>
                  <div>Data: {rechargeDetails.data}</div>
                  <div>Calls: {rechargeDetails.calls}</div>
                  <div>SMS: {rechargeDetails.sms}</div>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Plan Amount</span>
                  <span>₹{rechargeDetails.amount}</span>
                </div>

                <div className="breakdown-total">
                  <span>Total Amount</span>
                  <span>₹{rechargeDetails.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="payment-section">
            <h2>Choose Payment Method</h2>

            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method)}
                  className={`payment-method ${
                    selectedPayment === method.id ? "selected" : ""
                  }`}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <div>{method.name}</div>
                    <div className="method-desc">{method.description}</div>
                  </div>
                  {selectedPayment === method.id && (
                    <div className="selected-indicator">✓</div>
                  )}
                </button>
              ))}
            </div>

            {selectedPayment && (
              <div className="pay-section">
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isProcessing}
                  disabled={isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? 'Processing Payment...' : `Pay ₹${rechargeDetails.amount}`}
                </Button>

                <div className="security-note">
                  <p>🔒 Your payment is secured with SSL encryption</p>
                  <p>💳 Amount will be debited only after successful recharge</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="payment-footer">
        <p>
          Need help? Contact us at <strong>support@recharge.com</strong> or call{" "}
          <strong>1800-123-4567</strong>
        </p>
        <p>Copyright 2023 Recharge.com</p>
      </div>

      {showVerification && (
        <MobileVerification
          onClose={handleVerificationClose}
          onVerified={handleVerificationComplete}
        />
      )}
    </div>
  );
};

export default Payment;
