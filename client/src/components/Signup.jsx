import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, ErrorMessage } from './common';
import { toast } from '../utils/toast';
import './Signup.css';

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return username.length >= 6 && specialCharRegex.test(username);
  };

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const validatePassword = (password) => {
    const hasNumbers = /\d/.test(password);
    const hasLetters = /[a-zA-Z]/.test(password);
    return password.length >= 6 && hasNumbers && hasLetters;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!validateUsername(username.trim())) {
      setError('Username must be at least 6 characters and contain special characters (!@#$%^&*()_+-=[]{}|;:"\\,.<>?)');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Email must be a valid @gmail.com address');
      return;
    }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters and contain both letters and numbers');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.msg || 'Registration failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      // Save token and user to localStorage
      const token = data?.data?.token;
      const user = data?.data?.user;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      toast.success('Account created successfully! Welcome aboard.');
      onSignup(user?.name || username.trim());
      navigate('/');
    } catch (err) {
      const errorMsg = 'Server error. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Card className="signup-card">
        <div className="signup-header">
          <h2>Join Top It Up!</h2>
          <p className="signup-subtitle">Create your account to get started</p>
        </div>
        
        {error && (
          <ErrorMessage 
            message={error} 
            type="error"
            onDismiss={() => setError('')}
          />
        )}
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Username (6+ chars with special chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Email (@gmail.com only)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              placeholder="Phone number (10 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength="10"
              pattern="[0-9]{10}"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Password (letters + numbers, 6+ chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            fullWidth 
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="signup-footer">
          <p className="signup-footer-text">
            Already have an account? <Link to="/login" className="link-primary">Sign In</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;