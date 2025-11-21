import React, { useState } from 'react';
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [rechargeDetails, setRechargeDetails] = useState(null);

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
  };

  const handleRechargeInitiate = (details) => {
    setRechargeDetails(details);
  };

  return (
    <div className="app">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLogout={handleLogout} 
      />
      <main className="main-content">
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
            path="/about" 
            element={<About />}
          />
          <Route
            path="/operators"
            element={<OperatorsList />}
          />
          <Route
            path="/operators/:id"
            element={<OperatorDetails />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;