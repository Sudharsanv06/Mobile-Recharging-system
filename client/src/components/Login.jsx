import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, LoadingSpinner, ErrorMessage } from './common';
import { toast } from '../utils/toast';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: username.trim(), password: password.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.msg || 'Invalid credentials';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      // Save token and user to localStorage
      const token = data?.data?.token;
      const user = data?.data?.user;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful! Welcome back.');
      onLogin(user?.name || username.trim());
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
    <div className="login-page">
      <Card className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue to Top It Up</p>
        </div>
        
        {error && (
          <ErrorMessage 
            message={error} 
            type="error"
            onDismiss={() => setError('')}
          />
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Email or Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="login-footer">
          <p className="login-footer-text">
            New to Top It Up? <Link to="/signup" className="link-primary">Create Account</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;