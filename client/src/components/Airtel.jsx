import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, LoadingSpinner, ErrorMessage } from './common';
import { toast } from '../utils/toast';
import './Airtel.css';

const Airtel = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/v1/operators');
        if (!response.ok) {
          throw new Error('Failed to fetch operators');
        }
        const resJson = await response.json();
        const operators = resJson?.data || resJson;
        const airtelOperator = Array.isArray(operators) ? operators.find(op => op.name === 'Airtel') : null;
        if (airtelOperator) {
          setOperator(airtelOperator);
        } else {
          setError('Airtel operator data not found');
        }
      } catch (error) {
        console.error('Error fetching operator:', error);
        setError('Failed to load Airtel plans. Please try again.');
        toast.error('Failed to load plans');
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
      if ([199, 399, 599, 149].includes(plan.amount)) {
        categorized.recommended.push(plan);
      }
      
      // Unlimited plans (focus on calls)
      if ([179, 265, 549, 719].includes(plan.amount)) {
        categorized.unlimited.push(plan);
      }
      
      // Movie plans (entertainment focused)
      if ([359, 499, 699, 839].includes(plan.amount)) {
        categorized.movie.push(plan);
      }
      
      // Cricket plans (sports focused)
      if ([299, 449, 599, 199].includes(plan.amount)) {
        categorized.cricket.push(plan);
      }
      
      // Monthly plans (standard monthly)
      if ([199, 299, 399, 149].includes(plan.amount)) {
        categorized.monthly.push(plan);
      }
      
      // Yearly plans (long validity)
      if ([1799, 2399, 2999, 1399].includes(plan.amount)) {
        categorized.yearly.push(plan);
      }
      
      // Roaming plans (international)
      if ([2999, 4999, 1499, 7999].includes(plan.amount)) {
        categorized.roaming.push(plan);
      }
    });

    return categorized;
  };

  const rechargePacks = operator ? categorizePlans(operator.plans) : {};

  const handleRecharge = (pack) => {
    if (!mobileNumber) {
      toast.warning('Please enter mobile number');
      return;
    }
    
    if (mobileNumber.length !== 10) {
      toast.warning('Please enter a valid 10-digit mobile number');
      return;
    }
    
    const rechargeDetails = {
      ...pack,
      mobileNumber: mobileNumber,
      operator: 'Airtel',
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
      <div className="airtel-page">
        <LoadingSpinner fullscreen text="Loading Airtel plans..." />
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="airtel-page">
        <div className="error-container">
          <ErrorMessage 
            title="Unable to Load Plans"
            message={error || 'Operator data not available'}
            type="error"
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="airtel-page">
      <nav className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img src="https://logos-world.net/wp-content/uploads/2020/11/Airtel-Logo.png" alt="Airtel" />
          </div>
          <div className="nav-menu">
            <div className="dropdown">
              <button className="dropdown-btn">WiFi</button>
              <div className="dropdown-content">
                <a href="#">Broadband Plans</a>
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
                <a href="#">Port to Airtel</a>
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
            {filteredPacks.length === 0 ? (
              <div className="no-results">
                <p>No plans found matching your search.</p>
              </div>
            ) : (
              filteredPacks.map((pack, index) => (
                <Card key={index} className="pack-card" variant="elevated">
                  <div className="pack-amount">₹{pack.amount}</div>
                  <div className="pack-details">
                    <div className="pack-validity">Validity: {pack.validity}</div>
                    <div className="pack-data">Data: {pack.data}</div>
                    <div className="pack-calls">Calls: {pack.calls}</div>
                    <div className="pack-sms">SMS: {pack.sms}</div>
                  </div>
                  <div className="pack-description">{pack.description}</div>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => handleRecharge(pack)}
                    disabled={!mobileNumber || mobileNumber.length !== 10}
                  >
                    Recharge Now
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airtel;