import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSkeleton from './LoadingSkeleton';
import './RechargeHistory.css';
import { toast } from '../utils/toast';

const RechargeHistory = () => {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repeatLoading, setRepeatLoading] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Currency formatter
  const currencyFormatter = useMemo(() => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }), 
  []);

  // Status class normalizer
  const getStatusClass = useCallback((status) => {
    if (!status) return 'unknown';
    const key = status.toLowerCase().trim();
    if (key.includes('success') || key.includes('paid') || key.includes('completed')) return 'success';
    if (key.includes('fail') || key.includes('error') || key.includes('declined')) return 'failed';
    if (key.includes('pending') || key.includes('processing')) return 'pending';
    return 'unknown';
  }, []);

  // Image error handler
  const handleImageError = useCallback((e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/op-placeholder.svg';
  }, []);

  const fetchList = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/v1/users/recharges', { signal });
      const data = res?.data?.data || res?.data || [];
      setRecharges(data);
    } catch (err) {
      // Ignore AbortError when component unmounts
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      
      console.error('fetch recharges error', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unable to load recharge history';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchList(controller.signal);
    return () => controller.abort();
  }, [fetchList]);

  const handleRepeat = (r) => {
    if (!r.operator || !r.amount) {
      toast.error('Missing recharge information');
      return;
    }
    
    setRepeatLoading(r._id);
    try {
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
      toast.success('Repeating recharge...');
      navigate('/payment', { state: details });
    } catch (err) {
      toast.error('Failed to repeat recharge');
      setRepeatLoading(null);
    }
  };

  const handleRefresh = () => {
    const controller = new AbortController();
    fetchList(controller.signal);
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
        <button 
          className="refresh-btn" 
          onClick={handleRefresh}
          aria-label="Refresh recharge history"
          disabled={loading}
        >
          🔄 {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRefresh} aria-label="Retry loading history">Retry</button>
          <a href="mailto:support@example.com" className="support-link">Contact Support</a>
        </div>
      )}

      {!error && (
        <div className="history-list" role="list" aria-live="polite">
          {recharges.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📱</div>
              <p className="empty-message">No recharges yet</p>
              <button 
                className="start-recharge-btn" 
                onClick={() => navigate('/')}
                aria-label="Make your first recharge"
              >
                Make Your First Recharge
              </button>
            </div>
          )}
          {recharges.map((r) => (
            <div className="history-item" key={r._id} role="listitem">
              <div className="left">
                <img 
                  src={r.operator?.logo || '/op-placeholder.svg'} 
                  alt={r.operator?.name || 'Operator'} 
                  className="logo"
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="info">
                  <div className="operator-name">{r.operator?.name || 'Unknown Operator'}</div>
                  <div className="when">
                    {new Date(r.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="mobile-number">{r.mobileNumber || r.to || ''}</div>
                </div>
              </div>
              <div className="right">
                <div className="amount">{currencyFormatter.format(r.amount)}</div>
                {r.validity && <div className="validity">Validity: {r.validity}</div>}
                {r.data && <div className="data-info">Data: {r.data}</div>}
                <div className="payment">{r.paymentMethod || 'Wallet'}</div>
                <div 
                  className={`badge ${getStatusClass(r.status)}`}
                  role="status"
                  aria-label={`Status: ${r.status || 'Unknown'}`}
                >
                  {r.status || 'Unknown'}
                </div>
                <div className="actions">
                  <button 
                    className="repeat-btn" 
                    onClick={() => handleRepeat(r)}
                    disabled={repeatLoading === r._id}
                    aria-label={`Repeat recharge for ${r.operator?.name || 'operator'}`}
                  >
                    {repeatLoading === r._id ? 'Loading...' : 'Repeat Recharge'}
                  </button>
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
