import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recharge = location.state?.recharge || null;

  useEffect(() => {
    // If no recharge provided, try reading pendingRecharge from localStorage
    if (!recharge) {
      try {
        const pending = JSON.parse(localStorage.getItem('pendingRecharge') || 'null');
        if (pending && pending.transactionId) {
          // nothing — used if route was opened directly with localStorage
        }
      } catch (e) {
        // ignore
      }
    }

    // Emit a balance update event to allow other parts to refresh
    if (recharge && typeof window !== 'undefined') {
      try {
        const newBalance = recharge.newBalance || null; // optional
        window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { newBalance, recharge } }));
      } catch (e) {
        // ignore
      }
    }
  }, [recharge]);

  if (!recharge) {
    return (
      <div className="success-page">
        <div className="success-card">
          <h2>Payment Completed</h2>
          <p>We've completed the payment, but couldn't find the transaction details.</p>
          <div className="success-actions">
            <button onClick={() => navigate('/')}>Go Home</button>
            <button onClick={() => navigate('/history')}>View History</button>
          </div>
        </div>
      </div>
    );
  }

  const when = recharge.createdAt ? new Date(recharge.createdAt).toLocaleString() : '';

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2 className="success-title">Recharge Successful</h2>
        <p className="success-sub">Your recharge was processed successfully.</p>

        <div className="success-details">
          <div><strong>Transaction:</strong> {recharge.transactionId || recharge.txnId || '—'}</div>
          <div><strong>Amount:</strong> ₹{recharge.amount}</div>
          <div><strong>Operator:</strong> {recharge.operator}</div>
          <div><strong>Mobile:</strong> {recharge.mobileNumber}</div>
          {when && <div><strong>Date:</strong> {when}</div>}
        </div>

        <div className="success-actions">
          <button onClick={() => navigate('/receipt', { state: { recharge } })}>View Receipt</button>
          <button onClick={() => navigate('/')}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default Success;
