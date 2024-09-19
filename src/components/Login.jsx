import React from "react";
import './Login.css'

export default function Login() {
    return (
    <>
        <div className="login-container">
            <div className="login">
                <h1 className="login-title">Sign In</h1>
                <form className="login-form">
                    <input className="username" type='text' placeholder="Username" />
                    <input className="password" type='text' placeholder="Password" />
                    <span className="btn-container">
                        <button className="forgot-password">Forgot Password</button>
                        <button className="signup-btn">Signup</button>
                    </span>
                    <button className="login-btn">Login</button>
                </form>
            </div>
        </div>
        </>
    )
}