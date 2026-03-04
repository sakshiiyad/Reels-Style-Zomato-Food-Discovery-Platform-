import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const PartnerRegister = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Partner Sign Up</h1>
                    <p className="auth-subtitle">Register your restaurant and grow with us</p>
                </div>

                <form className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="restaurantName">Restaurant Name</label>
                        <input className="auth-input" type="text" id="restaurantName" placeholder="Enter restaurant name" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="ownerName">Owner Name</label>
                        <input className="auth-input" type="text" id="ownerName" placeholder="Enter owner name" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Business Email</label>
                        <input className="auth-input" type="email" id="email" placeholder="Enter business email" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="auth-input" type="password" id="password" placeholder="Create a password" />
                    </div>

                    <button className="auth-button" type="button">Register</button>
                </form>

                <div className="auth-footer">
                    Already a partner?
                    <Link to="/partner/login" className="auth-link">Login here</Link>
                </div>

                <div className="auth-role-switch">
                    Just looking for food?
                    <Link to="/register" className="auth-link">User Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default PartnerRegister;
