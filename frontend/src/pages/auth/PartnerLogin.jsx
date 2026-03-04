import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const PartnerLogin = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Partner Login</h1>
                    <p className="auth-subtitle">Manage your restaurant and orders</p>
                </div>

                <form className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Business Email</label>
                        <input className="auth-input" type="email" id="email" placeholder="Enter business email" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="auth-input" type="password" id="password" placeholder="Enter password" />
                    </div>

                    <button className="auth-button" type="button">Login to Dashboard</button>
                </form>

                <div className="auth-footer">
                    New to our platform?
                    <Link to="/partner/register" className="auth-link">Register your restaurant</Link>
                </div>

                <div className="auth-role-switch">
                    Looking to order food?
                    <Link to="/login" className="auth-link">User Login</Link>
                </div>
            </div>
        </div>
    );
};

export default PartnerLogin;
