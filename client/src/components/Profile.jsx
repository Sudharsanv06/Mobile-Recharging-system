import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Button, LoadingSpinner } from './common';
import { toast } from '../utils/toast';
import RetryFallback from './RetryFallback';
import api from '../utils/api';
import HistoryCard from './common/HistoryCard';
import StatsCard from './common/StatsCard';
import './Profile.css';

const OPERATORS = ['Airtel', 'Jio', 'BSNL', 'Vi'];

const Profile = ({ currentUser }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('All');
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);

  const containerRef = useRef();

  // loadProfile memoized with AbortController support
  const loadProfile = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/v1/users/profile', { signal });
      const data = res?.data?.data || res?.data || null;
      setUser(data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error('loadProfile err', err);
      setError('Could not load profile');
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // loadHistory memoized safe with AbortController
  const loadHistory = useCallback(async (pageToLoad = 1, operator = 'All', replace = false, signal) => {
    if (loadingMore && !replace) return; // Prevent duplicate calls
    if (pageToLoad === 1) setLoadingMore(true);
    try {
      const q = new URLSearchParams();
      q.set('page', pageToLoad);
      q.set('limit', 10);
      if (operator && operator !== 'All') q.set('operator', operator);
      const res = await api.get(`/api/v1/users/recharges?${q.toString()}`, { signal });
      const json = res?.data ?? {};
      const items = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : (json.data || []));
      
      // Support meta paging if present, with safe guards
      const meta = json.meta || {};
      const more = (typeof meta.page === 'number' && typeof meta.pages === 'number')
        ? (meta.page < meta.pages)
        : (items.length === 10);
      
      setHasMore(more);
      setHistory(prev => (replace ? items : [...prev, ...items]));
      setPage(pageToLoad);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error('loadHistory err', err);
      toast.error('Failed to load recharge history');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  // Initial load + cleanup with AbortController
  useEffect(() => {
    const controller = new AbortController();
    loadProfile(controller.signal);
    loadHistory(1, filter, true, controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally only on mount

  // Reload when filter changes
  useEffect(() => {
    const controller = new AbortController();
    setPage(1);
    loadHistory(1, filter, true, controller.signal);
    return () => controller.abort();
  }, [filter, loadHistory]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    const controller = new AbortController();
    loadHistory(next, filter, false, controller.signal);
  };

  // Currency formatter instance
  const currencyFormatter = useMemo(() => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }), 
    []
  );

  const stats = useMemo(() => {
    const total = history.length;
    const totalSpent = history.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const freq = {};
    history.forEach(r => { 
      const op = (r.operator && (r.operator.name || r.operator)) || r.operatorName || 'Unknown'; 
      freq[op] = (freq[op] || 0) + 1; 
    });
    const mostUsed = Object.keys(freq).sort((a,b)=>freq[b]-freq[a])[0] || '—';
    return { total, totalSpent, mostUsed };
  }, [history]);

  const downloadPDF = async () => {
    const el = containerRef.current;
    if (!el) return toast.error('Nothing to export');
    setExporting(true);
    
    // Prefer html2pdf.js because it's simpler
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const filename = `profile-${(user?.name || 'user').replace(/\s+/g, '-')}.pdf`;
      await html2pdf().from(el).set({ filename }).save();
      setExporting(false);
      return;
    } catch (err) {
      console.warn('html2pdf not available, trying fallback', err);
    }

    // Fallback to html2canvas + jspdf
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`profile-${user?.name || 'user'}.pdf`);
      setExporting(false);
      return;
    } catch (err) {
      console.error('export fallback failed', err);
      setExporting(false);
      if (window.confirm('PDF export requires additional packages. Open print dialog as fallback?')) window.print();
    }
  };

  if (loading) return <div className="profile"><LoadingSpinner fullscreen text="Loading profile..." /></div>;
  if (error) return (
    <div className="profile">
      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <RetryFallback message={error} onRetry={() => {
          const c = new AbortController();
          loadProfile(c.signal);
        }} />
      </div>
    </div>
  );

  return (
    <div className="profile profile-premium" ref={containerRef}>
      <div className="profile-top">
        <div className="profile-left">
          <div className="profile-card">
            <div className="avatar-large">{(user?.name || currentUser || 'U').charAt(0).toUpperCase()}</div>
            <h2 className="user-name">{user?.name}</h2>
            <div className="user-meta">{user?.email} · {user?.phone}</div>
            <div className="joined">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
            <div className="balance">{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(user?.balance||0))}</div>
            <div className="profile-actions-compact">
              <Button variant="primary" onClick={() => {
                try {
                  navigator.clipboard?.writeText(user?.email || '');
                  toast.success('Copied email');
                } catch (e) {
                  toast.info('Copied (manual)');
                }
              }}>Copy Email</Button>

              <Button variant="secondary" onClick={() => window.location.href = '/topup'}>Top Up</Button>

              <Button variant="outline" onClick={downloadPDF} loading={exporting}>Export PDF</Button>

              <Button variant="ghost" onClick={() => toast.info('Edit profile coming soon')}>Edit</Button>
            </div>
          </div>
        </div>

        <div className="profile-right">
          {!api?.defaults?.baseURL && (
            <div className="config-note" role="alert" aria-live="polite">
              Backend API base not configured. Set `VITE_API_BASE` in your `.env` (e.g. `VITE_API_BASE=http://localhost:5000`) or start the backend at <code>http://localhost:5000</code> to enable full functionality.
            </div>
          )}
          <div className="stats-row">
            <StatsCard title="Total Recharges" value={stats.total} />
            <StatsCard title="Total Spent" value={currencyFormatter.format(stats.totalSpent)} />
            <StatsCard title="Most Used" value={stats.mostUsed} />
          </div>

          <div className="history-section">
            <div className="history-header">
              <h3>Recharge History</h3>
              <div className="filters" role="group" aria-label="Filter recharges by operator">
                <button 
                  className={`chip ${filter==='All'?'active':''}`} 
                  onClick={() => setFilter('All')}
                  disabled={loadingMore}
                  aria-pressed={filter === 'All'}
                >
                  All
                </button>
                {OPERATORS.map(op => (
                  <button 
                    key={op} 
                    className={`chip ${filter===op?'active':''}`} 
                    onClick={() => setFilter(op)}
                    disabled={loadingMore}
                    aria-pressed={filter === op}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="history-list" aria-live="polite">
              {history.length === 0 && !loading && (
                <div className="empty-state-history">
                  <div className="empty-icon">📱</div>
                  <p className="empty-message">No recharge history yet</p>
                  <p className="empty-submessage">Start your first mobile recharge now</p>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/'}
                    style={{ marginTop: '16px' }}
                  >
                    Make Your First Recharge
                  </Button>
                </div>
              )}
              {history.map(item => <HistoryCard key={item._id || item.id || `${item.createdAt}-${item.amount}`} item={item} />)}
            </div>

            <div className="history-footer" aria-live="polite">
              {hasMore ? (
                <Button 
                  variant="primary" 
                  onClick={loadMore} 
                  loading={loadingMore}
                  aria-label="Load more recharge history"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              ) : history.length > 0 ? (
                <div className="end" role="status">End of history</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;