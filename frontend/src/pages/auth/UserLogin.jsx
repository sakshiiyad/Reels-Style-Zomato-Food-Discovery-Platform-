import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserLogin = () => {
    const navigate = useNavigate();
    const [form, setform] = useState({
        email: "",
        password: "",
    })
    const handleChange = (e) => {
        console.log(e.target.value)
        setform((prev) => (
            {
                ...prev,
                [e.target.name]: e.target.value

            }

        ))

    }
    const API_URL = `/api/auth/user/login`;
    const handleSubmit = async (e) => {
        e.preventDefault();
        //frontend side validation
        if (!form.email || !form.password) {
            return toast.error("please fill all the fields");
        }

        try {
            const response = await axios.post(API_URL,
                {
                    email: form.email,
                    password: form.password
                },
                { withCredentials: true }
            );
            const result = response.data;
            console.log(result);
            if (!result.success) {
                toast.error(result.message || "Login failed");
                return;
            }
            toast.success(result.message || "Login successful!");
            // Set role in local storage
            localStorage.setItem('role', 'user');

            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    }




    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to your food account to continue</p>
                </div>

                <form onSubmit={handleSubmit}
                    className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}


                            className="auth-input" type="email" id="email" placeholder="Enter your email" />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange} className="auth-input" type="password" id="password" placeholder="Enter your password" />
                    </div>

                    <button className="auth-button" type="submit">Login</button>
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
