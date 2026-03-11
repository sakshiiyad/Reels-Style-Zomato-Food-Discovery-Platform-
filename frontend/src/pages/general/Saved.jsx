import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/home-reels.css';

const VideoReel = ({ reel }) => {
    const videoRef = useRef(null);
    const [likesCount, setLikesCount] = useState(reel.likecount || 0);
    const [isLiked, setIsLiked] = useState(reel.isLiked || false); // Initialize from backend state
    const [savesCount, setSavesCount] = useState(reel.savecount || 0);
    const [isSaved, setIsSaved] = useState(reel.isSaved || false);

    const handleLike = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/food/like", { foodId: reel._id }, { withCredentials: true });
            if (response.data.message.includes("unliked")) {
                setLikesCount(prev => Math.max(0, prev - 1));
                setIsLiked(false);
            } else {
                setLikesCount(prev => prev + 1);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error liking video:", error);
            if (error.response?.status === 401) {
                toast.error("Please log in as a user to like videos.");
            } else {
                toast.error(error.response?.data?.message || "Failed to like video.");
            }
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/food/save", { foodId: reel._id }, { withCredentials: true });
            if (response.data.message.includes("unsaved")) {
                setSavesCount(prev => Math.max(0, prev - 1));
                setIsSaved(false);
                toast.success("Removed from saved reels");
            } else {
                setSavesCount(prev => prev + 1);
                setIsSaved(true);
                toast.success("Saved successfully");
            }
        } catch (error) {
            console.error("Error saving video:", error);
            if (error.response?.status === 401) {
                toast.error("Please log in as a user to save videos.");
            } else {
                toast.error(error.response?.data?.message || "Failed to save video.");
            }
        }
    };

    useEffect(() => {
        const options = {
            root: null, // use the viewport
            rootMargin: '0px',
            threshold: 0.5 // trigger when 50% of the video is in view
        };

        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (videoRef.current) {
                        videoRef.current.play().catch(error => {
                            console.warn("Autoplay was prevented:", error);
                        });
                    }
                } else {
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        // Cleanup the observer when the component unmounts
        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <div className="video-card">
            <video
                ref={videoRef}
                className="video-player"
                src={reel.video}
                loop
                muted
                playsInline
            />

            {/* Right side interactive actions */}
            <div className="video-actions-right">
                <div className="action-button" onClick={handleLike}>
                    <svg viewBox="0 0 24 24" fill={isLiked ? "#ef4f5f" : "none"} stroke={isLiked ? "#ef4f5f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, stroke 0.2s" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>{likesCount}</span>
                </div>
                <div className="action-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>45</span>
                </div>
                <div className="action-button" onClick={handleSave}>
                    <svg viewBox="0 0 24 24" fill={isSaved ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, stroke 0.2s" }}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{savesCount}</span>
                </div>
            </div>

            <div className="video-overlay">
                <h3>{reel.name}</h3>
                <p className="video-description">
                    {reel.description}
                </p>
                <button className="visit-store-btn" onClick={() => window.location.href = `/partner/${reel.foodPartner}`}>
                    Visit store
                </button>
            </div>
        </div>
    );
};

const Saved = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:5000/api/auth/user/logout', { withCredentials: true });
            localStorage.removeItem('role');
            toast.success("Logged out successfully");
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout error", error);
            toast.error("Failed to logout");
        }
    };

    useEffect(() => {
        const fetchSavedItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/food/saved", {
                    withCredentials: true
                });

                if (response.data.success) {
                    setReels(response.data.foodItems);
                } else {
                    toast.error("Failed to fetch saved videos");
                }
            } catch (error) {
                console.error("Error fetching reels:", error);
                if (error.response?.status === 401) {
                    toast.error("Please log in to see saved videos");
                } else {
                    toast.error("An error occurred while loading videos");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, []);

    if (loading) {
        return <div style={{ color: "white", padding: "20px", textAlign: "center", backgroundColor: "#111", minHeight: "100vh" }}>Loading saved videos...</div>;
    }

    return (
        <div className="app-container">
            <div className="reels-container">
                {reels.length === 0 ? (
                    <div style={{ color: "white", padding: "20px", textAlign: "center", backgroundColor: "#111", minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h2>No saved reels yet. Start exploring and save your favorites!</h2>
                    </div>
                ) : (
                    reels.map((reel) => (
                        <VideoReel key={reel._id} reel={reel} />
                    ))
                )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="bottom-nav-bar">
                <div className="nav-item" onClick={() => window.location.href = '/home'}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </div>
                <div className="nav-item active" onClick={() => window.location.href = '/saved'}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>Saved</span>
                </div>
                <div className="nav-item" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Saved;
