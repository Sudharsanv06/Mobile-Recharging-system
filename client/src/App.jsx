import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Airtel from './components/Airtel';
import Jio from './components/Jio';
import Vi from './components/Vi';
import BSNL from './components/BSNL';
import Payment from './components/Payment';
import Success from './components/Success';
import About from './components/About';
import OperatorsList from './components/OperatorsList';
import OperatorDetails from './components/OperatorDetails';

import './App.css';
import { useAuth } from './contexts/authContext';
import Receipt from './components/Receipt';
import Dashboard from './components/Dashboard';
import RechargeHistory from './components/RechargeHistory';
import WalletModal from './components/WalletModal';
import AdminDashboard from './components/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotificationCenter from './components/NotificationCenter';
import PlanSearch from './components/PlanSearch';
import Favorites from './components/Favorites';

const App = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [rechargeDetails, setRechargeDetails] = useState(null);
  const [showWallet, setShowWallet] = useState(false);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setCurrentUser('');
    setRechargeDetails(null);
    logout();
  };

  const handleRechargeInitiate = (details) => {
    setRechargeDetails(details);
  };

  // Initialize auth state from localStorage so routes stay protected after reload
  // sync local `currentUser` display with auth context
  React.useEffect(() => {
    if (user) setCurrentUser(user.name || user.email || '');
    else setCurrentUser('');
  }, [user]);

  return (
    <div className="app">
      <Navbar 
        isAuthenticated={!!user} 
        currentUser={currentUser}
        onLogout={handleLogout} 
      />
      <main className="main-content">
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isAuthenticated={!!user} 
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" replace /> : <Signup />} 
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airtel"
            element={
              <ProtectedRoute>
                <Airtel onRechargeInitiate={handleRechargeInitiate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jio"
            element={
              <ProtectedRoute>
                <Jio onRechargeInitiate={handleRechargeInitiate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vi"
            element={
              <ProtectedRoute>
                <Vi onRechargeInitiate={handleRechargeInitiate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bsnl"
            element={
              <ProtectedRoute>
                <BSNL onRechargeInitiate={handleRechargeInitiate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment rechargeDetails={rechargeDetails} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onOpenWallet={() => setShowWallet(true)} balanceUpdated={balanceUpdated} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <RechargeHistory />
              </ProtectedRoute>
            }
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
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <PlanSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;