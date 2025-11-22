import React, { useState } from 'react';
import './WalletModal.css';

const WalletModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return alert('Enter a valid amount');
    setLoading(true);
    try {
      // mock payment delay
      await new Promise((res) => setTimeout(res, 900));
      const res = await fetch('http://localhost:5000/api/v1/users/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: val })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      // Update local user cache
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.balance = data.balance;
      localStorage.setItem('user', JSON.stringify(user));
      // notify parent by firing storage event (useful in simple SPA)
      window.dispatchEvent(new Event('balanceUpdated'));
      onClose();
    } catch (err) {
      alert('Payment failed — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-overlay">
      <div className="wallet-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Add Money</h3>
        <p className="sub">Enter amount to add to your wallet</p>
        <form onSubmit={handleSubmit} className="wallet-form">
          <input type="number" min="1" step="0.5" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="pay-btn" type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay ₹' + (amount || '')}</button>
        </form>
      </div>
    </div>
  );
};

export default WalletModal;
