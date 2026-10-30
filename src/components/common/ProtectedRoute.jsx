import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // Redirect to respective dashboard if role doesn't match
    if (currentUser?.role === 'donor') return <Navigate to="/donor/dashboard" replace />;
    if (currentUser?.role === 'recipient' || currentUser?.role === 'hospital') {
      return <Navigate to="/recipient/dashboard" replace />;
    }
    if (currentUser?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
