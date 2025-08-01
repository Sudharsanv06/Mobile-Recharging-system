import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: username.trim(), password: password.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.msg || 'Invalid credentials');
        return;
      }
      // Save token to localStorage (optional)
      localStorage.setItem('token', data.token);
      onLogin(username.trim());
      navigate('/');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login">
        <h2>Welcome Back!</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Enter your email or username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <div className="login-footer">
          <p>New to Top It Up? <Link to="/signup" className="signup-link">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;