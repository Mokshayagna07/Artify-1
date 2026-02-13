import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { useNavigate } from 'react-router-dom';
import ImageCard from './ImageCard';
import '../css/UserProfile.css';

const UserProfile = () => {
    const { user } = useAuth();
    const { galleryImages, toggleFavorite, deleteImageFromGallery } = useGallery();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('creations');

    // Filter images (assuming all images in local gallery are "yours" for this demo)
    const myCreations = galleryImages;
    const myFavorites = galleryImages.filter(img => img.isFavorite);

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <div className="profile-page-container">
            {/* Profile Header */}
            <div className="profile-header-card">
                <div className="profile-cover"></div>
                <div className="profile-info-section">
                    <div className="profile-avatar-large">
                        {getInitials(user?.name)}
                    </div>

                    <div className="profile-text-content">
                        <h1 className="profile-name">{user?.name}</h1>
                        <p className="profile-email">{user?.email}</p>
                        <p className="profile-bio">Digital Artist & Creator</p>
                    </div>

                    <div className="profile-actions-group">
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-value">{myCreations.length}</span>
                                <span className="stat-label">Creations</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{myFavorites.length}</span>
                                <span className="stat-label">Favorites</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">PRO</span>
                                <span className="stat-label">Plan</span>
                            </div>
                        </div>
                        <button className="edit-profile-btn" onClick={() => navigate('/settings')}>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="profile-content-tabs">
                <button
                    className={`tab-btn ${activeTab === 'creations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('creations')}
                >
                    My Creations
                </button>
                <button
                    className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    Favorites
                </button>
            </div>

            {/* Grid Content */}
            <div className="profile-grid">
                {(activeTab === 'creations' ? myCreations : myFavorites).map((img) => (
                    <ImageCard
                        key={img.id}
                        image={img}
                        onToggleFavorite={toggleFavorite}
                        onDelete={deleteImageFromGallery}
                        showDelete={activeTab === 'creations'}
                    />
                ))}

                {(activeTab === 'creations' ? myCreations : myFavorites).length === 0 && (
                    <div className="empty-state">
                        <p>No images found in this section.</p>
                        {activeTab === 'creations' && (
                            <button className="create-now-btn" onClick={() => navigate('/text-to-image')}>
                                Create Something New
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
