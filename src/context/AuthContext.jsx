import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Optionally fetch user data here if needed
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};