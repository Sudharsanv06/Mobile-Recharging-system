import React, { useState, useEffect } from 'react';
import { Button, Card, LoadingSpinner, ErrorMessage } from './common';
import { toast } from '../utils/toast';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localName, setLocalName] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view profile');
        return;
      }
      const response = await fetch('http://localhost:5000/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUserData(data);
      setLocalName(data?.name || '');
      setLocalPhone(data?.phone || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || addAmount <= 0) {
      toast.warning('Please enter a valid amount');
      return;
    }

    setAddingMoney(true);
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
        toast.success(`Successfully added ₹${addAmount} to your wallet!`);
      } else {
        toast.error('Failed to add money to wallet');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      toast.error('Error adding money to wallet');
    } finally {
      setAddingMoney(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); alert('Copied to clipboard'); } catch(e) { alert('Copy failed'); }
      document.body.removeChild(el);
    }
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
    // reset local values when entering edit mode
    if (userData) {
      setLocalName(userData.name || '');
      setLocalPhone(userData.phone || '');
    }
  };

  const saveProfile = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: localName, phone: localPhone })
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({ ...prev, name: data.name, phone: data.phone }));
        setEditMode(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile">
        <LoadingSpinner fullscreen text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <div className="error-container">
          <ErrorMessage 
            message={error}
            type="error"
            onRetry={fetchUserData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-card">
            <div className="profile-avatar big">
              <span className="avatar-text">{(userData?.name || currentUser || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="name-title">{userData?.name || currentUser}</h2>
            <p className="profile-subtitle">Manage your mobile recharge account</p>

            <div className="personal-info">
              <div className="info-row">
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-value">{userData?.email || `${currentUser.toLowerCase()}@example.com`}</div>
                </div>
                <button className="copy-btn" onClick={() => handleCopy(userData?.email || `${currentUser.toLowerCase()}@example.com`)}>Copy</button>
              </div>

              <div className="info-row">
                <div>
                  <div className="info-label">Phone</div>
                  <div className="info-value">{userData?.phone || '+91 98765 43210'}</div>
                </div>
                <button className="copy-btn" onClick={() => handleCopy(userData?.phone || '+91 98765 43210')}>Copy</button>
              </div>

              <div className="info-row">
                <div>
                  <div className="info-label">Member Since</div>
                  <div className="info-value">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'January 2025'}</div>
                </div>
              </div>

              <div className="profile-actions">
                {!editMode ? (
                  <Button variant="primary" onClick={toggleEdit}>Edit Profile</Button>
                ) : (
                  <>
                    <input className="inline-input" value={localName} onChange={(e) => setLocalName(e.target.value)} placeholder="Name" />
                    <input className="inline-input" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} placeholder="Phone" />
                    <div style={{display:'flex',gap:8, marginTop: 8}}>
                      <Button variant="primary" onClick={saveProfile} loading={updating} disabled={updating}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={toggleEdit} disabled={updating}>
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-section">
            <h3>Wallet Balance</h3>
            <div className="wallet-section">
              <div className="balance-display">
                <span className="balance-amount">₹{userData?.balance || 0}</span>
                <span className="balance-label">Available Balance</span>
              </div>
              <Button 
                variant={showAddMoney ? "outline" : "success"}
                onClick={() => setShowAddMoney(!showAddMoney)}
              >
                {showAddMoney ? 'Cancel' : 'Add Money'}
              </Button>
            </div>
            {showAddMoney && (
              <div className="add-money-form">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="amount-input"
                  disabled={addingMoney}
                />
                <Button 
                  variant="success"
                  onClick={handleAddMoney}
                  loading={addingMoney}
                  disabled={addingMoney || !addAmount}
                  fullWidth
                >
                  Add Money
                </Button>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Button variant="primary">New Recharge</Button>
              <Button variant="secondary">Recharge History</Button>
              <Button variant="secondary">Wallet Balance</Button>
            </div>
          </div>

          <div className="profile-section">
            <h3>Recent Activity</h3>
            <div className="recent-list">
              <div className="recent-item">No recent transactions — try a recharge.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;