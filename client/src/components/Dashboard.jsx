import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import WalletModal from './WalletModal';

const Dashboard = ({ onOpenWallet, balanceUpdated }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWallet, setShowWallet] = useState(false);

  const token = localStorage.getItem('token');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [pRes, sRes, rRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/users/profile', { headers }),
          fetch('http://localhost:5000/api/v1/users/stats', { headers }),
          fetch('http://localhost:5000/api/v1/users/recharges', { headers })
        ]);

        const [pData, sData, rData] = await Promise.all([pRes.json(), sRes.json(), rRes.json()]);
        if (pRes.ok) setProfile(pData);
        if (sRes.ok) setStats(sData);
        if (rRes.ok) setRecharges(rData.slice(0, 10));
      } catch (err) {
        // ignore - show empty
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    const onBalance = () => setRefreshKey(k => k + 1);
    window.addEventListener('balanceUpdated', onBalance);
    return () => window.removeEventListener('balanceUpdated', onBalance);
  }, [token, refreshKey, balanceUpdated]);

  const amountsForChart = recharges.slice(0, 6).map(r => r.amount).reverse();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="user-block">
          <div className="avatar">{profile?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div className="user-info">
            <div className="user-name">{profile?.name || 'User'}</div>
            <div className="user-phone">{profile?.phone || ''}</div>
          </div>
        </div>
        <div className="wallet-block">
          <div className="wallet-balance-label">Wallet Balance</div>
          <div className="wallet-balance">₹ {stats?.balance?.toFixed ? stats.balance.toFixed(2) : (profile?.balance || 0).toFixed(2)}</div>
          <button className="add-money-btn" onClick={() => { setShowWallet(true); onOpenWallet && onOpenWallet(); }}>Add Money</button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-title">Total Recharges</div>
          <div className="card-value">{stats?.totalRecharges ?? '-'}</div>
        </div>
        <div className="card">
          <div className="card-title">Amount Spent</div>
          <div className="card-value">₹ {stats?.totalSpent ?? 0}</div>
        </div>
        <div className="card chart-card">
          <div className="card-title">Recent Activity</div>
          <div className="chart">
            {amountsForChart.length ? (
              <svg viewBox="0 0 120 40" className="sparkline">
                {amountsForChart.map((amt, i) => {
                  const max = Math.max(...amountsForChart, 1);
                  const h = (amt / max) * 30;
                  const x = 5 + i * 18;
                  const y = 35 - h;
                  return <rect key={i} x={x} y={y} width="10" height={h} rx="2" fill="#2b9cff" />;
                })}
              </svg>
            ) : (
              <div className="no-data">No recent recharges</div>
            )}
          </div>
        </div>
      </div>

      <div className="recent-list">
        <h3>Latest Recharges</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ul>
            {recharges.map((r) => (
              <li key={r._id} className="recent-item">
                <img src={r.operator?.logo || ''} alt={r.operator?.name} className="op-logo" />
                <div className="item-info">
                  <div className="amount">₹ {r.amount}</div>
                  <div className="meta">{r.operator?.name} • {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div className={`status ${r.status?.toLowerCase()}`}>{r.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showWallet && (
        <WalletModal onClose={() => { setShowWallet(false); }} />
      )}
    </div>
  );
};

export default Dashboard;
