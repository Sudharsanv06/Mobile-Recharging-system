import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vi.css';
import ViLogo from './vi-vodafone-idea.svg';

const Vi = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
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
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular everyday pack' },
      { amount: 359, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium choice with weekend data rollover' },
      { amount: 539, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value for money' }
    ],
    unlimited: [
      { amount: 199, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 249, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Truly unlimited calls' },
      { amount: 449, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity unlimited' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' }
    ],
    movie: [
      { amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Movies & TV included' },
      { amount: 399, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment bundle' },
      { amount: 599, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment package' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate movie experience' }
    ],
    cricket: [
      { amount: 269, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Sports + Live Cricket' },
      { amount: 439, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 639, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' }
    ],
    monthly: [
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget monthly pack' },
      { amount: 249, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly pack' },
      { amount: 319, validity: '28 days', data: '2.5GB/day + 5G Ready', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 5G' },
      { amount: 479, validity: '28 days', data: '3GB/day + 5G Ready', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' }
    ],
    yearly: [
      { amount: 1999, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 3199, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4299, validity: '365 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 5G' }
    ],
    roaming: [
      { amount: 2799, validity: '30 days', data: '75GB', calls: '250 mins', sms: '100', description: 'International roaming - Europe' },
      { amount: 4899, validity: '30 days', data: '150GB', calls: '500 mins', sms: '200', description: 'International roaming - Americas' },
      { amount: 1399, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Weekend international trip' },
      { amount: 7999, validity: '30 days', data: '400GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
    ],
    all: [
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular everyday pack' },
      { amount: 199, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 249, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Truly unlimited calls' },
      { amount: 269, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Sports + Live Cricket' },
      { amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Movies & TV included' },
      { amount: 319, validity: '28 days', data: '2.5GB/day + 5G Ready', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 5G' },
      { amount: 359, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium choice with weekend data rollover' },
      { amount: 399, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment bundle' },
      { amount: 439, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 449, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity unlimited' },
      { amount: 479, validity: '28 days', data: '3GB/day + 5G Ready', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 539, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value for money' },
      { amount: 599, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment package' },
      { amount: 639, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate movie experience' },
      { amount: 1399, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Weekend international trip' },
      { amount: 1999, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2799, validity: '30 days', data: '75GB', calls: '250 mins', sms: '100', description: 'International roaming - Europe' },
      { amount: 3199, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4299, validity: '365 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 5G' },
      { amount: 4899, validity: '30 days', data: '150GB', calls: '500 mins', sms: '200', description: 'International roaming - Americas' },
      { amount: 7999, validity: '30 days', data: '400GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
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
      operator: 'Vi'
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
    <div className="vi-page">
      <nav className="operator-navbar">
        <div className="navbar-container">
          <div className="operator-logo">
            <img src={ViLogo} alt="Vi" className="vi-logo" />
          </div>
          <div className="nav-menu">
            <div className="dropdown">
              <button className="dropdown-btn">Vi Fiber</button>
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
                <a href="#">Port to Vi</a>
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

export default Vi;