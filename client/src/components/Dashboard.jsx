import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './Dashboard.css';
import WalletModal from './WalletModal';
import api from '../utils/api';
import LoadingSkeleton from './LoadingSkeleton';
import RetryFallback from './RetryFallback';
import { getStatusClass, getStatusText, getStatusIcon } from '../utils/statusHelper';

const Dashboard = ({ onOpenWallet }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const [refreshKey, setRefreshKey] = useState(0);

  // Currency formatter with memoization
  const currencyFormatter = useMemo(() => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }), 
  []);

  // Memoized sparkline data
  const amountsForChart = useMemo(() => 
    recharges.slice(0, 6).map(r => r.amount).reverse(), 
    [recharges]
  );

  // Stable callback for balance updates
  const handleBalanceUpdate = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  // Image error fallback handler
  const handleImageError = (e) => {
    e.currentTarget.src = '/op-placeholder.svg';
  };

  useEffect(() => {
    if (!token) return;
    
    const controller = new AbortController();
    
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [pRes, sRes, rRes] = await Promise.all([
          api.get('/api/v1/users/profile', { signal: controller.signal }),
          api.get('/api/v1/users/stats', { signal: controller.signal }),
          api.get('/api/v1/users/recharges', { signal: controller.signal })
        ]);

        const pData = pRes?.data?.data || pRes?.data || null;
        const sData = sRes?.data?.data || sRes?.data || null;
        const rData = rRes?.data?.data || rRes?.data || [];
        
        if (pData) setProfile(pData);
        if (sData) setStats(sData);
        if (rData) setRecharges(Array.isArray(rData) ? rData.slice(0, 10) : []);
      } catch (err) {
        // Ignore AbortError when component unmounts
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        
        console.error('Dashboard fetch failed', err);
        const errorMessage = err.response?.data?.message 
          || err.message 
          || 'Unable to load dashboard data';
        setError(errorMessage);
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    fetchAll();

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    
    return () => {
      controller.abort();
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
    };
  }, [token, refreshKey, handleBalanceUpdate]);

  const retry = () => {
    setError('');
    setRetrying(true);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="user-block">
          <div className="avatar" aria-label="User avatar">
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{profile?.name || 'User'}</div>
            <div className="user-phone">{profile?.phone || ''}</div>
          </div>
        </div>
        <div className="wallet-block">
          <div className="wallet-balance-label">Wallet Balance</div>
          <div className="wallet-balance" aria-live="polite" aria-atomic="true">
            {currencyFormatter.format(stats?.balance ?? profile?.balance ?? 0)}
          </div>
          <button 
            className="add-money-btn" 
            onClick={() => { 
              setShowWallet(true); 
              onOpenWallet && onOpenWallet(); 
            }}
            aria-label="Add money to wallet"
          >
            Add Money
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ padding: 24 }}>
          <RetryFallback message={error} onRetry={retry} disabled={retrying} />
        </div>
      ) : loading ? (
        <div className="dashboard-cards">
          <LoadingSkeleton rows={1} height={100} />
          <LoadingSkeleton rows={1} height={100} />
          <LoadingSkeleton rows={1} height={100} />
        </div>
      ) : (
      <div className="dashboard-cards" aria-live="polite">
        <div className="card">
          <div className="card-title">Total Recharges</div>
          <div className="card-value">{stats?.totalRecharges ?? 0}</div>
        </div>
        <div className="card">
          <div className="card-title">Amount Spent</div>
          <div className="card-value">{currencyFormatter.format(stats?.totalSpent ?? 0)}</div>
        </div>
        <div className="card chart-card">
          <div className="card-title">Recent Activity</div>
          <div className="chart">
            {amountsForChart.length ? (
              <svg viewBox="0 0 120 40" className="sparkline" aria-label="Recent recharge activity chart">
                {amountsForChart.map((amt, i) => {
                  const max = Math.max(...amountsForChart, 1);
                  const h = (amt / max) * 30;
                  const x = 5 + i * 18;
                  const y = 35 - h;
                  return <rect key={i} x={x} y={y} width="10" height={h} rx="2" fill="currentColor" />;
                })}
              </svg>
            ) : (
              <div className="no-data">No recent recharges</div>
            )}
          </div>
        </div>
      </div>
      )}

      <div className="recent-list">
        <h3>Latest Recharges</h3>
        {loading ? (
          <LoadingSkeleton rows={6} height={56} />
        ) : recharges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <p className="empty-message">No recharges yet</p>
            <p className="empty-submessage">Your recharge history will appear here</p>
          </div>
        ) : (
          <>
            <ul>
              {recharges.map((r) => (
                <li key={r._id} className="recent-item">
                  <img 
                    src={r.operator?.logo || '/op-placeholder.svg'} 
                    alt={r.operator?.name || 'Operator'} 
                    className="op-logo"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="item-info">
                    <div className="amount">{currencyFormatter.format(r.amount)}</div>
                    <div className="meta">
                      {r.operator?.name || 'Unknown'} • {new Date(r.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div 
                    className={`status ${getStatusClass(r.status)}`}
                    role="status"
                    aria-label={`Status: ${getStatusText(r.status)}`}
                  >
                    <span className="status-icon" aria-hidden="true">{getStatusIcon(r.status)}</span>
                    <span className="status-text">{getStatusText(r.status)}</span>
                  </div>
                </li>
              ))}
            </ul>
            {recharges.length >= 10 && (
              <div className="view-all-container">
                <button 
                  className="view-all-btn"
                  onClick={() => {/* Navigate to full history */}}
                  aria-label="View all recharges"
                >
                  View All Recharges →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showWallet && (
        <WalletModal onClose={() => { setShowWallet(false); }} />
      )}
    </div>
  );
};

export default Dashboard;