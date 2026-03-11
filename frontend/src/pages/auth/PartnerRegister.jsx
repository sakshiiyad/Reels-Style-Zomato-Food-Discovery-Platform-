import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/auth.css';

const PartnerRegister = () => {
    const navigate = useNavigate();
    const [form, setform] = useState({
        restaurantName: "",
        ownerName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setform((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const API_URL = "http://localhost:5000/api/auth/foodpartner/register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, {
                RestaurantName: form.restaurantName,
                ownerName: form.ownerName,
                email: form.email,
                password: form.password
            }, { withCredentials: true });

            const result = response.data;
            if (!result.success) {
                toast.error(result.message || "Registration failed");
                return;
            }

            toast.success("Partner registration successful!");
            navigate("/partner/login");
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Partner Sign Up</h1>
                    <p className="auth-subtitle">Register your restaurant and grow with us</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="restaurantName">Restaurant Name</label>
                        <input
                            name="restaurantName"
                            value={form.restaurantName}
                            onChange={handleChange}
                            className="auth-input" type="text" id="restaurantName" placeholder="Enter restaurant name" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="ownerName">Owner Name</label>
                        <input
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            className="auth-input" type="text" id="ownerName" placeholder="Enter owner name" />
                    </div>

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
                            className="auth-input" type="password" id="password" placeholder="Create a password" />
                    </div>

                    <button className="auth-button" type="submit">Register</button>
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
