import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Provide the context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if userID exists in localStorage
    const userID = localStorage.getItem("userID");
    setIsLoggedIn(!!userID);

    // Handle changes in localStorage across tabs
    const handleStorageChange = () => {
      const updatedUserID = localStorage.getItem("userID");
      setIsLoggedIn(!!updatedUserID);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signIn = (userID) => {
    localStorage.setItem("userID", userID);
    setIsLoggedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem("userID");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
