import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './OperatorDetails.css';

export default function OperatorDetails() {
  const { operatorId } = useParams();
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('prepaid');
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    let mounted = true;
    const fetchOp = async () => {
      try {
        const res = await axios.get(`/api/v1/operators/${operatorId}`);
        if (mounted) {
          // Simulate loading delay for better UX
          setTimeout(() => {
            setOperator(res.data.data || res.data);
            setLoading(false);
          }, 600);
        }
      } catch (err) {
        console.error('operator fetch error', err);
        if (mounted) setLoading(false);
      }
    };
    fetchOp();
    return () => { mounted = false; };
  }, [operatorId]);

  // Scroll to top when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="operator-details-container">
        <div className="operator-details-content">
          <div className="operator-header">
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

  // Not found state
  if (!operator) {
    return (
      <div className="operator-details-container">
        <div className="operator-details-content">
          <div className="empty-state">
            <div className="empty-state-icon">😕</div>
            <h2 className="empty-state-title">Operator Not Found</h2>
            <p className="empty-state-text">We couldn't find the operator you're looking for.</p>
            <Link to="/operators" className="back-link">Back to operators</Link>
          </div>
        </div>
      </div>
    );
  }

  const plans = operator.plans || [];
  const recommended = plans.slice(0, 6);
  const unlimited = plans.filter(p => p.description?.toLowerCase().includes('unlimited')).slice(0, 6);
  const dataPacks = plans.filter(p => p.data && !p.description?.toLowerCase().includes('unlimited')).slice(0, 6);
  const voicePacks = plans.filter(p => p.calls && !p.data).slice(0, 6);

  const renderPlans = (plansList, emptyMessage = 'No plans available') => {
    if (!plansList.length) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-text">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="plans-grid">
        {plansList.map(p => (
          <div key={p.planId || p._id} className="plan-card">
            <div className="plan-header">
              <div className="plan-description">{p.description || 'Plan Details'}</div>
              <div className="plan-amount">₹{p.amount}</div>
            </div>
            <div className="plan-details">
              {p.validity && <div className="plan-detail-item plan-validity">Valid for {p.validity}</div>}
              {p.data && <div className="plan-detail-item">{p.data} Data</div>}
              {p.calls && <div className="plan-detail-item">{p.calls} Voice</div>}
              {p.sms && <div className="plan-detail-item">{p.sms} SMS</div>}
            </div>
            <div className="plan-action">
              <button className="recharge-button">
                Recharge Now
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="operator-details-container">
      <div className="operator-details-content">
        {/* Header */}
        <div className="operator-header">
          <div className="operator-title-section">
            <h1 className="operator-details-title">{operator.name}</h1>
          </div>
          <div className="filter-section">
            <label className="filter-label" htmlFor="plan-type">Plan Type</label>
            <select
              id="plan-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
              aria-label="plan-type"
            >
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
              <option value="wifi">WiFi</option>
            </select>
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
