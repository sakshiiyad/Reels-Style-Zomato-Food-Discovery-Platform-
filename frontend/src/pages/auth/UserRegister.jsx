import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
    const navigate = useNavigate();
    const [form, setform] = useState({
        Name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setform((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

    }
    const API_URL = `http://localhost:5000/api/auth/user/register`;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = form.Name
        const email = form.email
        const password = form.password
        try {

            const response = await axios.post(API_URL, {
                name,
                email,
                password

            },
                { withCredentials: true },
            )
            const result = response.data;
            console.log(response.data);
            if (!result.success) {
                toast.error(result.message || "user already exists");
                return;
            }

            toast.success("Registration successful!");
            navigate("/")
        } catch (err) {
            toast.error(err.response?.data?.message || "something went wrong");
        }

    }






    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join us and discover delicious food</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="auth-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="name">Full Name</label>
                        <input
                            name="Name"
                            value={form.Name}
                            onChange={handleChange}
                            className="auth-input" type="text" id="name" placeholder="Enter your full name" />
                    </div>

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
                            onChange={handleChange}
                            className="auth-input" type="password" id="password" placeholder="Create a password" />
                    </div>

                    <button className="auth-button" type="submit">Sign Up</button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login" className="auth-link">Login</Link>
                </div>

                <div className="auth-role-switch">
                    Want to partner with us?
                    <Link to="/partner/register" className="auth-link">Partner Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
