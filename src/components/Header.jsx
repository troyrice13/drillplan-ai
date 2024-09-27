import React, { useContext, useState, useEffect } from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleLogout = () => {
        setIsLogoutConfirmOpen(false); // Close the modal before logging out
        logout();
        navigate('/');
    }

    useEffect(() => {
        // Set theme based on local storage or default to light theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        setIsDarkTheme(currentTheme === 'dark');
        document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    }, []);

    useEffect(() => {
        // Ensure dropdown and modal are closed when the login state changes
        setIsDropdownOpen(false);
        setIsLogoutConfirmOpen(false);
    }, [isLoggedIn]);

    const toggleTheme = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setIsDarkTheme(!isDarkTheme);
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-theme', newTheme === 'dark');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openLogoutConfirm = () => {
        setIsDropdownOpen(false); // Close dropdown before opening modal
        setIsLogoutConfirmOpen(true);
    };

    const closeLogoutConfirm = () => {
        setIsLogoutConfirmOpen(false);
    };

    return (
        <nav className="header">
            <h2 className="header-title" onClick={() => navigate('/')}>DrillFit.io</h2>
            <div className="nav-buttons">
                {isLoggedIn ? (
                    <>
                        <button className="generator-btn" onClick={() => navigate('/generator')}>Drill.ai</button>
                        <div className="dropdown">
                            <button className="dropbtn" onClick={toggleDropdown}>
                                Account
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content">
                                    <button className="dropdown-item" onClick={() => navigate('/routines')}>Routines</button>
                                    <button className="dropdown-item" onClick={() => navigate('/profile')}>Profile</button>
                                    <button className="dropdown-item logout-item" onClick={openLogoutConfirm}>Logout</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button className="login-btn" onClick={() => navigate('/login', { state: { isLogin: true } })}>Login</button>
                        <button className="signup-btn" onClick={() => navigate('/login', { state: { isLogin: false } })}>Sign Up</button>
                    </>
                )}
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-card">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to log out?</p>
                        <div className="logout-confirm-buttons">
                            <button className="confirm-logout-btn" onClick={handleLogout}>Yes, Logout</button>
                            <button className="cancel-logout-btn" onClick={closeLogoutConfirm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
