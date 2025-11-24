import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import LoadingSkeleton from './LoadingSkeleton';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 20 }}><LoadingSkeleton rows={4} height={18} /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminProtectedRoute;

