import React, { useEffect, useState } from 'react';
import '../../styles/Profile.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';

const Profile = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ RestaurantName: '', ownerName: '', address: '' });
    const [isOwner, setIsOwner] = useState(false);
    const [selectedReel, setSelectedReel] = useState(null);

    const role = localStorage.getItem('role') || 'user';

    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/foodpartner/logout', { withCredentials: true });
            localStorage.removeItem('role');
            localStorage.removeItem('partnerId');
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout error", error);
            toast.error("Failed to logout");
        }
    };

    // Import Cart tools
    const { addToCart, cart } = useCart();

    const API_URL = `/api/foodPartner/${id}`;

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await axios.get(API_URL, {
                    withCredentials: true
                });
                const result = response.data;
                setProfile(result);
                // Assuming properties are returned in `result`. Adjust these depending on actual backend response:
                setVideos(result.videos || result.foods || []);
                setEditData({
                    RestaurantName: result.RestaurantName || result.name || '',
                    ownerName: result.ownerName || '',
                    address: result.address || ''
                });
                // If backend returns a flag indicating true ownership, we store it:
                setIsOwner(result.isOwner || false);
                console.log(result);
            } catch (error) {
                console.error('Error fetching profile', error);
            }
        };
        fetchApi();
    }, [id, API_URL]);

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            await axios.delete(`/api/food/${videoId}`, {
                withCredentials: true
            });
            setVideos(videos.filter(v => (v._id || v.id) !== videoId));
            alert("Video deleted successfully");
        } catch (error) {
            console.error('Error deleting video', error);
            alert("Failed to delete the video");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assume there's an endpoint to update profile
            const response = await axios.put(`/api/foodPartner/${id}`, editData, {
                withCredentials: true
            });
            setProfile({ ...profile, ...editData });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile");
        }
    }; return (
        <div className="profile-wrapper">
            {/* If viewed by a customer, afford them a floating shortcut to verify their order explicitly */}
            {!isOwner && cart.length > 0 && (
                <Link to="/cart" className="floating-cart-shortcut" style={{
                    position: 'fixed', bottom: '30px', right: '30px', background: 'var(--primary-color)',
                    color: 'white', padding: '16px 20px', borderRadius: '50px', textDecoration: 'none',
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 900,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', animation: 'modalPop 0.3s'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    View Cart ({cart.length})
                </Link>
            )}

            <div className="profile-container">
                {/* Profile Header Block */}
                <div className="profile-header-card">
                    <div className="profile-avatar-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"
                            alt="Restaurant Avatar"
                            className="profile-avatar"
                        />
                    </div>

                    <div className="profile-details">
                        {isEditing ? (
                            <form className="edit-profile-form" onSubmit={handleEditSubmit}>
                                <input
                                    type="text"
                                    value={editData.RestaurantName}
                                    onChange={(e) => setEditData({ ...editData, RestaurantName: e.target.value })}
                                    className="edit-input"
                                    placeholder="Restaurant Name"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editData.ownerName}
                                    onChange={(e) => setEditData({ ...editData, ownerName: e.target.value })}
                                    className="edit-input"
                                    placeholder="Owner Name"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editData.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                    className="edit-input"
                                    placeholder="Address"
                                    required
                                />
                                <div className="edit-actions">
                                    <button type="submit" className="save-btn">Save</button>
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h1 className="restaurant-name">
                                    {profile ? (profile.RestaurantName || profile.name) : "Loading..."}
                                    {isOwner && (
                                        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                    )}
                                </h1>
                                <p className="restaurant-address" style={{ marginBottom: "6px" }}>
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px", marginRight: "4px" }}>
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>
                                        {profile ? profile.ownerName : "Loading Owner..."}
                                    </span>
                                </p>
                                <p className="restaurant-address">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px", marginRight: "4px" }}>
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {profile ? (profile.address || "Address not provided yet") : "Loading Address..."}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="profile-stats-container">
                        <div className="stat-box">
                            <div className="stat-icon-wrapper meals-icon">
                                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                    <path d="M7 2v20"></path>
                                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                                </svg>
                            </div>
                            <div className="stat-text">
                                <span className="stat-value">2,500+</span>
                                <span className="stat-label">Meals Served</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon-wrapper customers-icon">
                                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div className="stat-text">
                                <span className="stat-value">15K+</span>
                                <span className="stat-label">Customers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reels Section */}
                <div className="reels-section">
                    <div className="reels-header">
                        {isOwner && <span className="delete-header-text">delete</span>}
                    </div>
                    <div className="reels-grid">
                        {videos && videos.length > 0 ? videos.map((reel) => (
                            <div key={reel._id || reel.id} className="reel-card" onClick={() => setSelectedReel(reel)}>
                                {/* Since these are reels, we'll try to display a video element directly */}
                                {/* Fallback to a thumbnail image if you had one in your data instead */}
                                {reel.video || reel.videoUrl ? (
                                    <video src={reel.video || reel.videoUrl} className="reel-thumbnail" muted playsInline loop autoPlay />
                                ) : (
                                    <img src={reel.thumbnail || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} alt={`Reel ${reel.name}`} className="reel-thumbnail" />
                                )}

                                <div className="reel-overlay">
                                    {isOwner && (
                                        <button className="delete-reel-btn" onClick={(e) => { e.stopPropagation(); handleDeleteVideo(reel._id || reel.id); }} title="Delete Reel">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    )}
                                    <div className="reel-stats">
                                        <span className="reel-title">{reel.name || reel.foodName || "Untitled Reel"}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="no-videos">No reels uploaded yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Details Modal */}
            {selectedReel && (
                <div className="reel-modal-overlay" onClick={() => setSelectedReel(null)}>
                    <div className="reel-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedReel(null)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="modal-video-container">
                            <video src={selectedReel.video || selectedReel.videoUrl} controls autoPlay className="modal-video" />
                        </div>
                        <div className="modal-details">
                            <h2 className="modal-food-name">{selectedReel.name || selectedReel.foodName || "Untitled Reel"}</h2>
                            {selectedReel.price && <div className="modal-food-price">₹{selectedReel.price}</div>}
                            <p className="modal-food-description">{selectedReel.description || "No description provided."}</p>

                            {/* Render Add to Cart only for users, not the actual store owner */}
                            {!isOwner && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button className="modal-add-to-cart-btn" onClick={() => {
                                        addToCart(selectedReel);
                                    }} style={{ flex: 1, margin: 0 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
                                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Add to Cart
                                    </button>
                                    <button className="modal-add-to-cart-btn" onClick={async () => {
                                        try {
                                            const response = await axios.post("/api/food/save", { foodId: selectedReel._id || selectedReel.id }, { withCredentials: true });
                                            if (response.data.message.includes("unsaved")) {
                                                alert("Removed from saved reels");
                                            } else {
                                                alert("Saved successfully");
                                            }
                                        } catch (error) {
                                            console.error("Error saving video:", error);
                                            alert("Failed to save video.");
                                        }
                                    }} style={{ background: '#333', color: 'white', border: '1px solid #444', margin: 0, padding: '0 20px', borderRadius: '50px' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar explicitly for Food Partner inside Profile */}
            {isOwner && (
                <div className="bottom-nav-bar profile-bottom-nav">
                    <div className="nav-item" onClick={() => navigate('/home')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Home</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/create-food')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Upload</span>
                    </div>
                    <div className="nav-item active" onClick={() => {
                        const partnerId = localStorage.getItem('partnerId');
                        if (partnerId) navigate(`/partner/${partnerId}`);
                        else {
                            toast.error("Profile ID not found. Please login again.");
                            navigate('/login');
                        }
                    }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Profile</span>
                    </div>
                    <div className="nav-item" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
