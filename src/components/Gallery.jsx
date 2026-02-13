import React, { useState, useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';
import ImageCard from './ImageCard';
import '../css/Gallery.css';

const Gallery = () => {
    const { galleryImages, deleteImageFromGallery, toggleFavorite } = useGallery();
    const [filter, setFilter] = useState('All');
    const [filteredImages, setFilteredImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const filters = ['All', 'Minutes', 'Hours', 'Days', 'Months', 'Years'];

    // Filter Logic
    useEffect(() => {
        const now = Date.now();
        const ONE_MINUTE = 60 * 1000;
        const ONE_HOUR = 60 * ONE_MINUTE;
        const ONE_DAY = 24 * ONE_HOUR;
        const ONE_MONTH = 30 * ONE_DAY;
        const ONE_YEAR = 365 * ONE_DAY;

        let cutoff = 0;

        switch (filter) {
            case 'Minutes': cutoff = ONE_HOUR; break;
            case 'Hours': cutoff = ONE_DAY; break;
            case 'Days': cutoff = 7 * ONE_DAY; break;
            case 'Months': cutoff = ONE_MONTH; break;
            case 'Years': cutoff = ONE_YEAR; break;
            case 'All':
            default: cutoff = Infinity; break;
        }

        const filtered = galleryImages.filter(img => (now - img.timestamp) <= cutoff);
        setFilteredImages(filtered);
    }, [filter, galleryImages]);

    return (
        <div className="gallery-container">
            <h1 className="gallery-title">Your Gallery</h1>

            <div className="filters-container" style={{ display: 'none' }}>
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: filter === f ? 'rgba(255,255,255,0.2)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="images-grid">
                {filteredImages.length > 0 ? (
                    filteredImages.map(img => (
                        <ImageCard
                            key={img.id}
                            image={img}
                            onToggleFavorite={toggleFavorite}
                            onDelete={deleteImageFromGallery}
                            onClick={() => setSelectedImage(img)}
                            showDelete={true}
                        />
                    ))
                ) : (
                    <div className="no-images">No images found for this time range.</div>
                )}
            </div>

            {/* Image Modal */}
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

export default Gallery;
