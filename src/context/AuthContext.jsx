import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check for user authentication status
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You can also verify the token by making an API call if necessary
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle login
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
