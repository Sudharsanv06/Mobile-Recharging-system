import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSkeleton from './LoadingSkeleton';
import './RechargeHistory.css';
import { toast } from '../utils/toast';

const RechargeHistory = () => {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/v1/users/recharges');
      const data = res?.data?.data || res?.data || [];
      setRecharges(data);
    } catch (err) {
      console.error('fetch recharges error', err);
      setError('Unable to load recharge history');
      toast.error('Unable to load recharge history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleRepeat = (r) => {
    // Prepare recharge details and navigate to payment page
    const details = {
      mobileNumber: r.mobileNumber || r.to || '',
      operator: r.operator?.name || r.operator,
      operatorId: r.operator?._id || r.operatorId,
      planId: r.planId,
      amount: r.amount,
      validity: r.validity,
      data: r.data
    };
    navigate('/payment', { state: details });
  };

  if (loading) return (
    <div className="history-page">
      <h2>Recharge History</h2>
      <LoadingSkeleton rows={4} height={64} />
    </div>
  );

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>Recharge History</h2>
        <button className="refresh-btn" onClick={fetchList}>🔄 Refresh</button>
      </div>

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchList}>Retry</button>
        </div>
      )}

      {!error && (
        <div className="history-list">
          {recharges.length === 0 && <div className="empty">No recharges yet</div>}
          {recharges.map((r) => (
            <div className="history-item" key={r._id}>
              <div className="left">
                <img src={r.operator?.logo} alt={r.operator?.name} className="logo" />
                <div className="info">
                  <div className="operator-name">{r.operator?.name}</div>
                  <div className="when">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="right">
                <div className="amount">₹ {r.amount}</div>
                <div className="validity">Validity: {r.validity || '—'}</div>
                <div className="payment">{r.paymentMethod || 'Wallet'}</div>
                <div className={`badge ${r.status?.toLowerCase()}`}>{r.status}</div>
                <div className="actions">
                  <button className="repeat-btn" onClick={() => handleRepeat(r)}>Repeat Recharge</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RechargeHistory;
