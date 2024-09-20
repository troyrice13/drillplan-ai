import React, { useContext, useState, useEffect } from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
const navigate = useNavigate();
const { isLoggedIn,  logout } = useContext(AuthContext);
const [isDarkTheme, setIsDarkTheme] = useState(false);

const handleLogout = () => {
    logout();
    navigate('/');
}

useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setIsDarkTheme(currentTheme === 'dark');
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
}, []);

const toggleTheme = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
};

    return (
        <nav className="header">
            <h2 className="header-title"
            onClick={() => navigate('/')}
            >DrillFit.io
            </h2>
            <div className="nav-buttons">
                {isLoggedIn ? (
                <>
                    <button className="profile-btn" onClick={() => navigate('/profile')}>Profile</button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
                ) : (
                <>
                    <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                    <button className="signup-btn" onClick={() => navigate('/login')}>Sign Up</button>
                </>
                )}
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </nav>
    )
}