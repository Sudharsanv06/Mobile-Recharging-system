import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || addAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/users/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseInt(addAmount) })
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({ ...prev, balance: data.balance }));
        setAddAmount('');
        setShowAddMoney(false);
        alert(`Successfully added ₹${addAmount} to your wallet!`);
      } else {
        alert('Failed to add money to wallet');
      }
    } catch (error) {
      alert('Error adding money to wallet');
    }
  };

  if (loading) {
    return (
      <div className="profile">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">{currentUser.charAt(0).toUpperCase()}</span>
          </div>
          <h2>Welcome, {currentUser}!</h2>
          <p className="profile-subtitle">Manage your mobile recharge account</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Username:</label>
                <span>{userData?.name || currentUser}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{userData?.email || `${currentUser.toLowerCase()}@example.com`}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{userData?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="info-item">
                <label>Member Since:</label>
                <span>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'January 2025'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Wallet Balance</h3>
            <div className="wallet-section">
              <div className="balance-display">
                <span className="balance-amount">₹{userData?.balance || 0}</span>
                <span className="balance-label">Available Balance</span>
              </div>
              <button 
                className="add-money-btn"
                onClick={() => setShowAddMoney(!showAddMoney)}
              >
                {showAddMoney ? 'Cancel' : 'Add Money'}
              </button>
            </div>
            
            {showAddMoney && (
              <div className="add-money-form">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="amount-input"
                />
                <button 
                  className="confirm-btn"
                  onClick={handleAddMoney}
                >
                  Add Money
                </button>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn primary">New Recharge</button>
              <button className="action-btn">Recharge History</button>
              <button className="action-btn">Update Profile</button>
              <button className="action-btn">Wallet Balance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;