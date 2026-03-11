import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/choose-register.css';

const ChooseRegister = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role === 'user') {
            navigate('/home');
        } else if (role === 'partner') {
            const partnerId = localStorage.getItem('partnerId');
            if (partnerId) {
                navigate(`/partner/${partnerId}`);
            } else {
                navigate('/home');
            }
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">Zomato</div>
                <div className="nav-links">
                    <Link to="/partner/register" className="nav-link">Add Restaurant</Link>
                    <Link to="/login" className="nav-link">Log in</Link>
                    <Link to="/register" className="nav-link signup-btn">Sign up</Link>
                </div>
            </nav>

            <main className="hero-section">
                <h1 className="hero-title">Zomato</h1>
                <p className="hero-subtitle">Discover the best food & drinks in your city</p>

                <div className="split-cards">
                    {/* User Section */}
                    <div className="action-card">
                        <h3>For Foodies</h3>
                        <p>Order food online, explore the best restaurants, and read user reviews.</p>
                        <Link to="/register" className="btn-primary">Create an account</Link>
                        <Link to="/login" className="btn-outline">Log in to order</Link>
                    </div>

                    {/* Partner Section */}
                    <div className="action-card">
                        <h3>For Restaurants</h3>
                        <p>Partner with us, manage your listings, and reach more customers online.</p>
                        <Link to="/partner/register" className="btn-primary">Register restaurant</Link>
                        <Link to="/partner/login" className="btn-outline">Partner login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChooseRegister;