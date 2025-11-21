import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BSNL.css';
import BSNLLogo from './bsnl-logo.svg';

const BSNL = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/operators');
        const resJson = await response.json();
        const operators = resJson?.data || resJson;
        const bsnlOperator = Array.isArray(operators) ? operators.find(op => op.name === 'BSNL') : null;
        if (bsnlOperator) {
          setOperator(bsnlOperator);
        }
      } catch (error) {
        console.error('Error fetching operator:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, []);

  // Categorize plans based on amount ranges
  const categorizePlans = (plans) => {
    if (!plans) return {};
    
    const categorized = {
      recommended: [],
      unlimited: [],
      movie: [],
      cricket: [],
      monthly: [],
      yearly: [],
      roaming: [],
      all: plans
    };

    plans.forEach(plan => {
      // Recommended plans (most popular amounts)
      if ([98, 187, 397].includes(plan.amount)) {
        categorized.recommended.push(plan);
      }
      
      // Unlimited plans (focus on calls)
      if ([97, 153, 297, 497].includes(plan.amount)) {
        categorized.unlimited.push(plan);
      }
      
      // Movie plans (entertainment focused)
      if ([247, 347, 447, 647].includes(plan.amount)) {
        categorized.movie.push(plan);
      }
      
      // Cricket plans (sports focused)
      if ([217, 347, 497].includes(plan.amount)) {
        categorized.cricket.push(plan);
      }
      
      // Monthly plans (standard monthly)
      if ([98, 187, 197, 298].includes(plan.amount)) {
        categorized.monthly.push(plan);
      }
      
      // Yearly plans (long validity)
      if ([1199, 2399, 2999].includes(plan.amount)) {
        categorized.yearly.push(plan);
      }
      
      // Roaming plans (international)
      if ([1999, 3999, 999, 5999].includes(plan.amount)) {
        categorized.roaming.push(plan);
      }
    });

    return categorized;
  };

  const rechargePacks = operator ? categorizePlans(operator.plans) : {};

  const handleRecharge = (pack) => {
    if (!mobileNumber) {
      alert('Please enter mobile number');
      return;
    }
    
    const rechargeDetails = {
      ...pack,
      mobileNumber: mobileNumber,
      operator: 'BSNL',
      operatorId: operator._id,
      planId: pack._id
    };
    
    onRechargeInitiate(rechargeDetails);
    navigate('/payment', { state: rechargeDetails });
  };

  const filteredPacks = rechargePacks[selectedCategory] ? rechargePacks[selectedCategory].filter(pack =>
    pack.amount.toString().includes(searchQuery) ||
    pack.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="bsnl-page">
        <div className="loading">Loading BSNL plans...</div>
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="bsnl-page">
        <div className="error">Error loading operator data</div>
      </div>
    );
  }

  return (
    <div className="bsnl-page">
      <nav className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img src={BSNLLogo} alt="BSNL" className="bsnl-logo" />
          </div>
          <div className="nav-menu">
            <div className="dropdown">
              <button className="dropdown-btn">Broadband</button>
              <div className="dropdown-content">
                <a href="#">Fiber Plans</a>
                <a href="#">New Connection</a>
                <a href="#">Bill Payment</a>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropdown-btn">Postpaid</button>
              <div className="dropdown-content">
                <a href="#">Monthly Plans</a>
                <a href="#">Bill Payment</a>
                <a href="#">New Connection</a>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropdown-btn">Prepaid</button>
              <div className="dropdown-content">
                <a href="#">Recharge Plans</a>
                <a href="#">Special Offers</a>
                <a href="#">Port to BSNL</a>
              </div>
            </div>
          </div>
          <div className="profile-section">
            <div className="profile-icon">
              {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="profile-name">{currentUser}</span>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="left-panel">
          <div className="mobile-input-section">
            <h3>📱 Enter Mobile Number</h3>
            <div className="input-group">
              <div className="country-code">🇮🇳 +91</div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                className="mobile-input"
              />
            </div>
          </div>

          <div className="search-section">
            <h3>🔍 Search Packs</h3>
            <div className="search-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by amount or description"
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="pack-categories">
            {Object.keys(rechargePacks).map((key) => (
              <button
                key={key}
                className={selectedCategory === key ? 'active' : ''}
                onClick={() => setSelectedCategory(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>

          <div className="packs-grid">
            {filteredPacks.map((pack, index) => (
              <div key={index} className="pack-card">
                <div className="pack-amount">₹{pack.amount}</div>
                <div className="pack-details">
                  <div className="pack-validity">Validity: {pack.validity}</div>
                  <div className="pack-data">Data: {pack.data}</div>
                  <div className="pack-calls">Calls: {pack.calls}</div>
                  <div className="pack-sms">SMS: {pack.sms}</div>
                </div>
                <div className="pack-description">{pack.description}</div>
                <button className="recharge-btn" onClick={() => handleRecharge(pack)}>
                  Recharge Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSNL;