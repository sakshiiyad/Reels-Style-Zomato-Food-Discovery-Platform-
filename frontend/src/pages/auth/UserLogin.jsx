import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const UserLogin = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to your food account to continue</p>
                </div>

                <form className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input className="auth-input" type="email" id="email" placeholder="Enter your email" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="auth-input" type="password" id="password" placeholder="Enter your password" />
                    </div>

                    <button className="auth-button" type="button">Login</button>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register" className="auth-link">Sign up</Link>
                </div>

                <div className="auth-role-switch">
                    Are you a food partner?
                    <Link to="/partner/login" className="auth-link">Partner Login</Link>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
