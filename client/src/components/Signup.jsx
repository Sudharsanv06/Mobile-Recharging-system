import React, { useState } from 'react';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, ErrorMessage } from './common';
import './Signup.css';
import { useAuth } from '../contexts/authContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

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
    // Validate with Zod schema
    const schema = z.object({
      name: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
      password: z.string().min(8, 'Password must be at least 8 characters').regex(/(?=.*[A-Z])(?=.*\d)/, 'Password must include an uppercase letter and a number'),
      confirmPassword: z.string().min(1)
    }).refine(data => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

    const payload = { name: username.trim(), email: email.trim(), phone: phone.trim(), password, confirmPassword };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      };
      const resp = await register(payload);
      if (resp.ok) {
        navigate('/');
      } else {
        setError(resp.message || 'Registration failed');
      }
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