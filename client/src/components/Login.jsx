import React, { useState } from 'react';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, ErrorMessage } from './common';
import './Login.css';
import { useAuth } from '../contexts/authContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const schema = z.object({
      emailOrUsername: z.string().min(1, 'Email or username is required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    });
    const result = schema.safeParse({ emailOrUsername: username.trim(), password: password });
    if (!result.success) return result.error.errors[0].message;
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const resp = await login({ emailOrUsername: username.trim(), password: password.trim() });
      if (resp.ok) {
        navigate('/');
      } else {
        setError(resp.message || 'Invalid credentials');
      }
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