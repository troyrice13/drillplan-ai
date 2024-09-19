import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to show forgot password form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Only needed for registration and forgot password

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      // Forgot Password logic
      try {
        const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
        if (response.status === 200) {
          alert('Password reset link sent! Check your email.');
          setIsForgotPassword(false); // Switch to login form after sending reset link
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error during password reset:', error);
        alert('An error occurred. Please try again later.');
      }
    } else if (isLogin) {
      // Login logic
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          alert('Login successful!');
          navigate('/generator');
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      // Registration logic
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', { username, password, email });
        if (response.status === 201) {
          alert('Registration successful! Please log in.');
          setIsLogin(true); // Switch to login form after registration
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h1 className="login-title">
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Register'}
        </h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {isForgotPassword ? (
            <input
              className="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <>
              {!isLogin && (
                <input
                  className="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              <input
                className="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit" className="login-btn">
            {isForgotPassword ? 'Send Reset Link' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="btn-container">
          {isLogin && (
            <button
              className="forgot-password"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password
            </button>
          )}
          <button
            className="signup-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setIsForgotPassword(false);
            }}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
