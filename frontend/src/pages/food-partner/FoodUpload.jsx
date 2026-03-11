import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/FoodUpload.css';
import { useNavigate } from 'react-router-dom';

const FoodUpload = () => {
    const navigation = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'video/mp4') {
            setVideo(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        } else {
            alert('Please upload a valid .mp4 video file');
            e.target.value = ''; // reset input
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!name || !description || !video) {
            alert('Please fill out all fields and upload a video');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('video', video);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/food', formData, {
                withCredentials: true
            });

            if (response.status === 200 || response.status === 201) {
                alert('Food Reel Uploaded Successfully!');

                // Reset form
                setName('');
                setDescription('');
                setPrice('');
                setVideo(null);
                setVideoPreview('');

                // Extract partner ID from response and navigate
                const partnerId = response.data?.foodItem?.foodPartner;
                if (partnerId) {
                    navigation(`/partner/${partnerId}`);
                } else {
                    navigation('/home');
                }
            }

        } catch (error) {
            console.error('Error uploading video:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred during upload. Please check your connection and try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="food-upload-container">
            <div className="food-upload-card">
                <div className="food-upload-header">
                    <h2>Upload Food Reel</h2>
                    <p className="subtitle">Share your delicious moments</p>
                </div>

                <form className="food-upload-form" onSubmit={handleUpload}>
                    <div className="form-group">
                        <label htmlFor="foodName">Food Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="foodName"
                                placeholder="e.g. Spicy Garlic Noodles"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <div className="input-wrapper">
                            <textarea
                                id="description"
                                placeholder="Tell us more about this dish..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                id="price"
                                placeholder="e.g. 299"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Video Upload (.mp4)</label>
                        <div className="video-upload-area">
                            <input
                                type="file"
                                id="videoUpload"
                                accept="video/mp4"
                                onChange={handleVideoChange}
                                className="file-input-hidden"
                                required={!video}
                            />
                            <label htmlFor="videoUpload" className={`video-dropzone ${videoPreview ? 'has-video' : ''}`}>
                                {videoPreview ? (
                                    <div className="video-preview-container">
                                        <video src={videoPreview} autoPlay loop muted playsInline className="video-preview" />
                                        <div className="change-video-overlay">
                                            <span>Change Video</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <p>Click to browse or drag video here</p>
                                        <span className="file-hint">Only .mp4 files allowed</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="upload-btn" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Reel'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FoodUpload;
