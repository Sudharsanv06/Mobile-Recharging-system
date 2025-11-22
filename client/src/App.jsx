import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Airtel from './components/Airtel';
import Jio from './components/Jio';
import Vi from './components/Vi';
import BSNL from './components/BSNL';
import Payment from './components/Payment';
import About from './components/About';
import OperatorsList from './components/OperatorsList';
import OperatorDetails from './components/OperatorDetails';

import './App.css';
import Toast from './components/Toast';
import Receipt from './components/Receipt';
import Dashboard from './components/Dashboard';
import RechargeHistory from './components/RechargeHistory';
import WalletModal from './components/WalletModal';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [rechargeDetails, setRechargeDetails] = useState(null);
  const [showWallet, setShowWallet] = useState(false);
  const [balanceUpdated, setBalanceUpdated] = useState(false);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleSignup = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setRechargeDetails(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleRechargeInitiate = (details) => {
    setRechargeDetails(details);
  };

  // Initialize auth state from localStorage so routes stay protected after reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user.name || user.email || '');
    }
  }, []);

  return (
    <div className="app">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLogout={handleLogout} 
      />
      <main className="main-content">
        <Toast />
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isAuthenticated={isAuthenticated} 
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup onSignup={handleSignup} />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile currentUser={currentUser} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/airtel" 
            element={
              isAuthenticated ? (
                <Airtel 
                  isAuthenticated={isAuthenticated} 
                  currentUser={currentUser}
                  onRechargeInitiate={handleRechargeInitiate}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/jio" 
            element={
              isAuthenticated ? (
                <Jio 
                  isAuthenticated={isAuthenticated} 
                  currentUser={currentUser}
                  onRechargeInitiate={handleRechargeInitiate}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/vi" 
            element={
              isAuthenticated ? (
                <Vi 
                  isAuthenticated={isAuthenticated} 
                  currentUser={currentUser}
                  onRechargeInitiate={handleRechargeInitiate}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/bsnl" 
            element={
              isAuthenticated ? (
                <BSNL 
                  isAuthenticated={isAuthenticated} 
                  currentUser={currentUser}
                  onRechargeInitiate={handleRechargeInitiate}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/payment" 
            element={
              isAuthenticated && rechargeDetails ? (
                <Payment 
                  isAuthenticated={isAuthenticated} 
                  currentUser={currentUser}
                  rechargeDetails={rechargeDetails}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard onOpenWallet={() => setShowWallet(true)} balanceUpdated={balanceUpdated} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <RechargeHistory /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/receipt"
            element={<Receipt />}
          />
          <Route 
            path="/about" 
            element={<About />}
          />
          <Route
            path="/operators"
            element={<OperatorsList />}
          />
          <Route
            path="/operators/:operatorId"
            element={<OperatorDetails />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;