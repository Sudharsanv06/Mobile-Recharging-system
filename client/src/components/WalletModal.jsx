import React, { useState } from 'react';
import './WalletModal.css';
import api from '../utils/api';
import { z } from 'zod';
import { toast } from '../utils/toast';

const WalletModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schema = z.object({ amount: z.preprocess((v) => Number(v), z.number().positive('Enter an amount greater than 0')) });
    const parsed = schema.safeParse({ amount });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    const val = Number(amount);
    setLoading(true);
    try {
      // mock payment delay
      await new Promise((res) => setTimeout(res, 900));
      const res = await api.post('/api/v1/users/balance', { amount: val });
      const data = res?.data?.data || res?.data || {};
      // Update local user cache
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.balance = data.balance ?? user.balance;
      localStorage.setItem('user', JSON.stringify(user));
      // notify parent by firing storage event (useful in simple SPA)
      window.dispatchEvent(new Event('balanceUpdated'));
      onClose();
    } catch (err) {
      toast.error('Payment failed — try again');
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
