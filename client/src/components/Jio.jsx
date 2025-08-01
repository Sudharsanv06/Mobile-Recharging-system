import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Jio.css';
import JioLogo from './reliance-jio-logo-1.svg';

const Jio = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
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
    const fetchOperator = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/operators');
        const operators = await response.json();
        const jioOperator = operators.find(op => op.name === 'Jio');
        if (jioOperator) {
          setOperator(jioOperator);
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
      if ([149, 239, 399].includes(plan.amount)) {
        categorized.recommended.push(plan);
      }
      
      // Unlimited plans (focus on calls)
      if ([155, 209, 479, 719].includes(plan.amount)) {
        categorized.unlimited.push(plan);
      }
      
      // Movie plans (entertainment focused)
      if ([329, 449, 719, 899].includes(plan.amount)) {
        categorized.movie.push(plan);
      }
      
      // Cricket plans (sports focused)
      if ([279, 449, 649].includes(plan.amount)) {
        categorized.cricket.push(plan);
      }
      
      // Monthly plans (standard monthly)
      if ([149, 239, 349, 549].includes(plan.amount)) {
        categorized.monthly.push(plan);
      }
      
      // Yearly plans (long validity)
      if ([1899, 2999, 4199].includes(plan.amount)) {
        categorized.yearly.push(plan);
      }
      
      // Roaming plans (international)
      if ([2899, 5751, 1299, 8999].includes(plan.amount)) {
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
      operator: 'Jio',
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
      <div className="jio-page">
        <div className="loading">Loading Jio plans...</div>
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="jio-page">
        <div className="error">Error loading operator data</div>
      </div>
    );
  }

  return (
    <div className="jio-page">
      <nav className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img src={JioLogo} alt="Jio" className="jio-logo" />
          </div>
          
          <div className="nav-menu">
            <div className="dropdown">
              <button className="dropdown-btn">JioFiber</button>
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
                <a href="#">Port to Jio</a>
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
            <h3>Enter Mobile Number</h3>
            <div className="input-group">
              <div className="country-code">
                🇮🇳 +91
              </div>
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
            <h3>Search Packs</h3>
            <div className="search-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by amount or description"
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="pack-categories">
            <button
              className={selectedCategory === 'recommended' ? 'active' : ''}
              onClick={() => setSelectedCategory('recommended')}
            >
              Recommended
            </button>
            <button
              className={selectedCategory === 'unlimited' ? 'active' : ''}
              onClick={() => setSelectedCategory('unlimited')}
            >
              Unlimited Calls
            </button>
            <button
              className={selectedCategory === 'movie' ? 'active' : ''}
              onClick={() => setSelectedCategory('movie')}
            >
              Movie Packs
            </button>
            <button
              className={selectedCategory === 'cricket' ? 'active' : ''}
              onClick={() => setSelectedCategory('cricket')}
            >
              Cricket Packs
            </button>
            <button
              className={selectedCategory === 'monthly' ? 'active' : ''}
              onClick={() => setSelectedCategory('monthly')}
            >
              Monthly Packs
            </button>
            <button
              className={selectedCategory === 'yearly' ? 'active' : ''}
              onClick={() => setSelectedCategory('yearly')}
            >
              Yearly Packs
            </button>
            <button
              className={selectedCategory === 'roaming' ? 'active' : ''}
              onClick={() => setSelectedCategory('roaming')}
            >
              International Roaming
            </button>
            <button
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All Packs
            </button>
          </div>

          <div className="packs-grid">
            {filteredPacks.map((pack, index) => (
              <div key={pack._id || index} className="pack-card">
                <div className="pack-amount">₹{pack.amount}</div>
                <div className="pack-details">
                  <div className="pack-validity">Validity: {pack.validity}</div>
                  <div className="pack-data">Data: {pack.data}</div>
                  <div className="pack-calls">Calls: {pack.calls}</div>
                  <div className="pack-sms">SMS: {pack.sms}</div>
                  <div className="pack-description">{pack.description}</div>
                </div>
                <button
                  className="recharge-btn"
                  onClick={() => handleRecharge(pack)}
                >
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

export default Jio;