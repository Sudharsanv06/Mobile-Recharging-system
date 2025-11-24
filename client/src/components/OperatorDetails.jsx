import React, { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OperatorDetails.css';

export default function OperatorDetails() {
  const { operatorId } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchOp = async () => {
      try {
        // Try direct fetch by id/slug first
        const res = await api.get(`/api/v1/operators/${operatorId}`);
        if (mounted) {
          setTimeout(() => {
            setOperator(res.data.data || res.data);
            setLoading(false);
          }, 250);
        }
        return;
      } catch (err) {
        console.warn('Direct operator fetch failed, trying list fallback', err && err.message);
      }

      // Fallback: fetch list and try to find operator by name or id
      try {
        const listRes = await api.get('/api/v1/operators');
        const list = listRes.data?.data || listRes.data || [];
        const match = list.find(op => {
          if (!op) return false;
          const idMatch = ('' + (op._id || op.id || '')).toLowerCase() === ('' + operatorId).toLowerCase();
          const nameMatch = (op.name || '').toLowerCase() === ('' + operatorId).toLowerCase();
          const slugMatch = ((op.slug || '')).toLowerCase() === ('' + operatorId).toLowerCase();
          return idMatch || nameMatch || slugMatch;
        });

        if (match) {
          if (mounted) {
            setOperator(match);
            setLoading(false);
          }
          return;
        }

        // As a last resort, if list has at least one operator and operatorId looks like a name, try fuzzy match
        const fuzzy = list.find(op => (op.name || '').toLowerCase().includes(('' + operatorId).toLowerCase()));
        if (fuzzy && mounted) {
          setOperator(fuzzy);
          setLoading(false);
          return;
        }

        if (mounted) {
          setError('Unable to load operator plans. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Operator list fallback failed', err);
        if (mounted) {
          setError('Unable to load operator plans. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchOp();
    return () => { mounted = false; };
  }, [operatorId]);

  // brand classes to make operator header look custom
  const brandClass = useMemo(() => {
    const name = (operator?.name || '').toLowerCase();
    if (name.includes('airtel')) return 'brand-airtel';
    if (name.includes('jio')) return 'brand-jio';
    if (name.includes('vi') || name.includes('vodafone') || name.includes('idea')) return 'brand-vi';
    if (name.includes('bsnl')) return 'brand-bsnl';
    return 'brand-default';
  }, [operator]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="operator-details-container">
        <div className="operator-details-content">
          <div className={`operator-header ${brandClass}`}>
            <div className="skeleton-description"></div>
            <div className="skeleton-amount"></div>
          </div>
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-plan-card">
                <div className="skeleton-header">
                  <div className="skeleton-description"></div>
                  <div className="skeleton-amount"></div>
                </div>
                <div className="skeleton-details">
                  <div className="skeleton-detail"></div>
                  <div className="skeleton-detail"></div>
                  <div className="skeleton-detail"></div>
                </div>
                <div className="skeleton-button"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not found or error state
  if (!operator || error) {
    return (
      <div className="operator-details-container">
        <div className="operator-details-content">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="empty-state">
              <div className="empty-state-icon">{error ? '⚠️' : '😕'}</div>
              <h2 className="empty-state-title">{error ? 'Oops — Problem loading' : 'Operator Not Found'}</h2>
              <p className="empty-state-text">{error || "We couldn't find the operator you're looking for."}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
                <Link to="/operators" className="back-link">Back to operators</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plans = operator.plans || [];

  // derived groups
  const recommended = plans.slice(0, 6);
  const unlimited = plans.filter(p => p.description?.toLowerCase().includes('unlimited'));
  const dataPacks = plans.filter(p => !!p.data && !p.description?.toLowerCase().includes('unlimited'));
  const voicePacks = plans.filter(p => p.calls && !p.data);

  // search + filter helper
  const filterAndSearch = (list) => list.filter(p => {
    if (!p) return false;
    if (filterType !== 'all' && (p.type || '').toLowerCase() !== filterType) return false;
    if (searchTerm) {
      const hay = `${p.description || ''} ${p.data || ''} ${p.calls || ''} ${p.amount}`.toLowerCase();
      if (!hay.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  const renderPlans = (plansList, emptyMessage = 'No plans available') => {
    const visible = filterAndSearch(plansList);
    if (!visible.length) {
      return (
        <div className="empty-state small">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-text">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="plans-grid">
        {visible.map(p => {
          const id = p.planId || p._id || `${p.amount}-${p.validity}`;
          const tag = (p.description || '').toLowerCase().includes('unlimited') ? 'unlimited'
            : (p.entertainment || p.addons || '').toString().toLowerCase().includes('entertain') ? 'entertainment'
            : (p.data ? 'data' : (p.calls ? 'voice' : 'other'));

          return (
            <div key={id} className={`plan-card plan-${tag}`}>
              <div className="plan-header">
                <div className="plan-description">{p.description || 'Plan Details'}</div>
                <div className="plan-amount">₹{p.amount}</div>
              </div>
              <div className="plan-tags">
                <span className={`plan-badge badge-${tag}`}>{tag.toUpperCase()}</span>
                {p.validity && <span className="plan-badge badge-valid">{p.validity}</span>}
              </div>
              <div className="plan-details">
                {p.data && <div className="plan-detail-item">{p.data} Data</div>}
                {p.calls && <div className="plan-detail-item">{p.calls} Calls</div>}
                {p.sms && <div className="plan-detail-item">{p.sms} SMS</div>}
              </div>
              <div className="plan-action">
                <button
                  className="recharge-button"
                  onClick={() => {
                    const pending = {
                      operatorId: operator._id || operatorId,
                      operator: operator.name,
                      planId: id,
                      amount: p.amount,
                      mobileNumber: '',
                      validity: p.validity || '',
                      data: p.data || '',
                      calls: p.calls || '',
                      sms: p.sms || '',
                      description: p.description || '',
                    };
                    try { localStorage.setItem('pendingRecharge', JSON.stringify(pending)); } catch (e) { }
                    navigate('/payment', { state: pending });
                  }}
                >
                  Recharge Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="operator-details-container">
      <div className="operator-details-content">
        {/* Header */}
        <div className={`operator-header ${brandClass}`}>
          <div className="operator-title-section">
            <div className="operator-logo">{operator.logo || operator.name?.[0]}</div>
            <div>
              <h1 className="operator-details-title">{operator.name}</h1>
              <p className="operator-sub">Select a plan and recharge instantly</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="search-wrap">
              <input
                type="search"
                placeholder="Search plans, data, validity or amount"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="plan-search"
                aria-label="search-plans"
              />
            </div>

            <div className="select-row">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
                aria-label="plan-type"
              >
                <option value="all">All Types</option>
                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
                <option value="data">Data</option>
                <option value="voice">Voice</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="plan-tabs">
          <button
            className={`tab-pill ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => handleTabChange('recommended')}
          >
            ⭐ Recommended
          </button>
          <button
            className={`tab-pill ${activeTab === 'unlimited' ? 'active' : ''}`}
            onClick={() => handleTabChange('unlimited')}
          >
            ♾️ Unlimited
          </button>
          <button
            className={`tab-pill ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => handleTabChange('data')}
          >
            📶 Data Packs
          </button>
          <button
            className={`tab-pill ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => handleTabChange('voice')}
          >
            📞 Voice Packs
          </button>
          <button
            className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            📋 All Plans
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'recommended' && (
          <div className="plans-section">
            <h2 className="section-title">Recommended Plans</h2>
            {renderPlans(recommended, 'No recommended plans available')}
          </div>
        )}

        {activeTab === 'unlimited' && (
          <div className="plans-section">
            <h2 className="section-title">Unlimited Plans</h2>
            {renderPlans(unlimited, 'No unlimited plans available')}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="plans-section">
            <h2 className="section-title">Data Packs</h2>
            {renderPlans(dataPacks, 'No data packs available')}
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="plans-section">
            <h2 className="section-title">Voice Packs</h2>
            {renderPlans(voicePacks, 'No voice packs available')}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="plans-section">
            <h2 className="section-title">All Plans</h2>
            {renderPlans(plans, 'No plans available')}
          </div>
        )}

        {/* Back Link */}
        <Link to="/operators" className="back-link">
          Back to operators
        </Link>
      </div>
    </div>
  );
}
