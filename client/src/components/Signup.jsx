import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    // Check if username is at least 6 characters and contains special characters
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return username.length >= 6 && specialCharRegex.test(username);
  };

  const validateEmail = (email) => {
    // Check if email ends with @gmail.com
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const validatePassword = (password) => {
    // Check if password contains both numbers and characters
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
        setError(data.msg || 'Registration failed');
        return;
      }
      // Save token to localStorage (optional)
      localStorage.setItem('token', data.token);
      onSignup(username.trim());
      navigate('/');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup">
        <h2>Join Top It Up!</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="Username (6+ chars with special chars)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email (@gmail.com only)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone number (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength="10"
            pattern="[0-9]{10}"
            required
          />
          <input
            type="password"
            placeholder="Password (letters + numbers, 6+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
        </form>
        <div className="signup-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;