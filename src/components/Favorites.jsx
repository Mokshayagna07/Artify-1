import React, { useState } from 'react';
import { useGallery } from '../context/GalleryContext';
import { useNavigate } from 'react-router-dom';
import ImageCard from './ImageCard';
import '../css/Gallery.css'; // Reuse gallery styles
import '../css/GalleryModal.css';

const Favorites = () => {
    const { galleryImages, toggleFavorite, deleteImageFromGallery } = useGallery();
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Filter only favorites
    const favorites = galleryImages.filter(img => img.isFavorite);

    return (
        <div className="gallery-container">
            <h1 className="gallery-title">My Favorites</h1>

            <div className="images-grid">
                {favorites.length > 0 ? (
                    favorites.map(img => (
                        <ImageCard
                            key={img.id}
                            image={img}
                            onToggleFavorite={toggleFavorite}
                            onDelete={deleteImageFromGallery}
                            onClick={() => setSelectedImage(img)}
                            showDelete={false} // Safety: Don't allow permanent delete from Favorites view, only 'Heart' to unfavorite.
                        />
                    ))
                ) : (
                    <div className="no-images">
                        <p>No favorites yet.</p>
                        <button
                            className="filter-btn active"
                            style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '20px', background: '#6a11cb', color: 'white', border: 'none', cursor: 'pointer' }}
                            onClick={() => navigate('/gallery')}
                        >
                            Browse Gallery
                        </button>
                    </div>
                )}
            </div>

            {/* Reuse Image Modal logic */}
            {selectedImage && (
                <div className="image-modal-overlay" onClick={() => setSelectedImage(null)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="image-modal-content" onClick={e => e.stopPropagation()} style={{
                        background: '#1a1a2e', padding: '20px', borderRadius: '12px', maxWidth: '90vw', maxHeight: '90vh'
                    }}>
                        <button className="close-modal-btn" onClick={() => setSelectedImage(null)} style={{ float: 'right', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.label}
                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', display: 'block' }}
                        />
                        <div className="modal-caption" style={{ marginTop: '10px', color: 'white', textAlign: 'center' }}>{selectedImage.label}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
