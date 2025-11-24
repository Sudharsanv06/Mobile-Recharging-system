import React, { useEffect, useMemo, useState, useRef } from 'react';
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

  const containerRef = useRef();

  useEffect(() => {
    loadProfile();
    // load first page
    loadHistory(1, filter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // when filter changes, reload history
    setPage(1);
    loadHistory(1, filter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/v1/users/profile');
      const data = res?.data?.data || res?.data || null;
      setUser(data);
    } catch (err) {
      console.error(err);
      setError('Could not load profile');
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (pageToLoad = 1, operator = 'All', replace = false) => {
    if (loadingMore) return;
    if (pageToLoad === 1) setLoadingMore(true);
    try {
      const q = new URLSearchParams();
      q.set('page', pageToLoad);
      q.set('limit', 10);
      if (operator && operator !== 'All') q.set('operator', operator);
      const res = await api.get(`/api/v1/users/recharges?${q.toString()}`);
      const json = res?.data || {};
      const items = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : (json.data || []));
      setHasMore((json.meta && json.meta.page < json.meta.pages) || items.length === 10);
      setHistory(prev => (replace ? items : [...prev, ...items]));
      setPage(pageToLoad);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load recharge history');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!hasMore) return;
    const next = page + 1;
    loadHistory(next, filter, false);
  };

  const stats = useMemo(() => {
    const total = history.length;
    const totalSpent = history.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const freq = {};
    history.forEach(r => { const op = r.operator || r.operatorName || 'Unknown'; freq[op] = (freq[op] || 0) + 1; });
    const mostUsed = Object.keys(freq).sort((a,b)=>freq[b]-freq[a])[0] || '—';
    return { total, totalSpent, mostUsed };
  }, [history]);

  const downloadPDF = async () => {
    const el = containerRef.current;
    if (!el) return toast.error('Nothing to export');
    // prefer html2pdf.js because it's simpler
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const filename = `profile-${(user?.name || 'user').replace(/\s+/g, '-')}.pdf`;
      await html2pdf().from(el).set({ filename }).save();
      return;
    } catch (err) {
      // if html2pdf not available, fall back to html2canvas + jspdf
      console.warn('html2pdf.js not available, falling back to html2canvas+jspdf', err);
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`profile-${user?.name || 'user'}.pdf`);
      return;
    } catch (err) {
      console.error(err);
      if (window.confirm('PDF export requires additional packages. Open print dialog as fallback?')) window.print();
    }
  };

  if (loading) return <div className="profile"><LoadingSpinner fullscreen text="Loading profile..." /></div>;
  if (error) return (
    <div className="profile">
      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <RetryFallback message={error} onRetry={loadProfile} />
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
            <div className="balance">₹{user?.balance ?? 0}</div>
            <div className="profile-actions-compact">
              <Button variant="primary" onClick={() => navigator.clipboard?.writeText(user?.email || '') || toast.info('Copied')}>Copy Email</Button>
              <Button variant="outline" onClick={downloadPDF}>Download PDF</Button>
            </div>
          </div>
        </div>

        <div className="profile-right">
          {!apiBase && (
            <div className="config-note">
              Backend API base not configured. Set `REACT_APP_API_BASE` in your `.env` (e.g. `REACT_APP_API_BASE=http://localhost:5000`) to enable full functionality.
            </div>
          )}
          <div className="stats-row">
            <StatsCard title="Total Recharges" value={stats.total} />
            <StatsCard title="Total Spent" value={`₹${stats.totalSpent}`} />
            <StatsCard title="Most Used" value={stats.mostUsed} />
          </div>

          <div className="history-section">
            <div className="history-header">
              <h3>Recharge History</h3>
              <div className="filters">
                <button className={`chip ${filter==='All'?'active':''}`} onClick={() => setFilter('All')}>All</button>
                {OPERATORS.map(op => (
                  <button key={op} className={`chip ${filter===op?'active':''}`} onClick={() => setFilter(op)}>{op}</button>
                ))}
              </div>
            </div>

            <div className="history-list">
              {history.length === 0 && <div className="empty">No recharges yet.</div>}
              {history.map(item => <HistoryCard key={item._id || item.id || Math.random()} item={item} />)}
            </div>

            <div className="history-footer">
              {hasMore ? (
                <Button variant="primary" onClick={loadMore} loading={loadingMore}>Load More</Button>
              ) : (
                <div className="end">End of history</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;