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
                    </form>
                </div>
            </div>
        </>
    )
}