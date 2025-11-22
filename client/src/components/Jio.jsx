// Jio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Jio.css';
import './Operator.css';
import JioLogo from './reliance-jio-logo-1.svg';

const Jio = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fallback plans (sample packs)
  const fallbackPlans = {
    name: 'Jio',
    _id: 'jio-fallback',
    plans: [
      { _id: 'j-r1', amount: 129, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget monthly with adequate data' },
      { _id: 'j-r2', amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular value monthly' },
      { _id: 'j-r3', amount: 239, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity value' },
      { _id: 'j-u1', amount: 299, validity: '28 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Unlimited monthly' },
      { _id: 'j-u2', amount: 399, validity: '56 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited' },
      { _id: 'j-u3', amount: 499, validity: '84 days', data: 'Unlimited + OTT', calls: 'Unlimited', sms: '100/day', description: 'Unlimited with OTT' },
      { _id: 'j-e1', amount: 199, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment with OTT' },
      { _id: 'j-e2', amount: 499, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium OTT bundle' },
      { _id: 'j-e3', amount: 666, validity: '84 days', data: '3.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment package' },
      { _id: 'j-m1', amount: 155, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly pack' },
      { _id: 'j-m2', amount: 209, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly standard' },
      { _id: 'j-m3', amount: 259, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month value' },
      { _id: 'j-y1', amount: 899, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual pack with apps' },
      { _id: 'j-y2', amount: 1559, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly with OTT' },
      { _id: 'j-y3', amount: 2999, validity: '365 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate annual plan' },
      { _id: 'j-ro1', amount: 2875, validity: '30 days', data: '12GB roaming', calls: 'International', sms: '-', description: 'International roaming pack' },
      { _id: 'j-ro2', amount: 575, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Roaming-ready plan' },
      { _id: 'j-ro3', amount: 751, validity: '28 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium roaming bundle' },
      { _id: 'j-off1', amount: 99, validity: '14 days', data: '1GB/day', calls: '200 min/day', sms: '50/day', description: 'Welcome Offer' },
      { _id: 'j-off2', amount: 189, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Festive special offer' },
      { _id: 'j-off3', amount: 69, validity: '7 days', data: '1GB/day', calls: '100 min', sms: '50/day', description: 'Trial pack' }
    ]
  };

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOperator = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/v1/operators');
        const resJson = await res.json();
        const operators = resJson?.data || resJson;
        const found = Array.isArray(operators) ? operators.find(op => op.name === 'Jio') : null;
        setOperator(found || fallbackPlans);
      } catch (e) {
        setOperator(fallbackPlans);
      } finally { setLoading(false); }
    };
    fetchOperator();
  }, []);

  const categorizePlans = (plans) => {
    if (!plans) return {};
    const categorized = { recommended: [], unlimited: [], entertainment: [], monthly: [], yearly: [], roaming: [], special: [], all: plans };
    plans.forEach(plan => {
      const amt = Number(plan.amount); const desc = (plan.description||'').toLowerCase(); const dataStr = (plan.data||'').toLowerCase();
      if (plan._id && plan._id.includes('off')) categorized.special.push(plan);
      if ([129,155,179,239].includes(amt)) categorized.recommended.push(plan);
      if (desc.includes('unlimited') || dataStr.includes('unlimited')) categorized.unlimited.push(plan);
      if (desc.includes('ott') || desc.includes('entertain') || desc.includes('cinema') || (amt>=299 && amt<800)) categorized.entertainment.push(plan);
      if (amt<300 && plan.validity && (plan.validity.includes('28')||plan.validity.includes('56'))) categorized.monthly.push(plan);
      if (plan.validity && plan.validity.includes('365')) categorized.yearly.push(plan);
      if (desc.includes('roam') || desc.includes('international') || amt>=2000) categorized.roaming.push(plan);
    });
    return categorized;
  };

  const rechargePacks = operator ? categorizePlans(operator.plans) : {};
  const filteredPacks = rechargePacks[selectedCategory] ? rechargePacks[selectedCategory].filter(pack =>
    pack.amount.toString().includes(searchQuery) || (pack.description||'').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const displayCategories = ['recommended','unlimited','entertainment','monthly','yearly','roaming','special','all'];

  const handleRecharge = (pack) => {
    if (!mobileNumber) { alert('Please enter mobile number'); return; }
    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) { alert('Enter a valid 10-digit number'); return; }
    const rechargeDetails = { ...pack, mobileNumber, operator: 'Jio', operatorId: operator?._id, planId: pack._id };
    if (typeof onRechargeInitiate === 'function') onRechargeInitiate(rechargeDetails);
    navigate('/payment', { state: rechargeDetails });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="operator-page jio-page">
      <header className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img src={JioLogo} alt="Jio" />
            <div className="operator-meta">
              <div className="operator-title">Jio</div>
              <div className="operator-sub">Prepaid · JioFiber · Postpaid</div>
            </div>
          </div>

          <nav className="nav-menu" aria-label="Main menu">
            <button className="nav-btn">Offers</button>
            <button className="nav-btn">Plans</button>
            <button className="nav-btn">Help</button>
          </nav>

          <div className="profile-section">
            <div className="profile-icon">{currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}</div>
            <div className="profile-name">{currentUser || 'User'}</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="left-panel">
          <div className="mobile-input-section">
            <h3>Mobile number</h3>
            <div className="input-group">
              <div className="country-code">+91</div>
              <input
                className="mobile-input"
                type="tel"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                placeholder="Enter 10-digit mobile"
              />
            </div>
          </div>

          <div className="search-section">
            <h3>Search packs</h3>
            <div className="search-group">
              <input className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search amount or description" />
              <button className="search-btn">Search</button>
            </div>
          </div>
        </aside>

        <section className="right-panel">
          <div className="special-offers">
            <h4>Special Offers</h4>
            <div>
              {(rechargePacks.special || []).slice(0, 4).map(o => (
                <button key={o._id} className="offer-pill">₹{o.amount} · {o.description}</button>
              ))}
            </div>
          </div>

          <div className="pack-categories">
            {displayCategories.map(cat => (
              <button key={cat} className={selectedCategory === cat ? 'cat active' : 'cat'} onClick={() => setSelectedCategory(cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)} <span className="count">{(rechargePacks[cat] || []).length}</span>
              </button>
            ))}
          </div>

          <div className="packs-grid">
            {loading ? (
              <div className="loading">Loading plans…</div>
            ) : (
              filteredPacks.length === 0 ? (
                <div className="empty">No plans match your search.</div>
              ) : (
                filteredPacks.map(pack => (
                  <article key={pack._id} className="pack-card">
                    <header className="pack-card-header">
                      <div className="pack-amount">{pack.amount}</div>
                      <div className="pack-validity">{pack.validity || '—'}</div>
                    </header>

                    <div className="pack-details">
                      <div className="pack-data">{pack.data || '—'}</div>
                      <div className="pack-calls">{pack.calls || '—'}</div>
                      <div className="pack-sms">{pack.sms || '—'}</div>
                      <div className="pack-description">{pack.description}</div>
                    </div>

                    <footer className="pack-card-footer">
                      <button className="recharge-btn" onClick={() => handleRecharge(pack)}>Recharge</button>
                      <button className="details-btn nav-btn" onClick={() => alert(pack.description)}>Details</button>
                    </footer>
                  </article>
                ))
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Jio;