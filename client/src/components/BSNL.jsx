import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BSNL.css';
import BSNLLogo from './bsnl-logo.svg';

const BSNL = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
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
      { amount: 98, validity: '25 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most affordable pack' },
      { amount: 187, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value government network' },
      { amount: 397, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended validity offer' }
    ],
    unlimited: [
      { amount: 97, validity: '22 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 153, validity: '30 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Government backed reliability' },
      { amount: 297, validity: '45 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 497, validity: '75 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long term unlimited' }
    ],
    movie: [
      { amount: 247, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment services included' },
      { amount: 347, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium content bundle' },
      { amount: 447, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment package' },
      { amount: 647, validity: '90 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended entertainment plan' }
    ],
    cricket: [
      { amount: 217, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports content included' },
      { amount: 347, validity: '60 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Cricket season special' },
      { amount: 497, validity: '90 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket package' }
    ],
    monthly: [
      { amount: 98, validity: '25 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget monthly pack' },
      { amount: 187, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly pack' },
      { amount: 197, validity: '30 days', data: '2GB/day + 4G Ready', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 4G' },
      { amount: 298, validity: '30 days', data: '2.5GB/day + 4G Ready', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' }
    ],
    yearly: [
      { amount: 1199, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2399, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day + 4G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 4G' }
    ],
    roaming: [
      { amount: 1999, validity: '30 days', data: '50GB', calls: '200 mins', sms: '100', description: 'International roaming - SAARC' },
      { amount: 3999, validity: '30 days', data: '100GB', calls: '300 mins', sms: '150', description: 'International roaming - Global' },
      { amount: 999, validity: '7 days', data: '15GB', calls: '50 mins', sms: '25', description: 'Short duration roaming' },
      { amount: 5999, validity: '30 days', data: '200GB', calls: '500 mins', sms: '300', description: 'Premium global roaming' }
    ],
    all: [
      { amount: 97, validity: '22 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 98, validity: '25 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most affordable pack' },
      { amount: 153, validity: '30 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Government backed reliability' },
      { amount: 187, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value government network' },
      { amount: 197, validity: '30 days', data: '2GB/day + 4G Ready', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 4G' },
      { amount: 217, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports content included' },
      { amount: 247, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment services included' },
      { amount: 297, validity: '45 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 298, validity: '30 days', data: '2.5GB/day + 4G Ready', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 347, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium content bundle' },
      { amount: 347, validity: '60 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Cricket season special' },
      { amount: 397, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended validity offer' },
      { amount: 447, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment package' },
      { amount: 497, validity: '75 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long term unlimited' },
      { amount: 497, validity: '90 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket package' },
      { amount: 647, validity: '90 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended entertainment plan' },
      { amount: 999, validity: '7 days', data: '15GB', calls: '50 mins', sms: '25', description: 'Short duration roaming' },
      { amount: 1199, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 1999, validity: '30 days', data: '50GB', calls: '200 mins', sms: '100', description: 'International roaming - SAARC' },
      { amount: 2399, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day + 4G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 4G' },
      { amount: 3999, validity: '30 days', data: '100GB', calls: '300 mins', sms: '150', description: 'International roaming - Global' },
      { amount: 5999, validity: '30 days', data: '200GB', calls: '500 mins', sms: '300', description: 'Premium global roaming' }
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
      operator: 'BSNL'
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