import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const setTokenExpirationTimer = useCallback((duration) => {
    setTimeout(() => {
      logout();
    }, duration);
  }, [logout]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpiration');
    
    if (token && expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < parseInt(expirationTime)) {
        setIsLoggedIn(true);
        setTokenExpirationTimer(parseInt(expirationTime) - currentTime);
      } else {
        logout();
      }
    }
  }, [setTokenExpirationTimer, logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = (userData, token, expiresIn) => {
    localStorage.setItem('token', token);
    const expirationTime = new Date().getTime() + expiresIn;
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    setIsLoggedIn(true);
    setUser(userData);
    setTokenExpirationTimer(expiresIn);
  };

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token, data.expiresIn);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};