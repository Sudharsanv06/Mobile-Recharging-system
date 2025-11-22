import React, { useEffect, useState } from 'react';
import './RechargeHistory.css';

const RechargeHistory = () => {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/v1/users/recharges', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setRecharges(data);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [token]);

  return (
    <div className="history-page">
      <h2>Recharge History</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RechargeHistory;
