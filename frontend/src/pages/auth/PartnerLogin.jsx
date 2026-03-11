import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/auth.css';

const PartnerLogin = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const API_URL = "http://localhost:5000/api/auth/foodpartner/login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, {
                email: form.email,
                password: form.password,
            }, { withCredentials: true });

            const result = response.data;
            if (!result.success) {
                toast.error(result.message || "Login failed");
                return;
            }

            toast.success("Partner login successful!");
            // Set role and partnerId in local storage
            localStorage.setItem('role', 'partner');
            const partnerId = result.foodPartner.id || result.foodPartner._id;
            localStorage.setItem('partnerId', partnerId);

            // Redirect straight to partner dashboard profile
            navigate(`/partner/${partnerId}`);
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Partner Login</h1>
                    <p className="auth-subtitle">Manage your restaurant and orders</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Business Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="auth-input" type="email" id="email" placeholder="Enter business email" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="auth-input" type="password" id="password" placeholder="Enter password" />
                    </div>

                    <button className="auth-button" type="submit">Login to Dashboard</button>
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
