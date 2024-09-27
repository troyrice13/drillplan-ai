import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
        if (response.status === 200) {
          alert('Password reset link sent! Check your email.');
          setIsForgotPassword(false);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error during password reset:', error);
        alert('An error occurred. Please try again later.');
      }
    } else if (isLogin) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
        if (response.status === 200) {
          // Updated to include expiresIn from the response
          login(response.data.user, response.data.token, response.data.expiresIn);
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
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', { username, password, email });
        if (response.status === 201) {
          alert('Registration successful! Please log in.');
          setIsLogin(true);
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