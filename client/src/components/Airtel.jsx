import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Airtel.css';

const Airtel = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const rechargePacks = {
    recommended: [
      { amount: 199, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular choice for daily users' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for 2 months' },
      { amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity pack' },
      { amount: 149, validity: '24 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget friendly option' }
    ],
    unlimited: [
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 265, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 549, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' }
    ],
    movie: [
      { amount: 359, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar included' },
      { amount: 499, validity: '28 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Netflix + Amazon Prime' },
      { amount: 699, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All OTT platforms' },
      { amount: 839, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment bundle' }
    ],
    cricket: [
      { amount: 299, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar Sports' },
      { amount: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete sports package' },
      { amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Full cricket season access' },
      { amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic sports pack' }
    ],
    monthly: [
      { amount: 199, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly plan' },
      { amount: 299, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly plan' },
      { amount: 399, validity: '30 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'High-speed monthly plan' },
      { amount: 149, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Economy monthly plan' }
    ],
    yearly: [
      { amount: 1799, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Full year unlimited plan' },
      { amount: 2399, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly plan' },
      { amount: 2999, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly plan' },
      { amount: 1399, validity: '365 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget yearly plan' }
    ],
    roaming: [
      { amount: 2999, validity: '30 days', data: '100GB', calls: '250 mins', sms: '100', description: 'International roaming - Europe' },
      { amount: 4999, validity: '30 days', data: '200GB', calls: '500 mins', sms: '200', description: 'International roaming - USA' },
      { amount: 1499, validity: '7 days', data: '25GB', calls: '100 mins', sms: '50', description: 'Short trip roaming' },
      { amount: 7999, validity: '60 days', data: '300GB', calls: '1000 mins', sms: '500', description: 'Extended international roaming' }
    ],
    all: [
      { amount: 99, validity: '14 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Starter pack' },
      { amount: 149, validity: '24 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget friendly option' },
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 199, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular choice for daily users' },
      { amount: 265, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 299, validity: '28 days', data: '2.5GB/day + Unlimited 5G', calls: 'Unlimited', sms: '100/day', description: '5G unlimited at night' },
      { amount: 359, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar included' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for 2 months' },
      { amount: 499, validity: '28 days', data: '3GB/day + Unlimited 5G', calls: 'Unlimited', sms: '100/day', description: 'Premium 5G experience' },
      { amount: 549, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity' },
      { amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity pack' },
      { amount: 699, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All OTT platforms' },
      { amount: 719, validity: '56 days', data: '2.5GB/day + Unlimited 5G', calls: 'Unlimited', sms: '100/day', description: 'Extended 5G benefits' },
      { amount: 1399, validity: '365 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget yearly plan' },
      { amount: 1799, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Full year unlimited plan' },
      { amount: 2399, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly plan' },
      { amount: 2999, validity: '30 days', data: '100GB', calls: '250 mins', sms: '100', description: 'International roaming - Europe' }
    ]
  };

  const handleRecharge = (pack) => {
    if (!mobileNumber) {
      alert('Please enter mobile number');
      return;
    }
    
    const rechargeDetails = {
      ...pack,
      mobileNumber: mobileNumber,
      operator: 'Airtel'
    };
    
    onRechargeInitiate(rechargeDetails);
    navigate('/payment', { state: rechargeDetails });
  };

  const filteredPacks = rechargePacks[selectedCategory].filter(pack =>
    pack.amount.toString().includes(searchQuery) ||
    pack.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return null;

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

export default Airtel;