// Airtel.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSkeleton from './LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import './Airtel.css';
import { z } from 'zod';
import { toast } from '../utils/toast';

const Airtel = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Expanded fallback plans with at least 3 packs per category
  const fallbackPlans = {
    name: 'Airtel',
    _id: 'airtel-fallback',
    plans: [
      // Recommended
      { _id: 'a-r1', amount: 99, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Value pack — balanced data + calls' },
      { _id: 'a-r2', amount: 149, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular monthly plan + streaming' },
      { _id: 'a-r3', amount: 199, validity: '28 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', description: 'High-data recommended pack' },
      { _id: 'a-r4', amount: 249, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Value bundle — extra data for 2 months' },

      // Unlimited (3)
      { _id: 'a-u1', amount: 299, validity: '56 days', data: 'Unlimited (Fair Usage)', calls: 'Unlimited', sms: '100/day', description: 'Unlimited data (FUP) — best for heavy users' },
      { _id: 'a-u2', amount: 399, validity: '84 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Longer validity unlimited pack' },
      { _id: 'a-u3', amount: 499, validity: '84 days', data: 'Unlimited (FUP) + OTT', calls: 'Unlimited', sms: '100/day', description: 'Unlimited + OTT subscription' },
      { _id: 'a-u4', amount: 599, validity: '90 days', data: 'Unlimited (FUP) + Premium OTT', calls: 'Unlimited', sms: '100/day', description: 'Premium unlimited — OTT + music included' },

      // Entertainment (3)
      { _id: 'a-e1', amount: 199, validity: '28 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment pack — includes Xstream' },
      { _id: 'a-e2', amount: 349, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'OTT bundle + music service' },
      { _id: 'a-e3', amount: 599, validity: '84 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment + premium streaming' },
      { _id: 'a-e4', amount: 799, validity: '84 days', data: '6GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultra entertainment — multiple OTTs included' },

      // Monthly (3)
      { _id: 'a-m1', amount: 129, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly basic' },
      { _id: 'a-m2', amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly standard' },
      { _id: 'a-m3', amount: 249, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '2-month bundle' },
      { _id: 'a-m4', amount: 219, validity: '28 days', data: '2.2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly value — extra roaming data' },

      // Yearly (3)
      { _id: 'a-y1', amount: 999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual pack — good savings' },
      { _id: 'a-y2', amount: 1499, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual premium — OTT included' },
      { _id: 'a-y3', amount: 1999, validity: '365 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best annual value' },
      { _id: 'a-y4', amount: 2499, validity: '365 days', data: '6GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultra annual — best for heavy users' },

      // Roaming (3)
      { _id: 'a-ro1', amount: 2999, validity: '30 days', data: '10GB roaming pack', calls: 'Local+International', sms: '-', description: 'Roaming pack for travellers' },
      { _id: 'a-ro2', amount: 599, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Roaming-ready plan with ISD' },
      { _id: 'a-ro3', amount: 799, validity: '30 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'International roaming value pack' },
      { _id: 'a-ro4', amount: 1599, validity: '30 days', data: '8GB roaming data', calls: 'International minutes included', sms: '-', description: 'High-value roaming — multiple countries' },

      // Special (3+)
      { _id: 'a-off1', amount: 79, validity: '7 days', data: '1GB/day', calls: '100 min/day', sms: '50/day', description: 'Intro offer for new users' },
      { _id: 'a-off2', amount: 199, validity: '28 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', description: 'Festive offer: extra benefits' },
      { _id: 'a-off3', amount: 49, validity: '3 days', data: '500MB/day', calls: '50 min', sms: '20/day', description: 'Weekend special pack' },
      { _id: 'a-off4', amount: 365, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Limited time: Triple benefit offer' }
    ]
  };

  useEffect(() => {
    const fetchOperator = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/v1/operators');
        const operators = res?.data?.data || res?.data || [];
        const airtelOperator = Array.isArray(operators) ? operators.find(op => op.name === 'Airtel') : null;
        setOperator(airtelOperator || fallbackPlans);
      } catch (err) {
        console.warn('Airtel fetch failed, using fallback plans.', err);
        setOperator(fallbackPlans);
        setError('Could not load live data — showing offline plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, []);

  const categorizePlans = (plans) => {
    if (!plans) return {};
    const categorized = {
      recommended: [],
      unlimited: [],
      entertainment: [],
      monthly: [],
      yearly: [],
      roaming: [],
      special: [],
      all: plans
    };

    plans.forEach(plan => {
      const amt = Number(plan.amount);
      const desc = (plan.description || '').toLowerCase();
      const dataStr = (plan.data || '').toLowerCase();

      // Special offers (check first)
      if (plan._id && plan._id.includes('off')) {
        categorized.special.push(plan);
      }
      
      // Recommended
      if ([99, 129, 149, 199].includes(amt)) {
        categorized.recommended.push(plan);
      }
      
      // Unlimited
      if (desc.includes('unlimited') || dataStr.includes('unlimited')) {
        categorized.unlimited.push(plan);
      }
      
      // Entertainment
      if (desc.includes('ott') || desc.includes('entertain') || desc.includes('streaming') || desc.includes('xstream') || (amt >= 299 && amt < 800)) {
        categorized.entertainment.push(plan);
      }
      
      // Monthly
      if (amt < 300 && plan.validity && (plan.validity.includes('28') || plan.validity.includes('56'))) {
        categorized.monthly.push(plan);
      }
      
      // Yearly
      if (plan.validity && plan.validity.includes('365')) {
        categorized.yearly.push(plan);
      }
      
      // Roaming
      if (desc.includes('roam') || desc.includes('international') || amt >= 2000) {
        categorized.roaming.push(plan);
      }
    });

    // debug: log category counts to help diagnose missing packs
    try {
      const counts = Object.fromEntries(Object.keys(categorized).map(k => [k, categorized[k].length]));
      console.log('Airtel categorize summary:', counts, 'totalPlans:', plans ? plans.length : 0);
    } catch (e) {
      console.log('Airtel categorize debug failed', e);
    }

    return categorized;
  };

  const rechargePacks = operator ? categorizePlans(operator.plans) : {};
  // debug: log selected category + filtered counts (visible in console)
  const filteredPacks = rechargePacks[selectedCategory] ? rechargePacks[selectedCategory].filter(pack =>
    pack.amount.toString().includes(searchQuery) ||
    (pack.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  console.log('Airtel packs loaded:', operator ? operator.plans.length : 0, 'categorizedCounts:', Object.fromEntries(Object.keys(rechargePacks).map(k=>[k, (rechargePacks[k]||[]).length])), 'selectedCategory:', selectedCategory, 'filtered:', filteredPacks.length);
  const displayCategories = ['recommended','unlimited','entertainment','monthly','yearly','roaming','special','all'];

  const handleRecharge = (pack) => {
    const schema = z.object({ mobileNumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number') });
    const v = schema.safeParse({ mobileNumber });
    if (!v.success) {
      toast.error(v.error.errors[0].message);
      return;
    }
    const rechargeDetails = { ...pack, mobileNumber, operator: 'Airtel', operatorId: operator._id, planId: pack._id };
    if (typeof onRechargeInitiate === 'function') onRechargeInitiate(rechargeDetails);
    navigate('/payment', { state: rechargeDetails });
  };

  

  if (!isAuthenticated) return null;

  return (
    <div className="operator-page airtel-page">
      <header className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img className="operator-logo-img" src="https://upload.wikimedia.org/wikipedia/commons/1/10/Airtel_logo.svg" alt="Airtel" />
            <div className="operator-meta">
              <div className="operator-title">Airtel</div>
              <div className="operator-sub">Prepaid · Postpaid · Broadband</div>
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
              <input className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search amount (e.g. 199) or description" />
              <button className="search-btn" onClick={()=>{ /* keep for accessibility */ }}>Search</button>
            </div>
          </div>

          {error && <div className="warning">{error}</div>}
        </aside>

        <section className="right-panel">
          <div className="special-offers">
            <h4>Special Offers</h4>
            <div>
              {(rechargePacks.special || []).slice(0,4).map(o => (
                <button key={o._id} className="offer-pill">₹{o.amount} · {o.description}</button>
              ))}
            </div>
          </div>

          <div className="pack-categories">
            {displayCategories.map(cat => (
              <button key={cat} className={selectedCategory===cat? 'cat active':'cat'} onClick={()=>setSelectedCategory(cat)}>
                {cat.charAt(0).toUpperCase()+cat.slice(1)} <span className="count">{(rechargePacks[cat]||[]).length}</span>
              </button>
            ))}
          </div>

          <div className="packs-grid">
            {loading ? (
              <LoadingSkeleton rows={6} height={80} />
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
                      <button className="recharge-btn" onClick={()=>handleRecharge(pack)}>Recharge</button>
                      <button className="details-btn nav-btn" onClick={()=>alert(pack.description)}>Details</button>
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
}

export default Airtel;