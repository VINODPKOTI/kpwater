import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userID'); // Check for authentication (e.g., userID)

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to the login page
    return <Navigate to="/signin" />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
