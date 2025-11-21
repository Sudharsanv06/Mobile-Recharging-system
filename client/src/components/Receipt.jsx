import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recharge = location.state?.recharge || null;

  if (!recharge) {
    return (
      <div className="receipt-page">
        <h2>No receipt available</h2>
        <p>No recharge information was provided.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const date = new Date(recharge.createdAt).toLocaleString();

  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <h2>Recharge Receipt</h2>
        <div className="receipt-row"><strong>Transaction ID:</strong> {recharge.transactionId}</div>
        <div className="receipt-row"><strong>Amount:</strong> ₹{recharge.amount}</div>
        <div className="receipt-row"><strong>Operator:</strong> {recharge.operator}</div>
        <div className="receipt-row"><strong>Mobile Number:</strong> {recharge.mobileNumber}</div>
        <div className="receipt-row"><strong>Status:</strong> {recharge.status}</div>
        <div className="receipt-row"><strong>Date:</strong> {date}</div>
        <div className="receipt-actions">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={() => navigate('/')}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
